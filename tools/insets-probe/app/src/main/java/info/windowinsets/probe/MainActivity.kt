package info.windowinsets.probe

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Intent
import android.content.pm.ActivityInfo
import android.content.res.Configuration
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Bundle
import android.os.SystemClock
import android.provider.Settings
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.add
import androidx.compose.foundation.layout.asPaddingValues
import androidx.compose.foundation.layout.displayCutout
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.systemBars
import androidx.compose.foundation.layout.union
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.foundation.selection.toggleable
import androidx.compose.material3.Button
import androidx.compose.material3.Checkbox
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import androidx.core.util.Consumer
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.window.java.layout.WindowInfoTrackerCallbackAdapter
import androidx.window.layout.FoldingFeature
import androidx.window.layout.WindowInfoTracker
import androidx.window.layout.WindowLayoutInfo
import org.json.JSONObject
import java.io.File
import kotlin.math.abs

class MainActivity : ComponentActivity(), SensorEventListener {
    /** The window's content root: its size and insets are what an app's content receives. */
    private lateinit var root: View

    private var screen by mutableStateOf("phone")
    private var captureStatus by mutableStateOf("Waiting for active window insets…")
    private var output by mutableStateOf("")
    private var tabletReversePortrait by mutableStateOf(false)

    private var latestInsets: WindowInsetsCompat? = null
    private var hingeAngle: Float? = null
    private var foldingFeatures: List<FoldingFeature> = emptyList()
    private var lastJson: String = ""
    private var autoExport = false
    private var expectedDisplayId: Int? = null
    private var screenLabelSource = FlexWindowContract.SCREEN_LABEL_SOURCE_MANUAL

    /** Active orientation sweep, or null. See [OrientationSweep]. */
    private var sweep: Sweep? = null
    private var sweepSummary: String? = null
    /** Files from the last Measure or sweep, sent by Upload. */
    private val lastCaptures = linkedMapOf<String, String>()
    private var uploadStatus: String? = null
    private val sweepCheck = Runnable { checkSweep() }

    private class Sweep(val steps: List<OrientationSweep.Step>) {
        var index = 0
        var stepStartedAt = 0L
        val captures = linkedMapOf<String, String>()
        val skipped = mutableListOf<String>()
        val rotations = mutableSetOf<Int>()
    }

    private val layoutTracker by lazy { WindowInfoTrackerCallbackAdapter(WindowInfoTracker.getOrCreate(this)) }
    private val layoutListener = Consumer<WindowLayoutInfo> { info ->
        foldingFeatures = info.displayFeatures.filterIsInstance<FoldingFeature>()
        refresh()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent { ProbeScreen() }
        root = findViewById(android.R.id.content)

        // Automation: adb shell am start -n info.windowinsets.probe/.MainActivity --es screen main --ez export true
        intent.getStringExtra(FlexWindowContract.EXTRA_SCREEN)?.takeIf { it in SCREENS }?.let { screen = it }
        expectedDisplayId = intent.takeIf { it.hasExtra(FlexWindowContract.EXTRA_EXPECTED_DISPLAY_ID) }
            ?.getIntExtra(FlexWindowContract.EXTRA_EXPECTED_DISPLAY_ID, FlexWindowContract.COVER_DISPLAY_ID)
        screenLabelSource = FlexWindowContract.screenLabelSource(
            intent.getStringExtra(FlexWindowContract.EXTRA_SCREEN_LABEL_SOURCE),
        )
        autoExport = intent.getBooleanExtra("export", false)
        // Automation: ... --ez sweep true  (records every orientation the display allows)
        tabletReversePortrait = intent.getBooleanExtra("tablet", false)
        if (intent.getBooleanExtra("sweep", false)) root.post { startSweep() }

        // Listen on the root so we see exactly what an app's content root would receive.
        // Compose pads the UI itself; the insets pass through unconsumed.
        ViewCompat.setOnApplyWindowInsetsListener(root) { _, insets ->
            latestInsets = insets
            refresh()
            insets
        }
    }

    override fun onStart() {
        super.onStart()
        layoutTracker.addWindowLayoutInfoListener(this, ContextCompat.getMainExecutor(this), layoutListener)
    }

    override fun onStop() {
        layoutTracker.removeWindowLayoutInfoListener(layoutListener)
        super.onStop()
    }

    override fun onResume() {
        super.onResume()
        hingeAngle = null
        ViewCompat.requestApplyInsets(root)
        val sm = getSystemService(SensorManager::class.java)
        sm.getDefaultSensor(Sensor.TYPE_HINGE_ANGLE)?.let {
            sm.registerListener(this, it, SensorManager.SENSOR_DELAY_NORMAL)
        }
    }

