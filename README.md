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
| 部署-前端 | Vercel |
| 部署-后端 | Railway |

## 本地开发

```bash
# 安装依赖
npm install

# 启动前端
npm run dev

# 启动游戏服务器（新终端）
npm run dev:server
```

访问 http://localhost:3000

## 部署到 Vercel

### 1. 部署游戏服务器到 Railway

1. 注册 [Railway](https://railway.app) 账号
2. 新建项目，选择 "Deploy from GitHub repo"
3. 设置启动命令：`node server/index.js`
4. 添加环境变量：`CLIENT_URL=https://your-app.vercel.app`
5. 获取部署后的服务器 URL

### 2. 部署前端到 Vercel

1. 注册 [Vercel](https://vercel.com) 账号
2. 导入 GitHub 仓库
3. 添加环境变量：
   - `NEXT_PUBLIC_GAME_SERVER_URL` = Railway 服务器 URL
4. 点击 Deploy

### 3. 推送代码到 GitHub

```bash
git init
git add .
git commit -m "feat: 小龙虾大战初始版本"
git remote add origin https://github.com/你的用户名/crawfish-clash.git
git push -u origin main
```

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
