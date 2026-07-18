/**
 * 在 Apple 返回的 capability 列表上补齐代理所需能力，保留未来新增项。
 *
 * @param {unknown} appleCapabilities
 * @param {string[]} pluginCapabilities
 * @returns {unknown}
 */
export default function mergeWeatherKitAvailability(appleCapabilities, pluginCapabilities = []) {
    if (!Array.isArray(appleCapabilities)) return appleCapabilities;
    return [...new Set([...appleCapabilities, ...pluginCapabilities])];
}
