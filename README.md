<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1m2jAZDaeuHAO8w83zpUemAEviDxZbUDN

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

1. **创建 GitHub 仓库并推送代码：**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **设置环境变量：**
   - 前往 GitHub 仓库的 Settings > Secrets and variables > Actions
   - 点击 "New repository secret"
   - 添加 `GEMINI_API_KEY` 密钥，值为你的 Gemini API 密钥
   - 从 [Google AI Studio](https://aistudio.google.com/app/apikey) 获取 API 密钥

3. **启用 GitHub Pages：**
   - 前往 GitHub 仓库的 Settings > Pages
   - 在 "Source" 下拉菜单中选择 "GitHub Actions"
   - 推送代码后，GitHub Actions 会自动构建并部署应用
   - 部署完成后，你可以在 https://YOUR_USERNAME.github.io/YOUR_REPO_NAME 访问应用

**注意：** 如果你的仓库名称不是 `Turing_Test`，请在 `vite.config.ts` 中更新 `base` 配置中的仓库名称。