local M = {}

local function cocChannelId()
  for _, chan in ipairs(vim.api.nvim_list_chans()) do
    if chan["mode"] == "rpc" and chan["argv"] and string.find(chan["argv"][1], "node") then
      return chan["id"]
    end
  end
end

local channelId = cocChannelId()

local function myNotice(noticeName, value)
  vim.fn.rpcnotify(channelId, noticeName, value)
end

-- ユーティリティモジュールをロード
-- local window = require('coc-assist.window')
function M.selectAndPreviewWindow(noticeName, title,  prompt, jsonStr)
  local items = vim.fn.json_decode(jsonStr)

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
    win = {
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
          ["<S-CR>"] = { { "pick_win", "jump" } },
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
    },
    confirm = function(pickerInstance, item)
      myNotice(noticeName, item.value)
      pickerInstance:close()
    end,
  })

  -- picker.pick("test", {
  --   prompt = "[]",
  --   sources = {},
  --   focus = "input",
  -- })
end

-- function M.test()
--   local picker = require("snacks.picker")
--   local options = { "赤", "青", "緑" }
--
--   picker.select(options, {
--     prompt = "好きな色を選んでください:",
--     format_item = function(item)
--       return "🎨 " .. item
--     end,
--   }, function(choice, idx)
--     if choice then
--       print("あなたが選んだのは: " .. choice .. "（" .. idx .. "番目）")
--     else
--       print("何も選ばれませんでした")
--     end
--   end)
-- end

-- function M.test()
--   local layout = require("snacks.layout")
--   local window = require("snacks.win")
--
--   local templateWin = window.new({
--     relative = "editor",
--   })
--
--   local editWin = window.new({
--     relative = "editor",
--   })
--
--   local layoutWin = layout.new({
--     layout = {
--       width = 0.9,
--       height = 0.9,
--       fullscreen = false,
--       border = "rounded",
--       box = "horizontal",
--       {
--         win = "template",
--         width = 0.5,
--         border = "rounded",
--         title = "テンプレート",
--         style = "minimal",
--       },
--       {
--         win = "editor",
--         width = 0.5,
--         border = "rounded",
--         title = "編集",
--         style = "minimal",
--       },
--     },
--     wins = {
--       template = templateWin,
--       editor = editWin,
--     },
--   })
-- end


-- メイン機能
function M.show_input(key, title, placeholder)
  local input = require("snacks.input")
  vim.g.async_result = nil
  input.input({
    prompt = title,
    default = placeholder,
    backdrop = true,
  }, function(text)
    if not text then
      text = ""
    end
    vim.fn.rpcnotify(channelId, key, text)
  end)
end

function M.show_window(key)
  local window = require("snacks.win")
  window.new({
    relative = "editor",
    height = 0.9,
    width = 0.9,
    style = "minimal",
    border = "rounded",
  })
  vim.fn.rpcnotify(channelId, key, "")
end

local win_id = nil
local buf_id = nil

-- テンプレートテキスト
local template_text = {
  "これはテンプレートです。",
  "必要な情報を書き加えてください。",
}

-- フローティングウインドウを開く関数
function M.open_snack_window(key)
  local window = require("snacks.win")
  -- buf_id = vim.api.nvim_create_buf(false, true)
  local test = window.new({
    relative = "editor",
    height = 0.9,
    width = 0.9,
    -- row = 4,
    -- col = 10,
    style = "minimal",
    border = "rounded",
  })

  test:open()

  -- キーマップ設定
  -- local opts = { noremap = true, silent = true, buffer = buf_id }

  -- <C-s> で内容取得
  -- vim.api.nvim_buf_set_keymap(buf_id, "n", "<C-s>", "", vim.tbl_extend("force", opts, {
  --   callback = function()
  --     local lines = vim.api.nvim_buf_get_lines(buf_id, 0, -1, false)
  --     print("入力された内容:")
  --     print(table.concat(lines, "\n"))
  --     vim.fn.rpcnotify(channelId, key, table.concat(lines, "\n"))
  --     if win_id and vim.api.nvim_win_is_valid(win_id) then
  --       vim.api.nvim_win_close(win_id, true)
  --     end
  --   end,
  -- }))

  -- <C-q> でウィンドウ閉じる
  -- vim.api.nvim_buf_set_keymap(buf_id, "n", "<C-q>", "", vim.tbl_extend("force", opts, {
  --   callback = function()
  --     if win_id and vim.api.nvim_win_is_valid(win_id) then
  --       vim.api.nvim_win_close(win_id, true)
  --     end
  --   end,
  -- }))

  -- <C-t> でテンプレート挿入
  -- vim.api.nvim_buf_set_keymap(buf_id, "n", "<C-t>", "", vim.tbl_extend("force", opts, {
  --   callback = function()
  --     vim.api.nvim_buf_set_lines(buf_id, 0, -1, false, template_text)
  --   end,
  -- }))
end

return M
