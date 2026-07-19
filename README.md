# WeatherKit-Proxy

这是一个对 [NSRingo/WeatherKit](https://github.com/NSRingo/WeatherKit) 进行重构与改造的项目，使其支持自主独立部署在 **Cloudflare Workers**、**Cloudflare Pages** 与 **Vercel**。

本项目包含基于公开上游项目构建产物和接口行为进行适配的兼容实现，相关第三方来源及许可证信息请参阅 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。

> 本项目为独立第三方项目，与 Apple Inc.、WeatherKit 或其相关产品不存在官方关联、认可或赞助关系。

---

## 🚀 部署指南

### 部署到 Cloudflare Workers

#### 方式 1：通过 Cloudflare 网页后台部署
1. 登录 Cloudflare 仪表板。
2. 依次进入 **Workers 和 Pages** -> **创建** -> **克隆 Git 存储库**。
3. 导入本项目仓库。
4. 点击部署。

#### 方式 2：通过本地命令行部署

```bash
git clone https://github.com/meme-lau/weatherkit-proxy.git
cd weatherkit-proxy
npm install
npm run deploy:wrangler
```

---

### 部署到 Cloudflare Pages

```bash
npm run deploy:pages
```

---

### 部署到 Vercel

```bash
npm run deploy:vercel
```

---

## ⚙️ 可视化配置中心与一键导入

部署成功后访问部署地址即可打开配置中心。

## 🎨 核心功能特点

- 支持多天气数据源组合适配。
- 支持空气质量标准转换。
- 支持边缘缓存和自定义配置。
