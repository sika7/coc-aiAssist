local M = {}

-- ユーティリティモジュールをロード
local window = require('coc-aiAssist.window')

local function cocChannelId()
  for _, chan in ipairs(vim.api.nvim_list_chans()) do
    if chan["mode"] == "rpc" and chan["argv"] and string.find(chan["argv"][1], "node") then
      return chan["id"]
    end
  end
end

local function safeJsonDecode(jsonStr)
  local safe = jsonStr:gsub("[\r\n]", "\\n")
  return vim.fn.json_decode(safe)
end

local channelId = cocChannelId()

local function myNotice(noticeName, value)
  vim.fn.rpcnotify(channelId, noticeName, value)
end

function M.toastInfo(message)
  vim.notify(message, vim.log.levels.INFO)
end

function M.selectWindow(noticeName, title, prompt, jsonStr)
  local items = vim.fn.json_decode(jsonStr)
  window.selectWindow(title, prompt, items, function(item)
    myNotice(noticeName, item.value)
  end)
end

function M.selectAndPreviewWindow(noticeName, title, prompt, jsonStr)
  local items = vim.fn.json_decode(jsonStr)
  window.selectAndPreviewWindow(title, prompt, items, function(item)
    myNotice(noticeName, item.value)
  end)
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
function M.show_input(noticeName, title, placeholder)
  window.input(title, placeholder, function(text)
    if not text then
      text = ""
    end
    myNotice(noticeName, text)
  end)
end

function M.showDetailedWindow(noticeName, title, prompt, jsonStr)
  local items = safeJsonDecode(jsonStr)

  local setTemple = function(buf, actions)
    -- 確定時
    local confirm = function(item)
      -- 選択したテンプレのプレビューをバッファーに設定
      local lines = vim.split(item.preview.text, "\n")
      vim.api.nvim_buf_set_lines(buf, 0, -1, false, lines)
      actions:focus()
    end

    -- ウィンドウのクローズ時
    local cancel = function()
      -- フォーカスを戻す
      actions:focus()
    end

    -- バッファーを設定するコールバック
    window.selectAndPreviewWindow(title, prompt, items, confirm, cancel)
  end

  local sendText = function(text)
    -- 送信するテキストのコールバック
    myNotice(noticeName, text)
  end

  window.window(
    setTemple,
    sendText)
end

function M.historyWindow(title, prompt, jsonStr)
  local items = safeJsonDecode(jsonStr)

  -- 確定時
  local confirm = function(_, item)
    local cancel = function(actions)
      actions:close({ buf = true })
    end
    window.previewWin(item.value, cancel)
  end

  window.selectAndPreviewWin(title, prompt, items, confirm)
end

return M
