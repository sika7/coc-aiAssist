-- このファイルはNeovimの起動時、または拡張機能がロードされたときに自動的に実行されます

-- グローバル変数で依存関係状態を保持
vim.g.coc_ai_assist_extension_deps_loaded = false

-- 依存関係をチェック
local function check_dependencies()
  local has_snacks, _ = pcall(require, 'snacks')

  if has_snacks then
    vim.g.coc_ai_assist_extension_deps_loaded = true
    vim.notify("MyExtension: Dependencies loaded successfully", vim.log.levels.INFO)
  else
    vim.notify(
      "MyExtension: Dependencies not found. Please add to your lazy.nvim config",
      vim.log.levels.WARN
    )
  end
end

-- 依存関係チェックを実行
check_dependencies()
