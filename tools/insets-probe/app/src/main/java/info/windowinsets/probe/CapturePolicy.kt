package info.windowinsets.probe

/** Screen labels are manual; reject a closed-device/Main mismatch unless the
 * active full display exposes a WindowManager folding feature. RTL hinge sensor
 * values can remain stale after a verified physical display switch. */
object CapturePolicy {
    fun blockingReason(
        screen: String,
        hingeAngle: Float?,
        layoutReady: Boolean,
        multiWindow: Boolean,
        expectedDisplayId: Int? = null,
        actualDisplayId: Int? = null,
        fullDisplayWindow: Boolean = true,
        hasFoldingFeature: Boolean = false,
    ): String? = when {
        !layoutReady -> "Display is changing. Wait for the window to settle, then Measure again."
        multiWindow -> "Open InsetsProbe full screen before measuring."
        expectedDisplayId != null && actualDisplayId != expectedDisplayId ->
            "InsetsProbe opened on display ${actualDisplayId ?: "unknown"}, not the FlexWindow. " +
                "Launch it from the InsetsProbe cover widget and try again."
        !fullDisplayWindow ->
            "The active window does not fill this display. Exit compatibility, pop-up, or split-screen mode and try again."
        // The cover never exposes a folding feature; one being present means the
        // unfolded inner display is active (#30: 'cover' label, 2448×1848 window).
        screen == "cover" && hasFoldingFeature ->
            "Cover selected, but this display reports a hinge, so the inner display is active. Close the device or select Main."
        screen == "main" && hingeAngle != null && hingeAngle <= 5f && !hasFoldingFeature ->
            "Main selected, but the hinge reports closed. Open the device and verify the active window size."
        else -> null // Missing hinge data cannot establish which physical display is active.
    }
}