    override fun onPause() {
        if (sweep != null) cancelSweep("Sweep stopped: InsetsProbe left the foreground.")
        getSystemService(SensorManager::class.java).unregisterListener(this)
        super.onPause()
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        latestInsets = null
        lastJson = ""
        foldingFeatures = emptyList()
        ViewCompat.requestApplyInsets(root)
    }

    override fun onSensorChanged(event: SensorEvent) {
        val angle = event.values.firstOrNull() ?: return
        val prev = hingeAngle
        hingeAngle = angle
        if (prev == null || abs(prev - angle) >= 1f) refresh()
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) = Unit

    private fun selectedScreen(): String = screen

    private fun refresh() {
        // Every insets/configuration callback restarts the sweep's quiet period.
        if (sweep != null) {
            root.removeCallbacks(sweepCheck)
            root.postDelayed(sweepCheck, OrientationSweep.SETTLE_MS)
        }
        val insets = latestInsets ?: return
        val json = Probe.collect(this, insets, selectedScreen(), hingeAngle, foldingFeatures, screenLabelSource)
        lastJson = json.toString(2)
        output = lastJson
        val bounds = windowManager.currentWindowMetrics.bounds
        val maximumBounds = windowManager.maximumWindowMetrics.bounds
        val displayStatus = display?.displayId?.let { "display $it" } ?: "display unknown"
        val expectedStatus = expectedDisplayId?.let { " · expected display $it" }.orEmpty()
        captureStatus = "Active window: ${bounds.width()} × ${bounds.height()} px · $displayStatus$expectedStatus · " +
            "hinge: ${hingeAngle?.let { "${it.toInt()}°" } ?: "unavailable"}\n" +
            "Full display: ${maximumBounds.width()} × ${maximumBounds.height()} px\n" +
            "Screen label: ${selectedScreen()} ($screenLabelSource; does not switch displays)\n" +
            "Rotation: ${display?.rotation?.let { "${it * 90}°" } ?: "unknown"}" +
            (sweepSummary?.let { "\n$it" }.orEmpty()) +
            (uploadStatus?.let { "\n$it" }.orEmpty()) +
            (sweep?.let { " · sweep ${it.index + 1}/${it.steps.size}: ${it.steps.getOrNull(it.index)?.label}" }.orEmpty())

        if (autoExport) {
            autoExport = false
            // Give WindowInfoTracker a moment to report the FoldingFeature before saving.
            root.postDelayed({
                refresh()
                export()?.let { Log.i(TAG, "Saved ${it.absolutePath}") }
            }, 1000)
        }
    }

    /** Save to app-specific external storage (adb pull-able) and log to logcat. */
    private fun export(quiet: Boolean = false): File? {
        val currentInsets = ViewCompat.getRootWindowInsets(root)
        val bounds = windowManager.currentWindowMetrics.bounds
        val maximumBounds = windowManager.maximumWindowMetrics.bounds
        val reason = CapturePolicy.blockingReason(
            selectedScreen(), hingeAngle,
            currentInsets != null && root.isLaidOut && !root.isLayoutRequested &&
                root.width == bounds.width() && root.height == bounds.height(),
            isInMultiWindowMode,
            expectedDisplayId,
            display?.displayId,
            bounds.width() == maximumBounds.width() && bounds.height() == maximumBounds.height(),
            foldingFeatures.isNotEmpty(),
        )
        if (reason != null) {
            if (!quiet) Toast.makeText(this, reason, Toast.LENGTH_LONG).show()
            Log.w(TAG, "Capture blocked: $reason")
            ViewCompat.requestApplyInsets(root)
            return null
        }
        // A button press must collect now, not export the last callback's JSON.
        val json = Probe.collect(
            this,
            currentInsets!!,
            selectedScreen(),
            hingeAngle,
            foldingFeatures,
            screenLabelSource,
        )
        lastJson = json.toString(2)
        output = lastJson
        val nav = json.getJSONObject("navigation").getString("mode")
        val screen = json.getString("screen")
        val name = OrientationSweep.fileName(screen, nav, display?.rotation, bounds.width() > bounds.height())
        val file = File(getExternalFilesDir(null), name).apply { writeText(lastJson) }
        if (sweep == null) {
            lastCaptures.clear()
            lastCaptures[name] = lastJson
        }
        lastJson.lines().chunked(60).forEach { Log.i(TAG, it.joinToString("\n")) }
        return file
    }

