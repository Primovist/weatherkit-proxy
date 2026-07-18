/**
 * 只允许配置关闭代理能够注入的已知数据集；Apple 新增的数据集始终透传。
 *
 * @param {string[]} requestedDataSets
 * @param {string[]} enabledDataSets
 * @param {string[]} configurableDataSets
 * @returns {string[]}
 */
export default function filterWeatherKitDataSets(requestedDataSets = [], enabledDataSets = [], configurableDataSets = []) {
    const enabled = new Set(enabledDataSets);
    const configurable = new Set(configurableDataSets);
    return requestedDataSets.filter(dataSet => !configurable.has(dataSet) || enabled.has(dataSet));
}
