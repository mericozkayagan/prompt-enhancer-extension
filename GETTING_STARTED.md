# Quick Start Guide: Prompt Enhancer for Cursor

This guide will help you quickly set up and use the Prompt Enhancer extension with your OpenAI API key.

## Setting Up Your API Key

1. First, make sure you have an OpenAI API key. If you don't have one yet, you can get it from [OpenAI Platform](https://platform.openai.com/api-keys).

2. In the root directory of the extension, create a file named `.env` (if it doesn't already exist).

3. Add your OpenAI API key to the `.env` file:

   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

   Replace `your_actual_api_key_here` with your actual OpenAI API key.

4. Save the file.

## Starting the Extension

### For Development

1. Install dependencies (if you haven't already):

   ```bash
   npm install
   ```

2. Compile the extension:

   ```bash
   npm run compile
   ```

3. For active development with auto-recompilation:

   ```bash
   npm run dev
   ```

4. Press F5 in VS Code to launch a new window with the extension loaded

### For Regular Use

1. Install the packaged extension in Cursor:

   ```bash
   npm run package
   ```

   This will create a `.vsix` file in your project directory.

2. In Cursor, go to Extensions view and click "Install from VSIX..."

3. Locate the `.vsix` file you just created and select it.

## Using the Extension

1. Open Cursor and access any code file

2. Click on the AI chat panel

3. Type your prompt in the chat input field

4. Before sending, click the "Enhance Prompt" button (to the left of the send button)

5. The extension will enhance your prompt using OpenAI

6. You can then either:
   - Copy the enhanced prompt to use in Cursor's chat
   - Send it directly to Cursor's AI (if you choose "Yes" when prompted)

## Troubleshooting

If you encounter any issues:

- Make sure your `.env` file is in the root directory of the extension
- Ensure your API key is correctly formatted with no extra spaces
- Check that you have an active internet connection
- Verify that your OpenAI API key has sufficient credits and permissions
- Try restarting Cursor if the extension isn't working properly

For more detailed documentation, see the [README.md](README.md) file.
