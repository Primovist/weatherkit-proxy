import { handle } from "hono/vercel";
import app from "./Hono.js";

// 将 Hono 应用包装成 Vercel 处理函数
const handler = handle(app);

// 仅导出 GET，触发 Vercel 的 Web API 模式；其余方法由 Vercel 直接返回 405，与 Hono 内部方法守卫一致
export const GET = handler;
