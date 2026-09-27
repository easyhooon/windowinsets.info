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
        versionCode = 8
        versionName = "1.5.0"
        // Uploads go to windowinsets.info (issue #28). Set insetsProbeUploadKey in
        // ~/.gradle/gradle.properties or pass -PinsetsProbeUploadKey=...; blank disables upload.
        val uploadKey = providers.gradleProperty("insetsProbeUploadKey").orElse("").get()
        val uploadUrl = providers.gradleProperty("insetsProbeUploadUrl").orElse("https://windowinsets.info/api/captures").get()
        buildConfigField("String", "UPLOAD_KEY", "\"$uploadKey\"")
        buildConfigField("String", "UPLOAD_URL", "\"$uploadUrl\"")
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
