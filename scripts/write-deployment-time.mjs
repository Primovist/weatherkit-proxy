import { writeFile } from "node:fs/promises";

// 配置文件中的日期使用北京时间，并在部署构建期间固定。
const date = new Date(Date.now() + 8 * 60 * 60 * 1000);
const timestamp = date.toISOString().slice(0, 19).replace("T", " ");
await writeFile(new URL("../src/function/deploymentTime.mjs", import.meta.url), `// 由部署构建生成，请勿手动修改。\nexport default ${JSON.stringify(timestamp)};\n`);
console.log(`配置部署时间（北京时间）：${timestamp}`);
