# BoxJS 配置项与系统默认参数映射说明

在 WeatherKit-Proxy 项目中，原版运行于本地代理软件（如 Surge、Loon、Quantumult X）上的 BoxJS 订阅配置面板参数，已经固化为云端 Workers 部署的底层默认预设。本文档详细说明了这些参数在项目中的映射路径、默认配置以及合并规则。

## 1. 配置加载与合并优先级

服务每次处理天气请求时，均会调用 `setENV` 并通过 `getStorage` 进行配置的初始化与合并。配置项的优先级从低到高如下（后者将覆盖前者）：

1. **系统底层预设** (`database.Default.Settings`)：例如默认日志级别为 `INFO`。
2. **模块默认配置** (`database.WeatherKit.Settings`)：本项目的默认替换方案（详见下文）。
3. **全局运行参数** (`globalThis.$argument`)：传统代理软件由外部插件或重写注入的参数。
4. **自定义请求参数** (`queryArguments`)：
   - 网页配置中心导出的 Base64 自定义配置（会解码并合并为请求参数，如 `/p/ey...`）。
   - URL 中的扁平 Query 参数。
5. **持久化缓存覆盖** (`PersistentStore.WeatherKit.Settings`)：保存在本地持久化存储中的覆盖参数。

---

## 2. BoxJS 配置项与默认 Settings 映射对照表

本项目的底层配置均声明在 `src/function/database.mjs` 的 `WeatherKit.Settings` 中，对应原版 BoxJS 的字段如下：

| 默认配置中的字段路径 | 对应的原版 BoxJS 设置项 | 默认值 / 默认逻辑行为 |
| :--- | :--- | :--- |
| `Weather.Replace` | `[天气] 替换范围` | `["CN"]`：表示当定位区域属于中国大陆时，才触发第三方源替换。 |
| `Weather.Provider` | `[天气] 数据源` | `"ColorfulClouds"`：默认使用**彩云天气**提供实况与多日天气预报。 |
| `NextHour.Provider` | `[未来一小时降水] 数据源` | `"ColorfulClouds"`：分钟级降雨卡片数据默认由彩云天气提供。 |
| `AirQuality.Current.Pollutants.Provider` | `[今日污染物] 数据源` | `"ColorfulClouds"`：PM2.5、PM10等污染物原始浓度由彩云提供。 |
| `AirQuality.Current.Index.Replace` | `[今日空气指数] 替换目标` | `["HJ6332012"]`：表示仅替换中国的国标空气质量指数标准。 |
| `AirQuality.Current.Index.Provider` | `[今日空气指数] 数据源` | `"ColorfulCloudsCN"`：当前 AQI 及其对应的健康首要污染物使用彩云国标源。 |
| `AirQuality.Current.Index.ForceCNPrimaryPollutants` | `[今日空气指数] 强制主要污染物` | `false`：默认遵循国标规定（仅在 AQI > 50 时才计算并展示主要污染物）。 |
| `AirQuality.Comparison.Yesterday.IndexProvider` | `[昨日空气指数] 数据源` | `"ColorfulCloudsCN"`：昨日空气质量对比数据统一设置为彩云国标源。 |
| `AirQuality.Calculate.Algorithm` | `空气质量计算算法` | `"WAQI_InstantCast_CN"`：计算 AQI 时使用彩云天气的国标实时监测算法。 |
| `API.ColorfulClouds.Token` | `彩云天气 Token` | `null`：默认回退到公共 Token `caiyun_notify`，无需用户额外部署 Token。 |
| `API.QWeather.Token` | `和风天气 Token` | `null`：和风天气 API 密钥，改用和风天气作为 Provider 时需自行传入。 |

---

## 3. 常见配置覆写示例

由于免除了本地 BoxJS 界面，配置现在完全由请求 URL 的 Base64 段所携带。例如：
当使用配置 `{"Weather":{"Provider":"QWeather"},"API":{"QWeather":{"Token":"your_token"}}}` 编码为 Base64 并通过规则订阅时，Worker 接收到 `/p/ey...` 请求后，会执行以下覆盖：

```js
// 伪代码流程
const queryArguments = decodeBase64Config(c.req.param("configBase64")); 
// 合并后，将原先默认的 ColorfulClouds 替换为 QWeather
_.merge(Root.Settings, database.WeatherKit.Settings, queryArguments); 
```

通过这一映射逻辑，您可以在网页配置中心根据上述选项随时生成个性化 URL，无需在设备本地安装或配置 BoxJS 即可享受完全相同的参数定制能力。
