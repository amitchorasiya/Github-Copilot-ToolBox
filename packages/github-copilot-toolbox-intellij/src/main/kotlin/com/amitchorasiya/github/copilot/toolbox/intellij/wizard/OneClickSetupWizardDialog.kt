package com.amitchorasiya.github.copilot.toolbox.intellij.wizard

import com.amitchorasiya.github.copilot.toolbox.intellij.settings.OneClickSetupModel
import com.amitchorasiya.github.copilot.toolbox.intellij.settings.ToolboxSettings
import com.intellij.openapi.project.Project
import com.intellij.openapi.ui.DialogWrapper
import com.intellij.openapi.ui.DialogWrapper.DialogWrapperAction
import com.intellij.openapi.ui.Messages
import com.intellij.ui.components.JBCheckBox
import com.intellij.ui.components.JBLabel
import com.intellij.ui.components.JBScrollPane
import com.intellij.util.ui.FormBuilder
import com.intellij.util.ui.JBUI
import java.awt.BorderLayout
import java.awt.CardLayout
import java.awt.Dimension
import java.awt.event.ActionEvent
import javax.swing.Action
import javax.swing.JComboBox
import javax.swing.JComponent
import javax.swing.JPanel
import javax.swing.JTextArea
import java.nio.file.Paths

/** Stepped One Click wizard (VS Code parity). */
class OneClickSetupWizardDialog(private val project: Project) : DialogWrapper(project) {

    private val settings = ToolboxSettings(project.basePath?.let { Paths.get(it) })
    private var model: OneClickSetupModel = settings.getOneClickSetup()

    private val cards = JPanel(CardLayout())
    private var step = 0
    private val lastStepIndex = 5

    private val acknowledge = JBCheckBox("I understand — run setup (review terminals and file changes).")

    private val trackCursor = JBCheckBox("Cursor → Copilot track")
    private val trackClaude = JBCheckBox("Claude Code → Copilot track")

    private val migrateSkillsTarget = comboOf("off", "workspace", "user", "both")
    private val migrateSkillsMode = comboOf("copy", "move")
    private val syncCursorRulesMode = comboOf("apply", "dryRun", "off")
    private val appendCursorrules = JBCheckBox("Append .cursorrules into .github/copilot-instructions.md (if present)")
    private val portCursorMcp = comboOf("user", "workspaceMerge", "dry", "skip")

    private val mergeClaudeMdCb = JBCheckBox("Merge CLAUDE.md → .github/copilot-instructions.md")
    private val migrateClaudeSkillsTarget = comboOf("off", "workspace", "user", "both")
    private val migrateClaudeSkillsMode = comboOf("copy", "move")
    private val portClaudeProjectMcp = comboOf("user", "workspaceMerge", "dry", "skip")
    private val copilotMcpReminder = JBCheckBox("After setup: note about VS Code mcp.json vs Copilot Agent MCP")

    private val initMemoryBankMode = comboOf("apply", "dryRun", "off")
    private val initMemoryBankCursorRules = JBCheckBox("Memory bank: pass --cursor-rules when Cursor track is on")

    private val instructionMergeAfterOneClick =
        comboOf("enableAutoScan", "mergeCopilotInstructionsOnce", "leaveUnchanged")

    private val runAwarenessScan = JBCheckBox("Run MCP & Skills awareness (writes under .github/)")
    private val runReadiness = JBCheckBox("Open readiness report")
    private val runConfigScan = JBCheckBox("Run Copilot/MCP config scan")
    private val runFirstTestTask = JBCheckBox("Run first test task (Gradle or npm)")

    private val summaryArea = JTextArea().apply {
        isEditable = false
        lineWrap = true
        wrapStyleWord = true
        border = JBUI.Borders.empty(8)
    }

    private lateinit var previousAction: Action

    init {
        title = "One Click Setup"
        trackCursor.toolTipText = "Skills, rules sync, .cursorrules append, Cursor MCP port"
        trackClaude.toolTipText = "CLAUDE.md merge, .claude/skills migration, .mcp.json port"
        init()
    }

    override fun createCenterPanel(): JComponent {
        loadUiFromModel()
        cards.add(stepIntro(), "0")
        cards.add(stepTracks(), "1")
        cards.add(stepCursor(), "2")
        cards.add(stepClaudeShared(), "3")
        cards.add(stepFollowUps(), "4")
        cards.add(stepSummary(), "5")
        val wrap = JPanel(BorderLayout())
        wrap.add(cards, BorderLayout.CENTER)
        showStep()
        return wrap
    }

