package info.windowinsets.probe

import android.app.Activity
import android.content.res.Configuration
import android.graphics.Rect
import android.os.Build
import android.provider.Settings
import android.util.DisplayMetrics
import android.view.RoundedCorner
import androidx.core.graphics.Insets
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsCompat.Type
import androidx.window.layout.FoldingFeature
import org.json.JSONArray
import org.json.JSONObject
import kotlin.math.roundToInt

/** Collects everything windowinsets.info needs for one screen / navigation mode. */
object Probe {
    const val SCHEMA_VERSION = 2

    fun collect(
        activity: Activity,
        insets: WindowInsetsCompat,
        screen: String,
        hingeAngle: Float?,
        foldingFeatures: List<FoldingFeature>,
        screenLabelSource: String = FlexWindowContract.SCREEN_LABEL_SOURCE_MANUAL,
    ): JSONObject {
        val res = activity.resources
        val dm = res.displayMetrics
        val density = dm.density
        val cfg = res.configuration

        fun dp(px: Number) = round2(px.toDouble() / density)

        fun insetsJson(i: Insets) = JSONObject()
            .put("px", JSONObject().put("top", i.top).put("right", i.right).put("bottom", i.bottom).put("left", i.left))
            .put(
                "dp",
                JSONObject().put("top", dp(i.top)).put("right", dp(i.right)).put("bottom", dp(i.bottom)).put("left", dp(i.left)),
            )

        fun rectJson(r: Rect) = JSONObject()
            .put("px", JSONObject().put("left", r.left).put("top", r.top).put("right", r.right).put("bottom", r.bottom))
            .put(
                "dp",
                JSONObject().put("left", dp(r.left)).put("top", dp(r.top)).put("right", dp(r.right)).put("bottom", dp(r.bottom))
                    .put("width", dp(r.width())).put("height", dp(r.height())),
            )

        val json = JSONObject()
        json.put("schemaVersion", SCHEMA_VERSION)
        json.put("capturedAt", java.time.Instant.now().toString())
        json.put("screen", screen) // phone | cover | main — manual or launch-provided; provenance is recorded below
        json.put("screenLabelSource", screenLabelSource)
        json.put("probeVersion", BuildConfig.VERSION_NAME)

        json.put(
            "device",
            JSONObject()
                .put("manufacturer", Build.MANUFACTURER)
                .put("brand", Build.BRAND)
                .put("model", Build.MODEL)
                .put("device", Build.DEVICE)
                .put("android", Build.VERSION.RELEASE)
                .put("sdkInt", Build.VERSION.SDK_INT)
                .put("securityPatch", Build.VERSION.SECURITY_PATCH)
                .put("buildId", Build.DISPLAY)
                .put("oneUi", oneUiVersion())
                .put("oneUiProperty", oneUiProperty ?: JSONObject.NULL)
                .put("oneUiSource", "ro.build.version.oneui")
                .put("semPlatformInt", semPlatformInt()),
        )

        val display = activity.display
        val maxBounds = activity.windowManager.maximumWindowMetrics.bounds
        val curBounds = activity.windowManager.currentWindowMetrics.bounds
        json.put(
            "display",
            JSONObject()
                .put("id", display?.displayId)
                .put("name", display?.name)
                .put("rotation", display?.rotation)
                .put("isInMultiWindowMode", activity.isInMultiWindowMode)
                .put("rootViewPx", JSONObject()
                    .put("width", activity.window.decorView.width)
                    .put("height", activity.window.decorView.height))
                .put("refreshRate", display?.refreshRate?.let { round2(it.toDouble()) })
                // Resource metrics exclude system bars on older Android versions.
                // The full-screen window is the coordinate space used by insets.
                .put("widthPx", curBounds.width())
                .put("heightPx", curBounds.height())
                .put("sizeSource", "currentWindowMetrics")
                .put("appMetricsPx", JSONObject()
                    .put("width", dm.widthPixels).put("height", dm.heightPixels))
                .put("xdpi", round2(dm.xdpi.toDouble()))
                .put("ydpi", round2(dm.ydpi.toDouble()))
                .put("densityDpi", dm.densityDpi)
                .put("density", round2(density.toDouble()))
                .put("defaultDensityDpi", defaultDensityDpi())
                .put("fontScale", round2(cfg.fontScale.toDouble()))
                .put("orientation", if (cfg.orientation == Configuration.ORIENTATION_PORTRAIT) "portrait" else "landscape")
                .put("screenWidthDp", cfg.screenWidthDp)
                .put("screenHeightDp", cfg.screenHeightDp)
                .put("smallestScreenWidthDp", cfg.smallestScreenWidthDp)
                .put("currentWindowPx", JSONObject().put("width", curBounds.width()).put("height", curBounds.height()))
                .put("maximumWindowPx", JSONObject().put("width", maxBounds.width()).put("height", maxBounds.height()))
                .put(
                    "maximumWindowDp",
                    JSONObject().put("width", dp(maxBounds.width())).put("height", dp(maxBounds.height())),
                ),
        )

        json.put("navigation", navigationJson(activity, insets))

        val types = linkedMapOf(
            "statusBars" to Type.statusBars(),
            "navigationBars" to Type.navigationBars(),
            "systemBars" to Type.systemBars(),
            "displayCutout" to Type.displayCutout(),
            "captionBar" to Type.captionBar(),
            "systemGestures" to Type.systemGestures(),
            "mandatorySystemGestures" to Type.mandatorySystemGestures(),
            "tappableElement" to Type.tappableElement(),
        )
        val insetsObj = JSONObject()
        types.forEach { (name, type) -> insetsObj.put(name, insetsJson(insets.getInsets(type))) }
        json.put("insets", insetsObj)

        // Same as above but ignoring whether the bar is currently visible.
        val ignoring = JSONObject()
        listOf("statusBars" to Type.statusBars(), "navigationBars" to Type.navigationBars(), "systemBars" to Type.systemBars())
            .forEach { (name, type) -> ignoring.put(name, insetsJson(insets.getInsetsIgnoringVisibility(type))) }
        json.put("insetsIgnoringVisibility", ignoring)

        val cutout = insets.displayCutout
        json.put(
            "displayCutout",
            if (cutout == null) {
                JSONObject.NULL
            } else {
                JSONObject()
                    .put(
                        "safeInsetsPx",
                        JSONObject().put("top", cutout.safeInsetTop).put("right", cutout.safeInsetRight)
                            .put("bottom", cutout.safeInsetBottom).put("left", cutout.safeInsetLeft),
                    )
                    .put(
                        "safeInsetsDp",
                        JSONObject().put("top", dp(cutout.safeInsetTop)).put("right", dp(cutout.safeInsetRight))
                            .put("bottom", dp(cutout.safeInsetBottom)).put("left", dp(cutout.safeInsetLeft)),
                    )
                    .put("boundingRects", JSONArray().also { a -> cutout.boundingRects.forEach { a.put(rectJson(it)) } })
                    .put("waterfallInsets", insetsJson(cutout.waterfallInsets))
                    .put("path", (if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) insets.toWindowInsets()?.displayCutout?.cutoutPath else null)?.let { path ->
                        // API 31+; null on API 30, recorded in apiLimits. Preserve fractions as well as coordinates:
                        // equal adjacent fractions can indicate a move between contours.
                        // This is OS cutout geometry, not individual physical lens geometry.
                        val tolerancePx = 0.25f
                        JSONObject()
                            .put("coordinateSpace", "display")
                            .put("units", "px")
                            .put("fillType", path.fillType.name)
                            .put("approximationTolerancePx", tolerancePx.toDouble())
                            .put("approximation", JSONArray().also { points ->
                                val samples = path.approximate(tolerancePx)
                                for (i in samples.indices step 3) {
                                    points.put(JSONObject()
                                        .put("fraction", samples[i].toDouble())
                                        .put("x", samples[i + 1].toDouble())
                                        .put("y", samples[i + 2].toDouble()))
                                }
                            })
                    } ?: JSONObject.NULL)
            },
        )

