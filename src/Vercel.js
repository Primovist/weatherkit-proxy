import { handle } from "hono/vercel";
import app from "./Hono.js";

export default handle(app);