    override fun createActions(): Array<Action> {
        previousAction = object : DialogWrapperAction("Back") {
            override fun doAction(e: ActionEvent) {
                if (step > 0) {
                    step--
                    showStep()
                }
            }
        }
        previousAction.isEnabled = false
        return arrayOf(cancelAction, previousAction, okAction)
    }

    override fun doOKAction() {
        if (!validateCurrentStep()) {
            return
        }
        if (step < lastStepIndex) {
            step++
            if (step == lastStepIndex) {
                applyUiToModel()
                refreshSummary()
            }
            showStep()
            return
        }
        applyUiToModel()
        OneClickSetupRunner.run(project, model)
        super.doOKAction()
    }

    private fun showStep() {
        (cards.layout as CardLayout).show(cards, step.toString())
        setOKButtonText(if (step == lastStepIndex) "Run setup" else "Next")
        if (::previousAction.isInitialized) {
            previousAction.isEnabled = step > 0
        }
    }

    private fun validateCurrentStep(): Boolean {
        if (step == 0 && !acknowledge.isSelected) {
            Messages.showWarningDialog(
                project,
                "Confirm that you understand you are responsible for reviewing all changes.",
                "One Click Setup",
            )
            return false
        }
        return true
    }

    private fun loadUiFromModel() {
        val m = model
        trackCursor.isSelected = m.runCursorToCopilotTrack
        trackClaude.isSelected = m.runClaudeCodeToCopilotTrack
        migrateSkillsTarget.selectedItem = m.migrateSkillsTarget
        migrateSkillsMode.selectedItem = m.migrateSkillsMode
        syncCursorRulesMode.selectedItem = m.syncCursorRulesMode
        appendCursorrules.isSelected = m.appendCursorrules
        portCursorMcp.selectedItem = m.portCursorMcp
        mergeClaudeMdCb.isSelected = m.mergeClaudeMdIntoCopilotInstructions
        migrateClaudeSkillsTarget.selectedItem = m.migrateClaudeSkillsTarget
        migrateClaudeSkillsMode.selectedItem = m.migrateClaudeSkillsMode
        portClaudeProjectMcp.selectedItem = m.portClaudeProjectMcp
        copilotMcpReminder.isSelected = m.copilotMcpReminderAfterOneClick
        initMemoryBankMode.selectedItem = m.initMemoryBankMode
        initMemoryBankCursorRules.isSelected = m.initMemoryBankCursorRules
        instructionMergeAfterOneClick.selectedItem = m.instructionMergeAfterOneClick
        runAwarenessScan.isSelected = m.runAwarenessScan
        runReadiness.isSelected = m.runReadiness
        runConfigScan.isSelected = m.runConfigScan
        runFirstTestTask.isSelected = m.runFirstTestTask
    }

    private fun applyUiToModel() {
        model = OneClickSetupModel(
            runCursorToCopilotTrack = trackCursor.isSelected,
            runClaudeCodeToCopilotTrack = trackClaude.isSelected,
            migrateSkillsTarget = migrateSkillsTarget.selectedItem as String,
            migrateSkillsMode = migrateSkillsMode.selectedItem as String,
            syncCursorRulesMode = syncCursorRulesMode.selectedItem as String,
            appendCursorrules = appendCursorrules.isSelected,
            portCursorMcp = portCursorMcp.selectedItem as String,
            mergeClaudeMdIntoCopilotInstructions = mergeClaudeMdCb.isSelected,
            migrateClaudeSkillsTarget = migrateClaudeSkillsTarget.selectedItem as String,
            migrateClaudeSkillsMode = migrateClaudeSkillsMode.selectedItem as String,
            portClaudeProjectMcp = portClaudeProjectMcp.selectedItem as String,
            copilotMcpReminderAfterOneClick = copilotMcpReminder.isSelected,
            initMemoryBankMode = initMemoryBankMode.selectedItem as String,
            initMemoryBankCursorRules = initMemoryBankCursorRules.isSelected,
            instructionMergeAfterOneClick = instructionMergeAfterOneClick.selectedItem as String,
            runAwarenessScan = runAwarenessScan.isSelected,
            runReadiness = runReadiness.isSelected,
            runConfigScan = runConfigScan.isSelected,
            runFirstTestTask = runFirstTestTask.isSelected,
        )
    }

