import * as vscode from 'vscode';
import fetch from 'node-fetch';

export interface AIModelConfig {
  modelType: string;
  apiKey: string;
  endpoint?: string;
}

export async function enhancePrompt(prompt: string, config: AIModelConfig): Promise<string> {
  try {
    const configuration = vscode.workspace.getConfiguration('promptEnhancer');
    const instruction = configuration.get<string>('enhancementInstruction');

    if (!instruction) {
      throw new Error('Enhancement instruction is not set in the extension settings');
    }

    let enhancedPrompt = '';

    switch (config.modelType) {
      case 'openai':
        enhancedPrompt = await enhanceWithOpenAI(prompt, instruction, config.apiKey);
        break;
      case 'deepseek':
        enhancedPrompt = await enhanceWithDeepseek(prompt, instruction, config.apiKey);
        break;
      case 'azure_openai':
        if (!config.endpoint) {
          throw new Error('Azure OpenAI endpoint is not set');
        }
        enhancedPrompt = await enhanceWithAzureOpenAI(prompt, instruction, config.apiKey, config.endpoint);
        break;
      case 'claude':
        enhancedPrompt = await enhanceWithClaude(prompt, instruction, config.apiKey);
        break;
      default:
        throw new Error(`Unsupported model type: ${config.modelType}`);
    }

    return enhancedPrompt;
  } catch (error) {
    console.error('Error enhancing prompt:', error);
    throw error;
  }
}

async function enhanceWithOpenAI(prompt: string, instruction: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: instruction },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    })
  });

  const data = await response.json() as any;

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${data.error?.message || response.statusText}`);
  }

  return data.choices[0].message.content;
}

async function enhanceWithDeepseek(prompt: string, instruction: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-coder',
      messages: [
        { role: 'system', content: instruction },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    })
  });

  const data = await response.json() as any;

  if (!response.ok) {
    throw new Error(`Deepseek API error: ${data.error?.message || response.statusText}`);
  }

  return data.choices[0].message.content;
}

async function enhanceWithAzureOpenAI(
  prompt: string,
  instruction: string,
  apiKey: string,
  endpoint: string
): Promise<string> {
  const url = `${endpoint}/openai/deployments/gpt-4/chat/completions?api-version=2023-05-15`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey
    },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: instruction },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    })
  });

  const data = await response.json() as any;

  if (!response.ok) {
    throw new Error(`Azure OpenAI API error: ${data.error?.message || response.statusText}`);
  }

  return data.choices[0].message.content;
}

async function enhanceWithClaude(prompt: string, instruction: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      system: instruction,
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  const data = await response.json() as any;

  if (!response.ok) {
    throw new Error(`Claude API error: ${data.error?.message || response.statusText}`);
  }

  return data.content[0].text;
}
