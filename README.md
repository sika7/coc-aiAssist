# coc-claude

A [coc.nvim](https://github.com/neoclide/coc.nvim) extension that provides integration with Anthropic's Claude AI model directly within Neovim/Vim.

## Features

- Ask Claude questions about code and receive responses in a floating window
- Select code in visual mode and ask Claude about the selected code
- Choose between different AI models (Claude 3.7 Sonnet, 3.5 Sonnet, 3.5 Haiku, etc.)
- Quick assist and detailed assist with template selection
- System prompt selection for different use cases
- History viewer to review past conversations
- Prompt template system with examples
- Code-only mode for getting executable code without explanations

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/en/) (>= 14.x)
- [coc.nvim](https://github.com/neoclide/coc.nvim) extension manager
- An Anthropic API key for accessing Claude models

### Install with coc.nvim

<!-- ```vim
:CocInstall coc-claude
``` -->

```init.vim
Plug 'sika7/coc-claude'
```

## Configuration

Add the following settings to your coc-settings.json file:

```json
{
  "claude.apiKey": "YOUR_ANTHROPIC_API_KEY",
  "claude.model": "claude-3.7-sonnet-20250219",
  "claude.maxTokens": 1000
}
```

You can modify these settings based on your preferences:

- `claude.apiKey`: Your Anthropic API key (required)
- `claude.model`: The Claude model to use (default: "claude-3.7-sonnet-20250219")
- `claude.maxTokens`: Maximum tokens for response (default: 1000)

## Commands

This extension provides the following commands:

- `:CocCommand claude.quickAssist`: Quick assistant via input
- `:CocCommand claude.detailedAssist`: Detailed assistant with template selection
- `:CocCommand claude.selectClient`: Select AI client
- `:CocCommand claude.selectModel`: Select Claude model
- `:CocCommand claude.selectSystemPrompt`: Select system prompt
- `:CocCommand claude.showHistory`: Show history of conversations
- `:CocCommand claude.showExample`: Show prompt template examples
- `:CocCommand claude.writeExample`: Write prompt template examples
- `:CocCommand claude.log`: Show the Claude extension log

## Keymaps

The extension registers the following default keymaps in visual mode:

- `<Plug>(claude-ask)`: Ask Claude about selected code
- `<Plug>(claude-ask-code-only)`: Ask Claude about selected code with code-only mode

Add to your vimrc/init.vim to customize:

```vim
" Example keymaps
vmap <leader>ca <Plug>(claude-ask)
vmap <leader>cc <Plug>(claude-ask-code-only)
```

## Prompt Templates

The extension supports customizable prompt templates. Create a `prompt-template.yaml` file in your project root based on the provided example file.

```yaml
# Example structure
version: "1.0"

system:
  - lavel: "Developer Assistant"
    value: "You are a helpful assistant for developers..."
    
templates:
  - template_type: "Normal"
    template: ""
    
  - template_type: "Code Only"
    template: "I need executable code only, no explanations..."
```

## Usage

### Quick Assist
1. Run `:CocCommand claude.quickAssist`
2. Type your question in the input box
3. Claude will respond and the answer will be saved in history

### Detailed Assist
1. Run `:CocCommand claude.detailedAssist`
2. Select a prompt template
3. Enter your question
4. Claude will respond with a more detailed answer

### Model Selection
1. Run `:CocCommand claude.selectModel`
2. Choose from available Claude models
3. The selected model will be used for future requests

### System Prompt Selection
1. Run `:CocCommand claude.selectSystemPrompt`
2. Choose from available system prompts
3. The selected system prompt defines Claude's behavior

## License

MIT

---

> This extension is built with [create-coc-extension](https://github.com/fannheyward/create-coc-extension)