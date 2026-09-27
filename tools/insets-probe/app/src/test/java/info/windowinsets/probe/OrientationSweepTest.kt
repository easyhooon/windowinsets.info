package info.windowinsets.probe

import android.content.pm.ActivityInfo
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class OrientationSweepTest {
    private val portrait = OrientationSweep.steps(false)[0]
    private val landscape = OrientationSweep.steps(false)[1]

    @Test fun reversePortraitIsRequestedOnlyForTabletSweeps() {
        assertEquals(3, OrientationSweep.steps(false).size)
        assertEquals(4, OrientationSweep.steps(true).size)
        assertEquals("reverse portrait", OrientationSweep.steps(true).last().label)
        assertEquals(ActivityInfo.SCREEN_ORIENTATION_REVERSE_PORTRAIT, OrientationSweep.steps(true).last().requestedOrientation)
        assertEquals("portrait-2-threeButton.json", OrientationSweep.fileName("phone", "threeButton", 2, false))
    }

    @Test fun fileNamesFollowTheLandscapeRotationConvention() {
        assertEquals("main-gesture.json", OrientationSweep.fileName("phone", "gesture", 0, false))
        assertEquals("cover-threeButton.json", OrientationSweep.fileName("cover", "threeButton", null, false))
        assertEquals("landscape-1-gesture.json", OrientationSweep.fileName("phone", "gesture", 1, true))
        assertEquals("landscape-3-threeButton.json", OrientationSweep.fileName("phone", "threeButton", 3, true))
        assertEquals("main-portrait-1-gesture.json", OrientationSweep.fileName("main", "gesture", 1, false))
        assertEquals("cover-landscape-3-gesture.json", OrientationSweep.fileName("cover", "gesture", 3, true))
    }

    @Test fun waitsForTheRequestedWindowShape() {
        assertTrue(OrientationSweep.reached(portrait, 1080, 2340))
        assertFalse(OrientationSweep.reached(portrait, 2340, 1080))
        assertTrue(OrientationSweep.reached(landscape, 2340, 1080))
        assertFalse(OrientationSweep.reached(landscape, 1080, 1080))
    }

    @Test fun neverRecordsTheSameRotationTwice() {
        assertNull(OrientationSweep.skipReason(landscape, 1, setOf(0)))
        assertNotNull(OrientationSweep.skipReason(landscape, 1, setOf(0, 1)))
        assertNotNull(OrientationSweep.skipReason(landscape, null, emptySet()))
    }
}
