package info.windowinsets.probe

import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

/** Posts captures to windowinsets.info/api/captures, which commits them to the review inbox. */
object CaptureUploader {
    val configured: Boolean get() = BuildConfig.UPLOAD_KEY.isNotBlank()

    /** `{ files: { name: capture } }`, the endpoint's request shape. */
    fun body(files: Map<String, String>, note: String? = null): String = JSONObject().apply {
        put("files", JSONObject().apply { files.forEach { (name, json) -> put(name, JSONObject(json)) } })
        note?.let { put("note", it) }
    }.toString()

    /** Blocking; call off the main thread. Returns a short, human-readable result. */
    fun upload(files: Map<String, String>): Result<String> = runCatching {
        val connection = (URL(BuildConfig.UPLOAD_URL).openConnection() as HttpURLConnection).apply {
            requestMethod = "POST"
            connectTimeout = 15_000
            readTimeout = 30_000
            doOutput = true
            setRequestProperty("Content-Type", "application/json")
            setRequestProperty("x-upload-key", BuildConfig.UPLOAD_KEY)
        }
        connection.outputStream.use { it.write(body(files).toByteArray()) }
        val status = connection.responseCode
        val text = (if (status < 400) connection.inputStream else connection.errorStream)
            ?.bufferedReader()?.use { it.readText() }.orEmpty()
        val json = runCatching { JSONObject(text) }.getOrNull()
        check(status == 201) { "Upload failed ($status): ${json?.optString("error") ?: text.take(200)}" }
        "Uploaded ${files.size} file(s) · inbox PR #${json?.optInt("pr")} · ${json?.optString("commit")}"
    }
}
