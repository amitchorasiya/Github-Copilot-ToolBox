import java.util.jar.JarInputStream
import java.util.zip.ZipFile

plugins {
    kotlin("jvm") version "2.1.10"
    id("org.jetbrains.intellij.platform") version "2.13.1"
}

group = "com.amitchorasiya.github.copilot.toolbox"
version = "0.1.3"

repositories {
    mavenCentral()
    intellijPlatform {
        defaultRepositories()
    }
}

dependencies {
    intellijPlatform {
        intellijIdea("2024.3")
    }
    implementation("com.google.code.gson:gson:2.11.0")
    testImplementation(kotlin("test"))
    testImplementation("junit:junit:4.13.2")
}

val extensionDir = rootDir.parentFile.resolve("github-copilot-toolbox")
val nm = extensionDir.resolve("node_modules")

val copyBridgeCursorMcpPort = tasks.register<Copy>("copyBridgeCursorMcpPort") {
    group = "build"
    description = "Stage cursor-mcp-to-github-copilot-port from extension node_modules."
    from(nm.resolve("cursor-mcp-to-github-copilot-port")) {
        include("bin/**", "lib/**", "package.json", "README.md")
    }
    into(layout.buildDirectory.dir("generated-resources/bridge-clis/cursor-mcp-to-github-copilot-port"))
}

val copyBridgeMemoryBank = tasks.register<Copy>("copyBridgeMemoryBank") {
    group = "build"
    description = "Stage github-copilot-memory-bank from extension node_modules."
    from(nm.resolve("github-copilot-memory-bank")) {
        include("bin/**", "templates/**", "package.json", "README.md", "LICENSE", "NOTICE")
    }
    into(layout.buildDirectory.dir("generated-resources/bridge-clis/github-copilot-memory-bank"))
}

val copyBridgeCursorRules = tasks.register<Copy>("copyBridgeCursorRules") {
    group = "build"
    description = "Stage cursor-rules-to-github-copilot from extension node_modules."
    from(nm.resolve("cursor-rules-to-github-copilot")) {
        include("bin/**", "lib/**", "package.json", "README.md")
    }
    into(layout.buildDirectory.dir("generated-resources/bridge-clis/cursor-rules-to-github-copilot"))
}

val npmInstallRulesBridge = tasks.register<Exec>("npmInstallRulesBridge") {
    group = "build"
    description = "npm install --production for cursor-rules-to-github-copilot (gray-matter, etc.)."
    dependsOn(copyBridgeCursorRules)
    workingDir(layout.buildDirectory.dir("generated-resources/bridge-clis/cursor-rules-to-github-copilot").get().asFile)
    commandLine("npm", "install", "--production", "--no-audit", "--no-fund")
}

val prepareBridgeClis = tasks.register("prepareBridgeClis") {
    group = "build"
    description = "Copy npm bridge CLIs from packages/github-copilot-toolbox/node_modules (run npm install there first)."
    dependsOn(copyBridgeCursorMcpPort, copyBridgeMemoryBank, npmInstallRulesBridge)
}

sourceSets {
    named("main") {
        resources.srcDir(layout.buildDirectory.dir("generated-resources"))
    }
}

kotlin {
    jvmToolchain(21)
}

intellijPlatform {
    pluginConfiguration {
        ideaVersion {
            sinceBuild = "242"
        }
    }
    pluginVerification {
        ides {
            recommended()
        }
    }
    publishing {
        token = providers.gradleProperty("intellijPlatformPublishingToken")
    }
}

val verifyPluginLibraryLayout = tasks.register("verifyPluginLibraryLayout") {
    group = "verification"
    description =
        "Ensures bundled libraries (e.g. Gson) are not merged into the main plugin JAR (Plugin Verifier / Marketplace)."
    notCompatibleWithConfigurationCache("Reads the built plugin ZIP from disk in doLast.")
    dependsOn("buildPlugin")
    doLast {
        val distDir = layout.buildDirectory.dir("distributions").get().asFile
        val zipFile = distDir.resolve("${rootProject.name}-${project.version}.zip")
        check(zipFile.isFile) {
            "Expected plugin ZIP at $zipFile (run buildPlugin for version ${project.version})."
        }
        ZipFile(zipFile).use { zf ->
            val entries = zf.entries()
            var mainJar: java.util.zip.ZipEntry? = null
            while (entries.hasMoreElements()) {
                val e = entries.nextElement()
                if (e.isDirectory || !e.name.endsWith(".jar") || !e.name.contains("/lib/")) continue
                val isMain = zf.getInputStream(e).use { ins ->
                    JarInputStream(ins).use { jis ->
                        while (true) {
                            val je = jis.nextJarEntry ?: break
                            if (je.name == "META-INF/plugin.xml") return@use true
                        }
                        false
                    }
                }
                if (isMain) {
                    mainJar = e
                    break
                }
            }
            val mainEntry = mainJar ?: error("Could not locate main plugin JAR (META-INF/plugin.xml) in $zipFile")
            zf.getInputStream(mainEntry).use { ins ->
                JarInputStream(ins).use { jis ->
                    while (true) {
                        val je = jis.nextJarEntry ?: break
                        val name = je.name
                        check(
                            !(name.startsWith("com/google/gson/") && name.endsWith(".class"))
                        ) {
                            "Gson must not be repackaged into the main plugin JAR ($name). " +
                                "Keep libraries as sibling JARs under lib/."
                        }
                    }
                }
            }
        }
    }
}

tasks {
    named<ProcessResources>("processResources") {
        dependsOn(prepareBridgeClis)
    }

    buildPlugin {
        finalizedBy("verifyPluginLibraryLayout")
    }

    buildSearchableOptions {
        enabled = false
    }
    prepareJarSearchableOptions {
        enabled = false
    }
    jarSearchableOptions {
        enabled = false
    }
    test {
        useJUnitPlatform()
    }
}
