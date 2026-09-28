import com.android.build.api.dsl.ApplicationExtension

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.compose)
}

extensions.configure<ApplicationExtension> {
    namespace = "info.windowinsets.probe"
    compileSdk = 36

    defaultConfig {
        applicationId = "info.windowinsets.probe"
        // RoundedCorner / Display.getRoundedCorner need API 31.
        minSdk = 31
        targetSdk = 36
        versionCode = 9
        versionName = "1.6.0"
        // Uploads go to windowinsets.info (issue #28). Set insetsProbeUploadKey in
        // ~/.gradle/gradle.properties or pass -PinsetsProbeUploadKey=...; blank disables upload.
        val uploadKey = providers.gradleProperty("insetsProbeUploadKey").orElse("").get()
        val uploadUrl = providers.gradleProperty("insetsProbeUploadUrl").orElse("https://windowinsets.info/api/captures").get()
        buildConfigField("String", "UPLOAD_KEY", "\"$uploadKey\"")
        buildConfigField("String", "UPLOAD_URL", "\"$uploadUrl\"")
    }

    buildTypes {
        // RTL install build: R8 keeps Compose small (~6 MB instead of 27 MB), stays
        // debuggable and is signed with the local debug key so it replaces debug installs.
        getByName("release") {
            isMinifyEnabled = true
            isDebuggable = true
            signingConfig = signingConfigs.getByName("debug")
        }
    }

    buildFeatures {
        buildConfig = true
        compose = true
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
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.activity.compose)
    implementation(libs.androidx.compose.foundation)
    implementation(libs.androidx.compose.material3)
}