        // RoundedCorner and DisplayCutout.getCutoutPath() arrived in API 31. On API 30
        // these fields stay null and apiLimits names them, so they read as unavailable,
        // never as "no rounded corners" or "no cutout shape".
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val platformInsets = insets.toWindowInsets()
            val positions = linkedMapOf(
                "topLeft" to RoundedCorner.POSITION_TOP_LEFT,
                "topRight" to RoundedCorner.POSITION_TOP_RIGHT,
                "bottomRight" to RoundedCorner.POSITION_BOTTOM_RIGHT,
                "bottomLeft" to RoundedCorner.POSITION_BOTTOM_LEFT,
            )
            fun cornersJson(get: (Int) -> RoundedCorner?): JSONObject {
                val o = JSONObject()
                positions.forEach { (name, pos) ->
                    val c = get(pos)
                    o.put(
                        name,
                        if (c == null) {
                            JSONObject.NULL
                        } else {
                            JSONObject().put("radiusPx", c.radius).put("radiusDp", dp(c.radius))
                                .put("centerPx", JSONObject().put("x", c.center.x).put("y", c.center.y))
                        },
                    )
                }
                return o
            }
            json.put(
                "roundedCorners",
                JSONObject()
                    .put("windowInsets", cornersJson { platformInsets?.getRoundedCorner(it) })
                    .put("display", cornersJson { display?.getRoundedCorner(it) }),
            )
        } else {
            json.put("roundedCorners", JSONObject.NULL)
            json.put("apiLimits", JSONArray().put("displayCutout.path").put("roundedCorners"))
        }

        json.put("hinge", hingeJson(hingeAngle, foldingFeatures, ::rectJson))
        return json
    }

    private fun hingeJson(angle: Float?, features: List<FoldingFeature>, rect: (Rect) -> JSONObject): JSONObject {
        val o = JSONObject()
        o.put("angleDegrees", if (angle == null) JSONObject.NULL else round2(angle.toDouble()))
        o.put(
            "foldingFeatures",
            JSONArray().also { arr ->
                features.forEach { f ->
                    arr.put(
                        JSONObject()
                            .put("state", f.state.toString())
                            .put("orientation", f.orientation.toString())
                            .put("occlusionType", f.occlusionType.toString())
                            .put("isSeparating", f.isSeparating)
                            .put("bounds", rect(f.bounds)),
                    )
                }
            },
        )
        return o
    }

    /**
     * The Settings value can be changed without the system UI following (Samsung ignores
     * `navigation_mode` written over adb), so the mode is inferred from the insets themselves:
     * in gesture navigation the nav bar inset is only the gesture hint and does not count as a
     * tappable element; with 3 buttons the tappable inset equals the bar height.
     *
     * This is only a heuristic: a tappable taskbar can exist with gesture navigation.
     * navigationJson also checks the active config and side gesture regions.
     */
    fun modeFromInsets(insets: WindowInsetsCompat): String {
        val navBottom = insets.getInsets(Type.navigationBars()).bottom
        val tappableBottom = insets.getInsets(Type.tappableElement()).bottom
        return when {
            navBottom == 0 -> "unknown"
            tappableBottom == 0 -> "gesture"
            tappableBottom == navBottom -> "threeButton"
            else -> "unknown"
        }
    }

    private fun navigationJson(activity: Activity, insets: WindowInsetsCompat): JSONObject {
        // 0 = 3-button, 1 = 2-button, 2 = gestural (AOSP Settings.Secure "navigation_mode").
        val setting = runCatching { Settings.Secure.getInt(activity.contentResolver, "navigation_mode", -1) }.getOrDefault(-1)
        val resId = activity.resources.getIdentifier("config_navBarInteractionMode", "integer", "android")
        val fromConfig = if (resId != 0) activity.resources.getInteger(resId) else -1

        val fromInsets = modeFromInsets(insets)
        val fromSetting = modeName(if (setting != -1) setting else fromConfig)
        val gestures = insets.getInsets(Type.systemGestures())
        val sideGestures = gestures.left > 0 && gestures.right > 0
        val mode = NavigationMode.resolve(fromInsets, fromSetting, fromConfig, sideGestures)
        return JSONObject()
            .put("mode", mode)
            .put("modeSource", if (fromConfig == 2 && sideGestures) "configAndSideGestures" else "insetsWithSettingFallback")
            .put("modeFromInsets", fromInsets)
            .put("modeFromSetting", fromSetting)
            .put("settingAgreesWithInsets", fromInsets == "unknown" || fromInsets == fromSetting)
            .put("settingsSecureNavigationMode", setting)
            .put("configNavBarInteractionMode", fromConfig)
    }

    private fun modeName(v: Int) = when (v) {
        0 -> "threeButton"
        1 -> "twoButton"
        2 -> "gesture"
        else -> "unknown"
    }

    /** Density the device ships with, before any "Screen zoom / Display size" change. */
    private fun defaultDensityDpi(): Int? = runCatching {
        DisplayMetrics::class.java.getField("DENSITY_DEVICE_STABLE").getInt(null)
    }.getOrNull()

    private fun semPlatformInt(): Int? = runCatching {
        Build.VERSION::class.java.getField("SEM_PLATFORM_INT").getInt(null)
    }.getOrNull()

    // SEM_PLATFORM_INT is not a retail version: Fold2's 140500 is One UI 5.1.1,
    // not 5.5. Keep the raw platform integer separately instead of guessing.
    private val oneUiProperty: Int? by lazy {
        runCatching {
            ProcessBuilder("/system/bin/getprop", "ro.build.version.oneui")
                .start().inputStream.bufferedReader().use { it.readText().trim().toIntOrNull() }
        }.getOrNull()?.takeIf { it > 0 }
    }

    private fun oneUiVersion(): String? {
        val v = oneUiProperty ?: return null
        val version = "${v / 10000}.${(v % 10000) / 100}"
        return if (v % 100 == 0) version else "$version.${v % 100}"
    }

    private fun round2(v: Double) = (v * 100).roundToInt() / 100.0
}