    private fun refreshSummary() {
        val lines = mutableListOf<String>()
        lines.add("Review — One Click Setup will:")
        lines.add("")
        if (model.runCursorToCopilotTrack) {
            lines.add("• Cursor track: skills=${model.migrateSkillsTarget}, rules=${model.syncCursorRulesMode}, MCP port=${model.portCursorMcp}")
        } else {
            lines.add("• Cursor track: off")
        }
        if (model.runClaudeCodeToCopilotTrack) {
            lines.add("• Claude Code track: merge CLAUDE.md=${model.mergeClaudeMdIntoCopilotInstructions}, skills=${model.migrateClaudeSkillsTarget}, .mcp.json port=${model.portClaudeProjectMcp}")
        } else {
            lines.add("• Claude Code track: off")
        }
        lines.add("• Memory bank: ${model.initMemoryBankMode}")
        lines.add("• After bridges: ${model.instructionMergeAfterOneClick}")
        lines.add("• Follow-ups: awareness=${model.runAwarenessScan}, readiness=${model.runReadiness}, scan=${model.runConfigScan}, test=${model.runFirstTestTask}")
        lines.add("")
        lines.add("Settings save to .github/copilot-toolbox-settings.json when you run.")
        summaryArea.text = lines.joinToString("\n")
    }

    private fun stepIntro(): JComponent {
        val html = JBLabel(
            "<html><body style=\"width:420px;\">" +
                "<b>One Click Setup</b> runs bundled Node CLIs in the Run tool window, merges instruction files, " +
                "and runs scans — matching the VS Code Github Copilot ToolBox flow.<br><br>" +
                "Adjust steps on the following screens. Defaults come from your saved toolbox settings.</body></html>",
        )
        return FormBuilder.createFormBuilder()
            .addComponent(html)
            .addComponent(acknowledge)
            .addComponentFillVertically(JPanel(), 0)
            .panel
    }

    private fun stepTracks(): JComponent = FormBuilder.createFormBuilder()
        .addComponent(JBLabel("Choose which migration tracks to run:"))
        .addComponent(trackCursor)
        .addComponent(trackClaude)
        .addComponentFillVertically(JPanel(), 0)
        .panel

    private fun stepCursor(): JComponent = FormBuilder.createFormBuilder()
        .addComponent(JBLabel("Cursor → Copilot (when Cursor track is enabled):"))
        .addLabeledComponent("Migrate .cursor/skills → .agents/skills", migrateSkillsTarget)
        .addLabeledComponent("Skills copy vs move", migrateSkillsMode)
        .addLabeledComponent("Sync Cursor rules → Copilot (.github)", syncCursorRulesMode)
        .addComponent(appendCursorrules)
        .addLabeledComponent("Port Cursor MCP → mcp.json", portCursorMcp)
        .addComponentFillVertically(JPanel(), 0)
        .panel

    private fun stepClaudeShared(): JComponent = FormBuilder.createFormBuilder()
        .addComponent(JBLabel("Claude Code → Copilot + memory bank:"))
        .addComponent(mergeClaudeMdCb)
        .addLabeledComponent("Migrate .claude/skills → .agents/skills", migrateClaudeSkillsTarget)
        .addLabeledComponent("Claude skills mode", migrateClaudeSkillsMode)
        .addLabeledComponent("Port workspace .mcp.json → VS Code mcp.json", portClaudeProjectMcp)
        .addComponent(copilotMcpReminder)
        .addSeparator()
        .addLabeledComponent("Memory bank init (github-copilot-memory-bank)", initMemoryBankMode)
        .addComponent(initMemoryBankCursorRules)
        .addLabeledComponent("After bridges: auto-scan / merge policy", instructionMergeAfterOneClick)
        .addComponentFillVertically(JPanel(), 0)
        .panel

    private fun stepFollowUps(): JComponent = FormBuilder.createFormBuilder()
        .addComponent(JBLabel("Follow-up actions after bridges:"))
        .addComponent(runAwarenessScan)
        .addComponent(runReadiness)
        .addComponent(runConfigScan)
        .addComponent(runFirstTestTask)
        .addComponentFillVertically(JPanel(), 0)
        .panel

    private fun stepSummary(): JComponent {
        val scroll = JBScrollPane(summaryArea)
        scroll.preferredSize = Dimension(480, 220)
        return FormBuilder.createFormBuilder()
            .addComponent(JBLabel("Summary"))
            .addComponent(scroll)
            .addComponentFillVertically(JPanel(), 0)
            .panel
    }

    private fun comboOf(vararg items: String): JComboBox<String> {
        val c = JComboBox(items)
        c.maximumSize = Dimension(Int.MAX_VALUE, c.preferredSize.height)
        return c
    }
}
