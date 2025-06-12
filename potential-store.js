document.addEventListener('DOMContentLoaded', function() {
    // 生成30天的日期标签
    const dates = generateDates(30);
    
    // 生成模拟数据
    const industryData = generateIndustryData();
    const storeData = generatePotentialStoreData();
    
    // 图表配置
    const ctx = document.getElementById('ordersChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: '本店铺',
                    data: [],  // 初始为空，将通过动画填充
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 3,
                    tension: 0.2, // 降低平滑度，突出阶梯感
                    pointRadius: 4,
                    pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                    lineTension: 0.2,
                },
                {
                    label: '商圈同行均值',
                    data: [],  // 初始为空，将通过动画填充
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: false,
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw.toFixed(0) + '单';
                        }
                    }
                },
                legend: {
                    display: false
                },
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            yMin: 30,
                            yMax: 30,
                            borderColor: 'rgba(255, 99, 132, 0.5)',
                            borderWidth: 2,
                            borderDash: [6, 6],
                            label: {
                                enabled: true,
                                content: '行业均值 30单',
                                position: 'start',
                                backgroundColor: 'rgba(255, 99, 132, 0.8)',
                            }
                        },
                    }
                }
            },            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: '日期',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        callback: function(value, index, values) {
                            // 显示部分日期标签，避免拥挤
                            return index % 5 === 0 ? this.getLabelForValue(value) : '';
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: 55, // 从0开始以展示从1单的增长
                    title: {
                        display: true,
                        text: '下单人数 (单)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '单';
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            animation: {
                duration: 2000
            }
        }
    });
    
    // 执行动画展示数据
    animateChart(chart, industryData, storeData);
});// 生成过去30天的日期
function generateDates(days) {
    const dates = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        dates.push(`${month}月${day}日`);
    }
    
    return dates;
}

// 生成行业平均数据 - 围绕30单波动
function generateIndustryData() {
    const data = [];
    const baseValue = 30; // 平均30单
    let lastValue = baseValue;
    
    // 平缓波动的数据
    for (let i = 0; i < 30; i++) {
        // 产生围绕基准值的波动
        const randomVariation = (Math.random() * 4 - 2); // 波动范围±2单
        lastValue = lastValue + randomVariation;
        
        // 防止偏离基准值太远
        if (lastValue > baseValue + 5) {
            lastValue = baseValue + 5 - (Math.random() * 2);
        } else if (lastValue < baseValue - 5) {
            lastValue = baseValue - 5 + (Math.random() * 2);
        }
        
        data.push(Math.round(lastValue)); // 取整，因为人数是整数
    }
    
    return data;
}// 生成潜力店铺数据 - 从1单开始阶梯式增长模式，并添加回调
function generatePotentialStoreData() {
    const data = [];
    
    // 定义三个明显的阶段，每个阶段有一定的基础值，并包含回调
    const stages = [
        { start: 0, end: 9, baseStart: 1, baseEnd: 15 },   // 第一阶段：从1单到15单
        { start: 10, end: 19, baseStart: 25, baseEnd: 35 }, // 第二阶段：从25单到35单
        { start: 20, end: 29, baseStart: 42, baseEnd: 50 }  // 第三阶段：从42单到50单
    ];
    
    for (let i = 0; i < 30; i++) {
        let value;
        
        // 确定当前所在阶段
        let currentStage;
        if (i < 10) {
            currentStage = stages[0];
        } else if (i < 20) {
            currentStage = stages[1];
        } else {
            currentStage = stages[2];
        }
        
        // 阶段内基础增长值（不包括回调）
        const stageProgress = (i - currentStage.start) / (currentStage.end - currentStage.start);
        const baseGrowth = currentStage.baseStart + stageProgress * (currentStage.baseEnd - currentStage.baseStart);
        
        // 添加回调点
        if (i === 4) { // 第一阶段回调
            value = 5; // 明显回落到较低值
        } else if (i === 5) {
            value = 7; // 开始恢复
        } else if (i === 13) { // 第二阶段回调
            value = 22; // 明显回落
        } else if (i === 14) {
            value = 24; // 开始恢复
        } else if (i === 15) {
            value = 27; // 继续恢复并超过
        } else if (i === 23) { // 第三阶段回调
            value = 38; // 明显回落
        } else if (i === 24) {
            value = 40; // 开始恢复
        } else if (i === 25) {
            value = 43; // 恢复并继续增长
        } else if (i === 0) {
            value = 1; // 第一天确保是1单
        } else if (i === 9) {
            value = 18; // 第一阶段结束点
        } else if (i === 10) {
            value = 25; // 第二阶段开始点，形成明显阶梯
        } else if (i === 19) {
            value = 35; // 第二阶段结束点
        } else if (i === 20) {
            value = 42; // 第三阶段开始点，形成明显阶梯
        } else {
            // 非关键点的正常增长，添加小的随机波动
            const randomVariation = (Math.random() * 1.5 - 0.5);
            value = baseGrowth + randomVariation;
        }
        
        data.push(Math.max(1, Math.round(value))); // 取整，确保最小为1单
    }
    
    return data;
}

