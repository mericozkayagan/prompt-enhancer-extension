import * as vscode from 'vscode';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { enhancePrompt, AIModelConfig } from './services/aiService';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

// Status bar item to show the enhancement status
let statusBarItem: vscode.StatusBarItem;

// Output channel for logging
let outputChannel: vscode.OutputChannel;

// Activation function that's called when the extension is activated
export function activate(context: vscode.ExtensionContext) {
  console.log('Prompt Enhancer extension is now active');

  // Create output channel for logging
  outputChannel = vscode.window.createOutputChannel("Text Enhancer");
  outputChannel.appendLine('Text Enhancer extension activated');
  context.subscriptions.push(outputChannel);

  // Create status bar item
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.text = "$(sparkle) Enhance";
  statusBarItem.tooltip = "Open text input for enhancement";
  statusBarItem.command = 'prompt-enhancer.enhancePrompt';
  context.subscriptions.push(statusBarItem);

  // Always show status bar item on activation
  statusBarItem.show();
  outputChannel.appendLine('Status bar item created and shown');

  // Register the enhance prompt command
  const enhancePromptCommand = vscode.commands.registerCommand('prompt-enhancer.enhancePrompt', async () => {
    outputChannel.appendLine('Command prompt-enhancer.enhancePrompt triggered');

    try {
      // Get the active text editor
      const editor = vscode.window.activeTextEditor;
      let prompt = '';

      // If there's an active editor with a selection, use the selected text
      if (editor && editor.selection && !editor.selection.isEmpty) {
        prompt = editor.document.getText(editor.selection);
        outputChannel.appendLine(`Text selected from editor: ${prompt.substring(0, 50)}...`);
      } else {
        // Otherwise, show input box to get the prompt text
        const inputOptions: vscode.InputBoxOptions = {
          prompt: "Enter text to enhance",
          placeHolder: "Write your text here and press Enter to enhance it",
          ignoreFocusOut: true
        };

        outputChannel.appendLine('Showing input box for text entry');
        prompt = await vscode.window.showInputBox(inputOptions) || '';
      }

      if (!prompt || prompt.trim() === '') {
        outputChannel.appendLine('No text provided, cancelling operation');
        return; // User canceled or entered empty text
      }

      // Check if model type is configured
      const config = vscode.workspace.getConfiguration('promptEnhancer');
      const modelType = config.get<string>('modelType');
      outputChannel.appendLine(`Model type from config: ${modelType || 'not set'}`);

      if (!modelType) {
        outputChannel.appendLine('Model type not configured, showing error message');
        const result = await vscode.window.showErrorMessage(
          'Please configure the AI model type in the extension settings.',
          'Open Settings'
        );

        if (result === 'Open Settings') {
          await vscode.commands.executeCommand(
            'workbench.action.openSettings',
            'promptEnhancer.modelType'
          );
        }
        return;
      }

      // Get the appropriate API key based on model type (try environment variable first, then settings)
      let apiKey = '';
      let endpoint = '';

      switch (modelType) {
        case 'openai':
          apiKey = process.env.OPENAI_API_KEY || config.get<string>('openaiApiKey') || '';
          break;
        case 'deepseek':
          apiKey = process.env.DEEPSEEK_API_KEY || config.get<string>('deepseekApiKey') || '';
          break;
        case 'azure_openai':
          apiKey = process.env.AZURE_OPENAI_API_KEY || config.get<string>('azureOpenaiApiKey') || '';
          endpoint = process.env.AZURE_OPENAI_ENDPOINT || config.get<string>('azureOpenaiEndpoint') || '';
          break;
        case 'claude':
          apiKey = process.env.CLAUDE_API_KEY || config.get<string>('claudeApiKey') || '';
          break;
      }

      outputChannel.appendLine(`API key for ${modelType}: ${apiKey ? 'provided' : 'not provided'}`);
      if (modelType === 'azure_openai') {
        outputChannel.appendLine(`Azure endpoint: ${endpoint ? 'provided' : 'not provided'}`);
      }

      if (!apiKey) {
        outputChannel.appendLine('API key not configured, showing error message');
        const result = await vscode.window.showErrorMessage(
          `Please configure the API key for ${modelType} in the extension settings or .env file.`,
          'Open Settings'
        );

        if (result === 'Open Settings') {
          await vscode.commands.executeCommand(
            'workbench.action.openSettings',
            `promptEnhancer.${modelType === 'azure_openai' ? 'azureOpenaiApiKey' :
              modelType === 'openai' ? 'openaiApiKey' :
              modelType === 'deepseek' ? 'deepseekApiKey' : 'claudeApiKey'}`
          );
        }
        return;
      }

      if (modelType === 'azure_openai' && !endpoint) {
        outputChannel.appendLine('Azure endpoint not configured, showing error message');
        const result = await vscode.window.showErrorMessage(
          'Please configure the Azure OpenAI endpoint in the extension settings or .env file.',
          'Open Settings'
        );

        if (result === 'Open Settings') {
          await vscode.commands.executeCommand(
            'workbench.action.openSettings',
            'promptEnhancer.azureOpenaiEndpoint'
          );
        }
        return;
      }

      // Update status bar
      statusBarItem.text = "$(sync~spin) Enhancing...";
      statusBarItem.show();
      outputChannel.appendLine('Starting text enhancement process');

      // Show progress while enhancing the prompt
      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Enhancing text...',
        cancellable: false
      }, async (progress) => {
        progress.report({ message: 'Sending text to AI model...' });
        outputChannel.appendLine('Sending text to AI model');

        // Enhance the prompt
        const modelConfig: AIModelConfig = {
          modelType,
          apiKey,
          endpoint
        };

        try {
          const enhancedPrompt = await enhancePrompt(prompt, modelConfig);
          outputChannel.appendLine('Received enhanced text from AI model');

          // If we have an active editor with selection, replace the text
          if (editor && editor.selection && !editor.selection.isEmpty) {
            outputChannel.appendLine('Replacing selected text in editor');
            editor.edit(editBuilder => {
              editBuilder.replace(editor.selection, enhancedPrompt);
            });
          } else {
            // Otherwise show the enhanced text in a new document
            outputChannel.appendLine('Creating new document with enhanced text');
            progress.report({ message: 'Displaying enhanced text...' });
            const document = await vscode.workspace.openTextDocument({
              content: enhancedPrompt,
              language: 'markdown'
            });
            await vscode.window.showTextDocument(document);
          }

          // Reset status bar
          statusBarItem.text = "$(sparkle) Enhance";

          // Notify the user that the text has been enhanced
          vscode.window.showInformationMessage(
            'Text enhanced! The improved version has been applied.'
          );
        } catch (err: any) {
          outputChannel.appendLine(`Error enhancing text: ${err.message}`);
          throw err; // Re-throw to be caught by outer catch block
        }
      });
    } catch (error: any) {
      // Reset status bar on error
      statusBarItem.text = "$(sparkle) Enhance";
      outputChannel.appendLine(`Error in command execution: ${error.message}`);
      outputChannel.appendLine(error.stack || 'No stack trace available');
      vscode.window.showErrorMessage(`Error enhancing text: ${error.message}`);
    }
  });

  // Add the command to the context
  context.subscriptions.push(enhancePromptCommand);
  outputChannel.appendLine('Command registered with context');

  // Check if this is the first activation
  const hasShownWelcome = context.globalState.get('promptEnhancer.hasShownWelcome');

  if (!hasShownWelcome) {
    // Show welcome message and prompt to configure settings
    outputChannel.appendLine('Showing welcome message');
    vscode.window.showInformationMessage(
      'Thank you for installing Text Enhancer! Please configure your preferred AI model.',
      'Configure Settings'
    ).then(selection => {
      if (selection === 'Configure Settings') {
        vscode.commands.executeCommand(
          'workbench.action.openSettings',
          'promptEnhancer'
        );
      }
    });

    // Remember that we've shown the welcome message
    context.globalState.update('promptEnhancer.hasShownWelcome', true);
  }
}

export function deactivate() {
  // Cleanup when the extension is deactivated
  outputChannel.appendLine('Extension being deactivated');
  if (statusBarItem) {
    statusBarItem.dispose();
  }
  if (outputChannel) {
    outputChannel.dispose();
  }
}
