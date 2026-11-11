import assert from "node:assert/strict";
import test from "node:test";
import { encodeConfigPayload } from "../src/function/configPayload.mjs";
import deploymentTime from "../src/function/deploymentTime.mjs";
import app from "../src/Hono.js";

const filenames = ["weatherkit-proxy.sgmodule", "weatherkit-proxy.srmodule", "weatherkit-proxy.plugin", "weatherkit-proxy.stoverride", "weatherkit-proxy.yaml", "weatherkit-proxy.snippet"];

test("客户端配置的日期在请求时间变化时保持不变", async () => {
    const originalNow = Date.now;
    const config = encodeConfigPayload(JSON.stringify({ Proxy: { AirQualityScale: false, DomainPolicy: "DIRECT" } }));
    try {
        for (const filename of filenames) {
            for (const path of [`/conf/${filename}`, `/conf/${config}/${filename}`]) {
                Date.now = () => Date.parse("2025-01-01T00:00:00Z");
                const first = await app.request(`https://proxy.example${path}`, { headers: { host: "proxy.example" } });
                assert.equal(first.status, 200);
                const firstBody = await first.text();

                Date.now = () => Date.parse("2026-12-31T23:59:59Z");
                const second = await app.request(`https://proxy.example${path}`, { headers: { host: "proxy.example" } });
                assert.equal(second.status, 200);
                assert.equal(await second.text(), firstBody, path);
                assert.doesNotMatch(firstBody, /__DATE__/);
                if (deploymentTime) assert.ok(firstBody.includes(deploymentTime), path);
            }
        }
    } finally {
        Date.now = originalNow;
    }
});

test("用户策略中的日期占位符文本不会被改写", async () => {
    const config = encodeConfigPayload(JSON.stringify({ Proxy: { DomainPolicy: "group__DATE__" } }));
    const response = await app.request(`https://proxy.example/conf/${config}/weatherkit-proxy.sgmodule`, { headers: { host: "proxy.example" } });
    assert.equal(response.status, 200);
    assert.match(await response.text(), /DOMAIN-SUFFIX,proxy\.example,group__DATE__/);
});