    private fun startSweep() {
        if (sweep != null) return
        sweep = Sweep(OrientationSweep.steps(tabletReversePortrait))
        sweepSummary = null
        applySweepStep()
    }

    private fun applySweepStep() {
        val s = sweep ?: return
        val step = s.steps.getOrNull(s.index) ?: return finishSweep()
        s.stepStartedAt = SystemClock.uptimeMillis()
        requestedOrientation = step.requestedOrientation
        // Already in this orientation: no callback arrives, so schedule the check anyway.
        retrySweepCheck()
        ViewCompat.requestApplyInsets(root)
        refresh()
    }

    /** Runs after a quiet period: capture the step once the window has really rotated. */
    private fun checkSweep() {
        val s = sweep ?: return
        val step = s.steps[s.index]
        val bounds = windowManager.currentWindowMetrics.bounds
        val timedOut = SystemClock.uptimeMillis() - s.stepStartedAt > OrientationSweep.TIMEOUT_MS
        if (!OrientationSweep.reached(step, bounds.width(), bounds.height())) {
            if (timedOut) nextSweepStep("${step.label}: display did not rotate") else retrySweepCheck()
            return
        }
        val rotation = display?.rotation
        OrientationSweep.skipReason(step, rotation, s.rotations)?.let { return nextSweepStep(it) }
        val file = export(quiet = true)
        if (file == null) {
            if (timedOut) nextSweepStep("${step.label}: window did not settle") else retrySweepCheck()
            return
        }
        s.rotations += rotation!!
        s.captures[file.name] = lastJson
        nextSweepStep(null)
    }

    private fun retrySweepCheck() {
        root.removeCallbacks(sweepCheck)
        root.postDelayed(sweepCheck, OrientationSweep.SETTLE_MS)
    }

    private fun nextSweepStep(skip: String?) {
        val s = sweep ?: return
        skip?.let { s.skipped += it; Log.w(TAG, "Sweep skipped $it") }
        s.index++
        applySweepStep()
    }

    private fun finishSweep() {
        val s = sweep ?: return
        sweep = null
        root.removeCallbacks(sweepCheck)
        requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED
        val bundle = JSONObject()
        s.captures.forEach { (name, json) -> bundle.put(name, JSONObject(json)) }
        output = bundle.toString(2)
        val summary = "Sweep saved ${s.captures.size}: ${s.captures.keys.joinToString()}" +
            if (s.skipped.isEmpty()) "" else "\nSkipped: ${s.skipped.joinToString("; ")}"
        sweepSummary = summary
        captureStatus = summary
        lastCaptures.clear()
        lastCaptures.putAll(s.captures)
        if (CaptureUploader.configured && s.captures.isNotEmpty()) upload()
        Log.i(TAG, summary)
        Toast.makeText(this, "Sweep done · ${s.captures.size} files saved", Toast.LENGTH_LONG).show()
    }

    private fun upload() {
        if (lastCaptures.isEmpty()) {
            Toast.makeText(this, "Measure or sweep first.", Toast.LENGTH_LONG).show()
            return
        }
        if (!CaptureUploader.configured) {
            Toast.makeText(this, "Upload key not set in this build. Download the JSON instead.", Toast.LENGTH_LONG).show()
            return
        }
        val files = LinkedHashMap(lastCaptures)
        uploadStatus = "Uploading ${files.size} file(s)…"
        captureStatus += "\n$uploadStatus"
        Thread {
            val result = CaptureUploader.upload(files)
            runOnUiThread {
                uploadStatus = result.fold({ it }, { it.message ?: "Upload failed" })
                Log.i(TAG, uploadStatus!!)
                Toast.makeText(this, uploadStatus, Toast.LENGTH_LONG).show()
                refresh()
            }
        }.start()
    }

    private fun cancelSweep(reason: String) {
        sweep = null
        root.removeCallbacks(sweepCheck)
        requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED
        Log.w(TAG, reason)
        Toast.makeText(this, reason, Toast.LENGTH_LONG).show()
    }


    private fun measure() {
        val file = export() ?: return
        Toast.makeText(this, "Saved: ${file.name}", Toast.LENGTH_LONG).show()
    }

    private fun copyJson() {
        val file = export() ?: return
        getSystemService(ClipboardManager::class.java).setPrimaryClip(ClipData.newPlainText("probe", lastJson))
        Toast.makeText(this, "Copied. Saved: ${file.name}", Toast.LENGTH_LONG).show()
    }

