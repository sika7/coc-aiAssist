local M = {}

-- pickerを任意の形で再利用できる

local winSetting = {
  -- input window
  input = {
    keys = {
      ["/"] = "toggle_focus",
      ["<C-Down>"] = { "history_forward", mode = { "i", "n" } },
      ["<C-Up>"] = { "history_back", mode = { "i", "n" } },
      ["<C-c>"] = { "cancel", mode = "i" },
      ["<C-w>"] = { "<c-s-w>", mode = { "i" }, expr = true, desc = "delete word" },
      ["<CR>"] = { "confirm", mode = { "n", "i" } },
      ["<Down>"] = { "list_down", mode = { "i", "n" } },
      ["<Esc>"] = "cancel",
      ["<S-Tab>"] = { "list_up", mode = { "i", "n" } },
      ["<Tab>"] = { "list_down", mode = { "i", "n" } },
      ["<Up>"] = { "list_up", mode = { "i", "n" } },
      ["<c-b>"] = { "preview_scroll_up", mode = { "i", "n" } },
      ["<c-d>"] = { "list_scroll_down", mode = { "i", "n" } },
      ["<c-f>"] = { "preview_scroll_down", mode = { "i", "n" } },
      ["<c-j>"] = { "list_down", mode = { "i", "n" } },
      ["<c-k>"] = { "list_up", mode = { "i", "n" } },
      ["<c-n>"] = { "list_down", mode = { "i", "n" } },
      ["<c-p>"] = { "list_up", mode = { "i", "n" } },
      ["<c-u>"] = { "list_scroll_up", mode = { "i", "n" } },
      ["?"] = "toggle_help_input",
      ["G"] = "list_bottom",
      ["gg"] = "list_top",
      ["j"] = "list_down",
      ["k"] = "list_up",
      ["q"] = "close",
    },
    b = {
      minipairs_disable = true,
    },
  },
  -- result list window
  list = {
    keys = {
      ["/"] = "toggle_focus",
      ["<2-LeftMouse>"] = "confirm",
      ["<CR>"] = "confirm",
      ["<Down>"] = "list_down",
      ["<Esc>"] = "cancel",
      ["<Tab>"] = "list_down",
      ["<Up>"] = "list_up",
      ["<c-j>"] = "list_down",
      ["<c-k>"] = "list_up",
      ["<c-n>"] = "list_down",
      ["<c-p>"] = "list_up",
      ["<c-c>"] = "close",
      ["<c-u>"] = "list_scroll_up",
      ["?"] = "toggle_help_list",
      ["G"] = "list_bottom",
      ["gg"] = "list_top",
      ["i"] = "focus_input",
      ["j"] = "list_down",
      ["k"] = "list_up",
      ["q"] = "close",
      ["zb"] = "list_scroll_bottom",
      ["zt"] = "list_scroll_top",
      ["zz"] = "list_scroll_center",
    },
    wo = {
      conceallevel = 2,
      concealcursor = "nvc",
    },
  },
  -- preview window
  preview = {
    keys = {
      ["<Esc>"] = "cancel",
      ["q"] = "close",
      ["i"] = "focus_input",
    },
  },
}
-- メイン機能
function M.selectWindow(title, prompt, items, callback)
  local picker = require("snacks.picker")
  picker.pick({
    prompt = prompt,
    title = title,
    items = items,
    format = "text",
    layout = "select",
    preview = false,
    -- search = function(_, item)
    --   return ""
    -- end,
    -- live = true,
    -- supports_live = false,
    win = winSetting,
    confirm = function(pickerInstance, item)
      callback(item)
      pickerInstance:close()
    end,
  })
end

function M.selectAndPreviewWindow(title, prompt, items, callback)
  local picker = require("snacks.picker")
  -- local items = {
  --   {
  --     text = "オプション1",
  --     value = "value1",
  --     preview = {
  --       text = "これはオプション1のプレビューです。",
  --       ft = "markdown",
  --     },
  --   },
  --   {
  --     text = "オプション2",
  --     value = "value2",
  --     preview = {
  --       text = "これはオプション2のプレビューです。",
  --       ft = "markdown",
  --     },
  --   },
  -- }

  picker.pick({
    prompt = prompt,
    title = title,
    items = items,
    format = "text",
    layout = "default",
    preview = "preview",
    -- layout = "dropdown",
    -- search = function(_, item)
    --   return ""
    -- end,
    -- live = true,
    -- supports_live = false,
    win = winSetting,
    confirm = function(pickerInstance, item)
      callback(item)
      pickerInstance:close()
    end,
  })
end

function M.input(title, placeholder, callback)
  local input = require("snacks.input")
  input.input({
    prompt = title,
    default = placeholder,
    backdrop = true,
  }, function(text)
    callback(text)
  end)
end

function M.window(templateCallback, sendCallback)
  local buf = vim.api.nvim_create_buf(false, true)
  local win = require("snacks.win")
  local myWin = win.new({
    buf = buf,
    height = 0.8,
    width = 0.8,
    style = "minimal",
    border = "rounded",
    ft = "markdown",
    wo = {
      spell = false,
      wrap = false,
      signcolumn = "yes",
      statuscolumn = " ",
      conceallevel = 0,
    },
    actions = {
      ["template_replace"] = function(actions)
        templateCallback(buf, actions)
      end,
      ["send_request"] = function(actions)
        local text = actions:text()
        sendCallback(text)
        actions:close()
      end,
    },
    keys = {
      ["<Esc>"] = "cancel",
      ["q"] = "close",
      ["<c-t>"] = { "template_replace", mode = { "i", "n" } },
      ["<c-s>"] = { "send_request", mode = { "i", "n" } },
    },
  })
  myWin:set_title("編集ウィンドウ <c-t> テンプレを選択 <c-s>送信", "center")
end

return M
