# coc-claude

A [coc.nvim](https://github.com/neoclide/coc.nvim) extension that provides integration with Anthropic's Claude AI model directly within Neovim/Vim.

## Features

- Ask Claude questions about code and receive responses in a floating window
- Select code in visual mode and ask Claude about the selected code
- Code-only mode for getting executable code without explanations
- Response preview with options to insert code into your buffer
- Copy Claude responses to the clipboard

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/en/) (>= 14.x)
- [coc.nvim](https://github.com/neoclide/coc.nvim) extension manager
- An Anthropic API key for accessing Claude models

### Install with coc.nvim

```vim
:CocInstall coc-claude
```

```init.vim
Plug 'sika7/coc-claude'
```

## Configuration

Add the following settings to your coc-settings.json file:

```json
{
  "claude.apiKey": "YOUR_ANTHROPIC_API_KEY",
  "claude.model": "claude-3-7-sonnet-20250219",
  "claude.maxTokens": 1000
}
```

You can modify these settings based on your preferences:

- `claude.apiKey`: Your Anthropic API key (required)
- `claude.model`: The Claude model to use (default: "claude-3-7-sonnet-20250219")
- `claude.maxTokens`: Maximum tokens for response (default: 1000)

## Commands

This extension provides the following commands:

- `:CocCommand claude.ask`: Ask Claude a question
- `:CocCommand claude.askCodeOnly`: Ask Claude for code-only response
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

## Usage

1. Select code in visual mode (optional)
2. Run `:CocCommand claude.ask` or use your keymap
3. Type your question in the input box
4. Claude will respond in a dialog window
5. You can copy the response to clipboard or insert it into your buffer

### Code-Only Mode

When you want Claude to provide only executable code without explanations:

1. Use `:CocCommand claude.askCodeOnly` or the code-only keymap
2. Enter your request for code
3. Claude will return only the code without markdown formatting or explanations

## License

MIT

---

> This extension is built with [create-coc-extension](https://github.com/fannheyward/create-coc-extension)