    private fun share() {
        export() ?: return
        val send = Intent(Intent.ACTION_SEND).apply {
            type = "text/plain"
            putExtra(Intent.EXTRA_TEXT, lastJson)
        }
        startActivity(Intent.createChooser(send, "Share probe JSON"))
    }

    @Composable
    private fun ProbeScreen() {
        MaterialTheme(colorScheme = darkColorScheme()) {
            Surface(Modifier.fillMaxSize()) {
                // One lazy list scrolls everything: a Flip cover is ~440 dp tall with a large bottom
                // cutout, so fixed controls would end up out of reach.
                LazyColumn(
                    Modifier.fillMaxSize(),
                    contentPadding = WindowInsets.systemBars.union(WindowInsets.displayCutout)
                        .add(WindowInsets(left = 8.dp, top = 4.dp, right = 8.dp, bottom = 8.dp))
                        .asPaddingValues(),
                    verticalArrangement = Arrangement.spacedBy(4.dp),
                ) {
                    item { Header() }
                    item {
                        Text(
                            "Use default Display size / Font size in full screen. Physically open or close the device first. " +
                                "Cover / Main only labels the active display; it cannot unfold the device. " +
                                "Change navigation in Android Settings, return here, then Measure. " +
                                "Rotate & measure turns the app itself; no need to rotate the device.",
                            fontSize = 12.sp,
                            modifier = Modifier.padding(horizontal = 4.dp),
                        )
                    }
                    item { ScreenLabel() }
                    item { Text(captureStatus, fontSize = 12.sp, modifier = Modifier.padding(horizontal = 4.dp)) }
                    item {
                        Row(
                            Modifier
                                .fillMaxWidth()
                                .toggleable(tabletReversePortrait, role = Role.Checkbox) { tabletReversePortrait = it },
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Checkbox(tabletReversePortrait, onCheckedChange = null)
                            Text("Tablet: include upside-down portrait", Modifier.padding(start = 8.dp))
                        }
                    }
                    item {
                        FilledTonalButton(
                            { startActivity(Intent(Settings.ACTION_DISPLAY_SETTINGS)) },
                            Modifier.fillMaxWidth(),
                        ) { Text("Display / navigation settings") }
                    }
                    item {
                        // Large targets: RTL streams a scaled-down screen, so small buttons are easy to miss.
                        Button(::startSweep, Modifier.fillMaxWidth().heightIn(min = 88.dp)) {
                            Text(
                                "Rotate & measure all orientations",
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Bold,
                                textAlign = TextAlign.Center,
                            )
                        }
                    }
                    item {
                        Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                            ActionButton("Measure", ::measure)
                            ActionButton("Copy JSON", ::copyJson)
                            ActionButton("Upload", ::upload)
                            ActionButton("Share", ::share)
                        }
                    }
                    // Copy JSON / Share export the full text; lines keep a long capture cheap to scroll.
                    items(output.lines()) { line ->
                        Text(
                            line,
                            fontFamily = FontFamily.Monospace,
                            fontSize = 10.sp,
                            lineHeight = 13.sp,
                            modifier = Modifier.padding(horizontal = 4.dp),
                        )
                    }
                }
            }
        }
    }

    @Composable
    private fun Header() {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                "InsetsProbe · windowinsets.info",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.weight(1f).padding(start = 4.dp),
            )
            val closeLabel = getString(R.string.close_probe)
            TextButton(
                { finishAndRemoveTask() },
                Modifier.size(48.dp).semantics { contentDescription = closeLabel },
            ) { Text("×", fontSize = 24.sp) }
        }
    }

    @Composable
    private fun ScreenLabel() {
        Row(Modifier.selectableGroup(), verticalAlignment = Alignment.CenterVertically) {
            for (id in SCREENS) {
                Row(
                    Modifier
                        .selectable(screen == id, role = Role.RadioButton) { screen = id; refresh() }
                        .padding(end = 12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    RadioButton(screen == id, onClick = null)
                    Text(id.replaceFirstChar(Char::uppercase), Modifier.padding(start = 4.dp))
                }
            }
        }
    }

    @Composable
    private fun RowScope.ActionButton(label: String, onClick: () -> Unit) {
        Button(onClick, Modifier.weight(1f).heightIn(min = 72.dp)) {
            Text(label, fontSize = 16.sp, textAlign = TextAlign.Center)
        }
    }

    private companion object {
        const val TAG = "InsetsProbe"
        val SCREENS = listOf("phone", "cover", "main")
    }
}
