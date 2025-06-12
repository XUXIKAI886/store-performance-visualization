# 店铺运营数据可视化动画演示系统

这是一个专为商家培训、经营分析和数据展示设计的动态数据可视化工具。系统通过动画效果直观展示店铺与行业均值的对比情况，帮助运营人员快速识别店铺类型和潜在问题。

## 项目概述

本项目包含三种店铺类型的可视化演示：

1. **优质店铺** (index.html) - 转化率稳定且高于行业均值
2. **劣质店铺** (poor-performance.html) - 转化率远低于行业均值且波动大  
3. **潜力店铺** (potential-store.html) - 下单人数呈阶梯式上升，有回调但能迅速恢复

## 主要功能

- 动态数据加载动画效果，逐点呈现数据趋势
- 自动计算并标注平均值、优劣势区间
- 针对不同店铺类型的个性化数据可视化
- 直观展示关键数据指标与行业均值的差异
- 突出显示数据异常点和回调特征
- 阶梯式增长模式的可视化
- 响应式设计，适配不同屏幕尺寸

## 如何使用

1. 直接在浏览器中打开对应HTML文件：
   - 优质店铺: `index.html`
   - 劣质店铺: `poor-performance.html` 
   - 潜力店铺: `potential-store.html`
2. 演示开始后，将自动逐日展示数据点，形成动画效果
3. 动画结束后，系统会自动分析并标注关键数据特征

## 自定义数据

如需自定义数据，可以修改对应JS文件中的数据生成函数：

- 优质店铺: `script.js` 中的 `generateIndustryData()` 和 `generateStoreData()`
- 劣质店铺: `poor-store.js` 中的 `generateIndustryData()` 和 `generatePoorStoreData()`
- 潜力店铺: `potential-store.js` 中的 `generateIndustryData()` 和 `generatePotentialStoreData()`

## 技术栈

- HTML5 / CSS3 / JavaScript
- Chart.js 库实现图表展示
- chartjs-plugin-annotation 插件实现图表标注
- 纯前端实现，无需后端服务

## 适用场景

- 电商运营培训
- 店铺绩效评估
- 数据分析展示
- 商家经营策略制定
- 营销团队业绩回顾