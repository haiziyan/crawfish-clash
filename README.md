# 🦞 小龙虾大战 (Crawfish Clash)

> 最火爆的小龙虾多人实时对战 IO 游戏！控制你的小龙虾吃遍全场，击败所有对手，登上虾王宝座！

## 游戏特色

- **实时多人对战** — Socket.IO 驱动，低延迟实时同步
- **成长进化系统** — 吃食物变大，击败敌人获得成长加速
- **三大技能** — Q冲刺夹击 / W防御硬壳 / E喷水攻击
- **段位排名** — 小虾米 → 猛虾 → 霸王虾 → 虾将 → 小龙虾之王
- **邀请系统** — 专属邀请码，邀请好友双方均获奖励

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | Next.js 14 (App Router) |
| 游戏渲染 | HTML5 Canvas (原生) |
| 实时通信 | Socket.IO |
| 样式 | TailwindCSS + CSS Variables |
| 游戏服务器 | Node.js + Socket.IO |
| 部署-前端 | Vercel（免费）|
| 部署-后端 | Render（免费）|

## 本地开发

```bash
# 安装依赖
npm install

# 启动前端（终端1）
npm run dev

# 启动游戏服务器（终端2）
npm run dev:server
```

访问 http://localhost:3000

---

## 🚀 部署上线（完全免费方案）

### 第一步：推送代码到 GitHub

```bash
cd C:\wn\code\clawGame\crawfish-clash
git init
git add .
git commit -m "feat: 小龙虾大战初始版本"
```

在 [github.com](https://github.com) 新建仓库（名称建议：`crawfish-clash`），然后：

```bash
git remote add origin https://github.com/你的用户名/crawfish-clash.git
git branch -M main
git push -u origin main
```

---

### 第二步：部署游戏服务器到 Render（免费）

1. 访问 [render.com](https://render.com) 注册账号（可用 GitHub 登录）
2. 点击 **New +** → **Web Service**
3. 选择你的 GitHub 仓库 `crawfish-clash`
4. 填写配置：
   - **Name**: `crawfish-clash-server`
   - **Region**: `Singapore`（亚洲节点，延迟低）
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Plan**: `Free`
5. 添加环境变量（部署后再填）：
   - `CLIENT_URL` = 后面 Vercel 给的网址
6. 点击 **Create Web Service**，等待部署完成
7. 复制 Render 给的地址，格式如：`https://crawfish-clash-server.onrender.com`

> ⚠️ **Render 免费版注意**：服务器15分钟无请求会休眠，首次访问会有约30秒冷启动延迟。代码已内置防休眠 ping，实际游戏时不会断线。

---

### 第三步：部署前端到 Vercel（免费）

1. 访问 [vercel.com](https://vercel.com) 注册账号（可用 GitHub 登录）
2. 点击 **Add New Project** → 导入 `crawfish-clash` 仓库
3. 配置如下：
   - **Framework Preset**: Next.js（自动识别）
   - **Root Directory**: `crawfish-clash`（如果仓库根是 clawGame 的话）
4. 添加环境变量：
   - `NEXT_PUBLIC_GAME_SERVER_URL` = Render 服务器地址（第二步复制的）
5. 点击 **Deploy**，等待2-3分钟
6. 获得你的游戏网址：`https://6.appall.top`

---

### 第四步：回填 CLIENT_URL

1. 回到 Render 控制台 → 你的服务 → **Environment**
2. 将 `CLIENT_URL` 设置为 Vercel 给的网址
3. 点击 **Save Changes**，Render 会自动重新部署

---

### 邀请好友

部署完成后，分享链接格式为：
```
https://6.appall.top/invite/你的邀请码
```

好友点击链接 → 自动跳转注册 → 双方各得 500 积分 + 限定皮肤！

---

## 游戏操作

| 操作 | 说明 |
|------|------|
| 鼠标移动 | 控制小龙虾移动方向 |
| Q 键 | 冲刺夹击（3秒冷却）|
| W 键 | 防御硬壳（4秒冷却）|
| E 键 | 喷水攻击（5秒冷却）|

## 积分规则

- 吃普通虾饵：+1分
- 吃清蒸增幅：+3分
- 吃热卤料：+5分
- 击败敌人：+20分 + 对方积分
- 存活奖励：每10秒+1分

## 段位系统

| 段位 | 所需积分 |
|------|----------|
| 🦐 小虾米 | 0+ |
| 🦞 猛虾 | 500+ |
| 🦞 霸王虾 | 2000+ |
| 🦞 虾将 | 5000+ |
| 👑 小龙虾之王 | 10000+ |
