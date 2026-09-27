package info.windowinsets.probe

import android.content.pm.ActivityInfo

/**
 * Orientation sweep: the probe requests each orientation itself, waits until the
 * system has actually rotated the window, and records what Android reports there.
 * Nothing is derived from another orientation; a display that refuses to rotate
 * is skipped, not relabeled.
 */
object OrientationSweep {
    data class Step(val requestedOrientation: Int, val label: String, val landscape: Boolean)

    val steps = listOf(
        Step(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT, "portrait", landscape = false),
        Step(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE, "landscape", landscape = true),
        Step(ActivityInfo.SCREEN_ORIENTATION_REVERSE_LANDSCAPE, "reverse landscape", landscape = true),
        // Phones usually refuse 180°; the step then times out and is listed as skipped.
        Step(ActivityInfo.SCREEN_ORIENTATION_REVERSE_PORTRAIT, "reverse portrait", landscape = false),
    )

    /** Quiet period after the last insets/configuration callback before capturing. */
    const val SETTLE_MS = 700L

    /** A step that has not rotated by then is skipped. */
    const val TIMEOUT_MS = 6000L

    /**
     * Natural rotation keeps the legacy name (`main-gesture.json`, `cover-gesture.json`).
     * Other rotations follow the repository's `landscape-<rotation>` convention (issue #22):
     * phone `landscape-1-gesture.json`; foldable screens are prefixed, e.g.
     * `main-portrait-1-gesture.json` for a landscape-natural inner display turned upright.
     * [rotation] is `Display.getRotation()` (Surface.ROTATION_0..3).
     */
    fun fileName(screen: String, navMode: String, rotation: Int?, landscape: Boolean): String {
        if (rotation == null || rotation == 0) return "${if (screen == "phone") "main" else screen}-$navMode.json"
        val prefix = if (screen == "phone") "" else "$screen-"
        return "$prefix${if (landscape) "landscape" else "portrait"}-$rotation-$navMode.json"
    }

    /** The window has the requested shape. Square windows cannot prove either. */
    fun reached(step: Step, widthPx: Int, heightPx: Int): Boolean =
        widthPx != heightPx && (widthPx > heightPx) == step.landscape

    /**
     * Why a settled step is not captured, or null to capture. A rotation already
     * recorded in this sweep (e.g. reverse landscape disabled) is a duplicate.
     */
    fun skipReason(step: Step, rotation: Int?, recorded: Set<Int>): String? = when {
        rotation == null -> "${step.label}: display rotation unavailable"
        rotation in recorded -> "${step.label}: display stayed at ${rotation * 90}°, already recorded"
        else -> null
    }
}
