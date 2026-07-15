// 各代理客户端配置按客户端拆分维护，此处统一聚合为 { 文件名: 配置内容 }。
// 占位符由 src/Hono.js 在 /conf/:filename 下载时替换：__HOST__（携带 base64 配置路径，仅 api/v2/weather 使用）、
// __PLAIN_HOST__（裸主机，availability/airQualityScale 等无需配置的接口）、__DOMAIN__、__DATE__。
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
