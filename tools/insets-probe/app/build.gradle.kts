import com.android.build.api.dsl.ApplicationExtension

plugins {
    alias(libs.plugins.android.application)
}

extensions.configure<ApplicationExtension> {
    namespace = "info.windowinsets.probe"
    compileSdk = 36

    defaultConfig {
        applicationId = "info.windowinsets.probe"
        // RoundedCorner / Display.getRoundedCorner need API 31.
        minSdk = 31
        targetSdk = 36
        versionCode = 7
        versionName = "1.4.0"
    }

    buildFeatures {
        buildConfig = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

dependencies {
    testImplementation("junit:junit:4.13.2")
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.activity.ktx)
    implementation(libs.androidx.window)
    implementation(libs.androidx.window.java)
}
