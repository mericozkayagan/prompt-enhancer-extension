# Prompt Enhancer for VSCode

<p align="center">
  <img src="media/logo.png" alt="Prompt Enhancer Logo" width="128" height="128">
</p>

A VSCode extension that enhances selected text using various AI models to make your prompts clearer, more specific, and better structured while maintaining the original intent.

## Features

- Enhance prompts using AI models like OpenAI, Deepseek, Azure OpenAI, and Claude
- Simple one-click enhancement from the editor toolbar
- Quick keyboard shortcut: `Alt+E` (works on Windows, Linux, and macOS)
- Customizable enhancement instructions
- Multi-model support with easy configuration

![Prompt Enhancer in action](media/demo.gif)

## Installation

### From VS Code Marketplace

1. Open Extensions view in VS Code (View > Extensions)
2. Search for "Prompt Enhancer"
3. Click Install

### Manual Installation

1. Download the `.vsix` file from the latest [release](https://github.com/mericozkayagan/prompt-enhancer-extension/releases)
2. In VS Code, go to Extensions view and click "Install from VSIX..."
3. Select the downloaded `.vsix` file

## Configuration

1. Open VS Code Settings (File > Preferences > Settings)
2. Search for "Prompt Enhancer"
3. Configure the following settings:
   - **Model Type**: Choose between OpenAI, Deepseek, Azure OpenAI, or Claude
   - **API Key**: Enter the API key for your chosen model
   - **Enhancement Instruction**: Customize the system prompt that guides the AI in enhancing your text. You can modify this to create different enhancement styles or focus on specific aspects of improvement.

### To modify the instruction:

1. Go to Settings > Extensions > Prompt Enhancer
2. Edit the "Enhancement Instruction" setting

## Usage

1. Select text in your editor
2. Click the "Enhance Prompt" button in the editor toolbar or use the keyboard shortcut (Alt+E)
3. The selected text will be enhanced and replaced with the improved version

## Troubleshooting Keyboard Shortcuts

If the keyboard shortcut `Alt+E` isn't working:

1. **Check for conflicts**: Open VS Code Keyboard Shortcuts (Code > Preferences > Keyboard Shortcuts) and search for `Alt+E` to see if it's assigned to multiple commands
2. **Manually set the shortcut**:
   - Open Keyboard Shortcuts
   - Search for "Enhance Prompt"
   - Click the + icon to add or change the keyboard shortcut
   - Press `Alt+E` (or your preferred combination)
3. **Restart VS Code**: Sometimes a restart is needed for keyboard settings to take effect
4. **Alternative method**: You can always use the command palette (Cmd+Shift+P or Ctrl+Shift+P) and type "Enhance Prompt" to run the command

## Local Development

### Prerequisites

- Node.js and npm
- Visual Studio Code

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/mericozkayagan/prompt-enhancer-extension.git
   cd prompt-enhancer-extension
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your API key of choice:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   DEEPSEEK_API_KEY=your_deepseek_api_key_here
   AZURE_OPENAI_API_KEY=your_azure_openai_api_key_here
   AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint_here
   CLAUDE_API_KEY=your_claude_api_key_here
   ```

### Development Workflow

1. Make your code changes
2. Run the extension in debug mode:

   ```bash
   npm run watch
   ```

   Then press F5 in VS Code to launch a new window with the extension loaded

3. Build the extension package:

   ```bash
   npm run package
   ```

4. Test the packaged extension:
   ```bash
   code --install-extension prompt-enhancer-extension-*.vsix
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Privacy & Security

This extension sends your selected text to external AI services for enhancement. Your API keys are stored locally and no data is collected by the extension itself.
