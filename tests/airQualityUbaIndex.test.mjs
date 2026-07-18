import assert from "node:assert/strict";
import test from "node:test";
import AirQuality from "../src/class/AirQuality.mjs";

const UGM3 = "MICROGRAMS_PER_CUBIC_METER";

// 彩云天气风格的污染物（PM2.5=35 等真实量级）。
const pollutants = [
    { pollutantType: "CO", amount: 1000, units: UGM3 },
    { pollutantType: "NO2", amount: 40, units: UGM3 },
    { pollutantType: "SO2", amount: 20, units: UGM3 },
    { pollutantType: "OZONE", amount: 100, units: UGM3 },
    { pollutantType: "PM2_5", amount: 35, units: UGM3 },
    { pollutantType: "PM10", amount: 50, units: UGM3 },
];

const Settings = {
    AirQuality: {
        Calculate: { Algorithm: "UBA", AllowOverRange: false },
        Current: { Index: { ForceCNPrimaryPollutants: false } },
    },
};

function uba(p) {
    return AirQuality.Pollutants2AQI({ pollutants: p, metadata: { providerName: "彩云天气", temporarilyUnavailable: false } }, Settings, {
        algorithm: "UBA",
        allowOverRange: false,
        forcePrimaryPollutant: false,
    });
}

/**
 * UBA 的整数 index 必须等于 categoryIndex（与上游 NSRingo/WeatherKit 一致）。
 *
 * 背景：UBA 的 LQI 是 0-4 的小数分值，FlatBuffer 的 index 字段是 Int16 只能存整数，且 iOS 要求
 * index 与 categoryIndex 一致才会渲染空气质量卡片。上游在算出 categoryIndex 后令 index = categoryIndex
 * （1-5），二者恒等。
 *
 * 此前本仓库改为 floor(primaryPollutant.index)：该点 PM2.5=35 → primaryPollutant.index≈3.208 →
 * floor=3，但 categoryIndex=4，二者错位（index=3、categoryIndex=4），iOS 据此隐藏 UBA 卡片
 * （表现为「同地区只有 UBA 不出卡，HJ/美国/欧盟正常」——其余标准的 index 与 categoryIndex 不依赖该取整，故不受影响）。
 *
 * 本测试锁死 index === categoryIndex，防止回退到 floor 取整导致 UBA 卡片再次被隐藏。
 */
test("UBA 整数 index 必须等于 categoryIndex（与上游一致），PM2.5=35 时二者均为 4 而非 3", () => {
    const res = uba(pollutants);
    assert.equal(res.categoryIndex, 4, "PM2.5=35 在 UBA 下应落入 categoryIndex 4（schlecht / 差）");
    assert.equal(res.index, res.categoryIndex, `index 必须等于 categoryIndex（=${res.categoryIndex}），否则 iOS 隐藏 UBA 卡片；实际 index=${res.index}`);
    assert.equal(res.index, 4, "应与上游一致：index = categoryIndex = 4，而非 floor(3.208)=3");
    assert.equal(res.primaryPollutant, "PM2_5");
    assert.equal(res.scale, "UBA");
});

test("UBA 跨多档浓度 index 与 categoryIndex 恒等（核心不变式）", () => {
    // 不假定每档都由 PM2.5 主导（低浓度时 OZONE/NO2 可能成为主污染物）；
    // 只验证无论落在哪一档，整数 index 都必须等于该档 categoryIndex。
    const amounts = [3, 10, 25, 40, 80, 150, 300];
    for (const amount of amounts) {
        const p = pollutants.map(x => (x.pollutantType === "PM2_5" ? { ...x, amount } : x));
        const res = uba(p);
        assert.ok(res.categoryIndex >= 1 && res.categoryIndex <= 5, `categoryIndex 应在 1-5，实际 ${res.categoryIndex}`);
        assert.equal(res.index, res.categoryIndex, `PM2.5=${amount}：index(${res.index}) 必须等于 categoryIndex(${res.categoryIndex})`);
    }
});