// 动画展示数据
function animateChart(chart, industryData, storeData) {
    // 逐日添加数据点来实现动画效果
    let currentIndex = 0;
    
    const addData = function() {
        if (currentIndex < industryData.length) {
            // 添加数据点
            chart.data.datasets[0].data.push(storeData[currentIndex]);
            chart.data.datasets[1].data.push(industryData[currentIndex]);
            
            // 更新图表
            chart.update();
            currentIndex++;
            
            // 计划下一个数据点的添加
            setTimeout(addData, 150);
        } else {
            // 动画完成后添加对比指示和阶梯标记
            highlightStages(chart);
        }
    };
    
    // 开始添加数据
    setTimeout(addData, 500);
}// 添加阶梯特征标记和对比指示
function highlightStages(chart) {
    // 计算平均值
    const storeAvg = calculateAverage(chart.data.datasets[0].data);
    const industryAvg = calculateAverage(chart.data.datasets[1].data);
    
    // 添加阶段标记 - 第一阶段
    chart.options.plugins.annotation.annotations.stage1 = {
        type: 'box',
        xMin: 0,
        xMax: 9,
        borderColor: 'rgba(75, 192, 192, 0.3)',
        backgroundColor: 'rgba(75, 192, 192, 0.05)',
        borderWidth: 2,
        label: {
            enabled: true,
            content: '阶段一: 初创期 (1-15单)',
            position: 'start',
            backgroundColor: 'rgba(75, 192, 192, 0.7)',
        }
    };
    
    // 添加阶段标记 - 第二阶段
    chart.options.plugins.annotation.annotations.stage2 = {
        type: 'box',
        xMin: 10,
        xMax: 19,
        borderColor: 'rgba(75, 192, 192, 0.3)',
        backgroundColor: 'rgba(75, 192, 192, 0.05)',
        borderWidth: 2,
        label: {
            enabled: true,
            content: '阶段二: 成长期 (25-35单)',
            position: 'start',
            backgroundColor: 'rgba(75, 192, 192, 0.7)',
        }
    };
    
    // 添加阶段标记 - 第三阶段
    chart.options.plugins.annotation.annotations.stage3 = {
        type: 'box',
        xMin: 20,
        xMax: 29,
        borderColor: 'rgba(75, 192, 192, 0.3)',
        backgroundColor: 'rgba(75, 192, 192, 0.05)',
        borderWidth: 2,
        label: {
            enabled: true,
            content: '阶段三: 超越期 (42-50单)',
            position: 'start',
            backgroundColor: 'rgba(75, 192, 192, 0.7)',
        }
    };
    
    // 添加店铺平均线
    chart.options.plugins.annotation.annotations.line2 = {
        type: 'line',
        yMin: storeAvg,
        yMax: storeAvg,
        borderColor: 'rgba(75, 192, 192, 0.5)',
        borderWidth: 2,
        borderDash: [6, 6],
        label: {
            enabled: true,
            content: '本店均值 ' + Math.round(storeAvg) + '单',
            position: 'end',
            backgroundColor: 'rgba(75, 192, 192, 0.8)',
        }
    };
    
    // 添加回调点标记
    // 第一阶段回调
    chart.options.plugins.annotation.annotations.callback1 = {
        type: 'point',
        xValue: 4,
        yValue: chart.data.datasets[0].data[4],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        radius: 6,
        label: {
            enabled: true,
            content: '回调点',
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
            position: 'bottom'
        }
    };
    
    // 第二阶段回调
    chart.options.plugins.annotation.annotations.callback2 = {
        type: 'point',
        xValue: 13,
        yValue: chart.data.datasets[0].data[13],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        radius: 6,
        label: {
            enabled: true,
            content: '回调点',
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
            position: 'bottom'
        }
    };
    
    // 第三阶段回调
    chart.options.plugins.annotation.annotations.callback3 = {
        type: 'point',
        xValue: 23,
        yValue: chart.data.datasets[0].data[23],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        radius: 6,
        label: {
            enabled: true,
            content: '回调点',
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
            position: 'bottom'
        }
    };
    
    // 更新图表
    chart.update();
}

// 计算平均值
function calculateAverage(data) {
    const sum = data.reduce((a, b) => a + b, 0);
    return sum / data.length;
}