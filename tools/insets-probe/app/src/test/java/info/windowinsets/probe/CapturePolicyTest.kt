package info.windowinsets.probe

import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Test

class CapturePolicyTest {
    @Test fun closedFold8CannotBeExportedAsMain() {
        assertNotNull(CapturePolicy.blockingReason("main", 0f, true, false))
        assertNull(CapturePolicy.blockingReason("cover", 0f, true, false))
        assertNull(CapturePolicy.blockingReason("main", 180f, true, false))
        assertNull(CapturePolicy.blockingReason("main", 0f, true, false, hasFoldingFeature = true))
    }

    @Test fun waitForAFullStableWindowWithoutInventingMissingHingeEvidence() {
        assertNotNull(CapturePolicy.blockingReason("main", 180f, false, false))
        assertNotNull(CapturePolicy.blockingReason("main", 180f, true, true))
        assertNull(CapturePolicy.blockingReason("main", null, true, false))
        assertNull(CapturePolicy.blockingReason("phone", null, true, false))
    }

    @Test fun flexWindowWidgetLaunchMustOwnTheRequestedDisplay() {
        assertNull(CapturePolicy.blockingReason("cover", 0f, true, false, 1, 1))
        assertNotNull(CapturePolicy.blockingReason("cover", 0f, true, false, 1, 0))
        assertNull(CapturePolicy.blockingReason("cover", 0f, true, false))
    }

    @Test fun captureMustFillTheActiveDisplaysMaximumBounds() {
        assertNull(CapturePolicy.blockingReason("cover", 0f, true, false, 1, 1, true))
        assertNotNull(CapturePolicy.blockingReason("cover", 0f, true, false, 1, 1, false))
        assertNotNull(CapturePolicy.blockingReason("phone", null, true, false, fullDisplayWindow = false))
    }

    @Test fun coverLabelIsRejectedOnTheUnfoldedInnerDisplay() {
        assertNotNull(CapturePolicy.blockingReason("cover", 0f, true, false, hasFoldingFeature = true))
        assertNull(CapturePolicy.blockingReason("cover", 0f, true, false, hasFoldingFeature = false))
    }
}
