// 各代理客户端配置按客户端拆分维护，此处统一聚合为 { 文件名: 配置内容 }。
// 占位符 __HOST__ / __DOMAIN__ / __DATE__ 由 src/Hono.js 在 /conf/:filename 下载时替换。
import egern from "./egern.mjs";
import loon from "./loon.mjs";
import quantumultx from "./quantumultx.mjs";
import shadowrocket from "./shadowrocket.mjs";
import stash from "./stash.mjs";
import surge from "./surge.mjs";

export default {
    "weatherkit-proxy.sgmodule": surge,
    "weatherkit-proxy.srmodule": shadowrocket,
    "weatherkit-proxy.plugin": loon,
    "weatherkit-proxy.stoverride": stash,
    "weatherkit-proxy.yaml": egern,
    "weatherkit-proxy.snippet": quantumultx,
};
