document.addEventListener('DOMContentLoaded', function() {
    // 生成30天的日期标签
    const dates = generateDates(30);
    
    // 生成模拟数据
    const industryData = generateIndustryData();
    const storeData = generatePoorStoreData();
    
    // 图表配置
    const ctx = document.getElementById('conversionChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: '本店铺',
                    data: [],  // 初始为空，将通过动画填充
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderWidth: 3,
                    tension: 0.3, // 降低平滑度，增加波动感
                    pointRadius: 4,
                    pointBackgroundColor: 'rgba(255, 159, 64, 1)',
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
                            return context.dataset.label + ': ' + context.raw.toFixed(2) + '%';
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
                            yMin: 20,
                            yMax: 20,
                            borderColor: 'rgba(255, 99, 132, 0.5)',
                            borderWidth: 2,
                            borderDash: [6, 6],
                            label: {
                                enabled: true,
                                content: '行业均值 20%',
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
                    beginAtZero: false,
                    min: 5, // 进一步降低下限以显示更低的转化率
                    max: 30,
                    title: {
                        display: true,
                        text: '下单转化率 (%)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
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

// 生成行业平均数据 - 围绕20%波动
function generateIndustryData() {
    const data = [];
    const baseValue = 20;
    let lastValue = baseValue;
    
    // 平滑连贯的波动
    for (let i = 0; i < 30; i++) {
        // 产生围绕基准值的适中波动
        const randomVariation = (Math.random() * 1.0 - 0.5);
        lastValue = lastValue + randomVariation;
        
        // 防止偏离基准值太远
        if (lastValue > baseValue + 2.0) {
            lastValue = baseValue + 2.0 - (Math.random() * 0.6);
        } else if (lastValue < baseValue - 2.0) {
            lastValue = baseValue - 2.0 + (Math.random() * 0.6);
        }
        
        data.push(lastValue);
    }
    
    return data;
}// 生成劣质店铺数据 - 低于行业均值且波动很大
function generatePoorStoreData() {
    const data = [];
    const baseValue = 10.5; // 基准值远低于行业均值
    let lastValue = baseValue;
    
    // 高度波动的数据
    for (let i = 0; i < 30; i++) {
        // 产生围绕基准值的大幅波动，波动范围±5%
        const randomVariation = (Math.random() * 6 - 3); // 大幅波动
        
        // 每隔几天产生异常值，模拟管理混乱
        if (i % 7 === 0) {
            lastValue = baseValue - 2 - (Math.random() * 3); // 定期出现低谷
        } else if (i % 5 === 0) {
            lastValue = baseValue + (Math.random() * 4); // 偶尔有小高峰
        } else {
            lastValue = lastValue + randomVariation;
            
            // 限制不要偏离太远
            if (lastValue > baseValue + 5) {
                lastValue = baseValue + 5 - (Math.random() * 1.0);
            } else if (lastValue < baseValue - 5) {
                lastValue = baseValue - 5 + (Math.random() * 1.0);
            }
        }
        
        data.push(lastValue);
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
            // 动画完成后添加对比指示
            highlightComparison(chart);
        }
    };
    
    // 开始添加数据
    setTimeout(addData, 500);
}// 添加对比高亮指示
function highlightComparison(chart) {
    // 计算平均值
    const storeAvg = calculateAverage(chart.data.datasets[0].data);
    const industryAvg = calculateAverage(chart.data.datasets[1].data);
    
    // 添加劣势区域高亮
    chart.options.plugins.annotation.annotations.zone1 = {
        type: 'box',
        xMin: 0,
        xMax: chart.data.labels.length - 1,
        yMin: storeAvg,
        yMax: industryAvg,
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 0,
        label: {
            display: true,
            content: '劣势区间',
            position: 'center',
            color: 'rgba(255, 99, 132, 0.8)',
            font: {
                weight: 'bold'
            }
        }
    };
    
    // 添加店铺平均线
    chart.options.plugins.annotation.annotations.line2 = {
        type: 'line',
        yMin: storeAvg,
        yMax: storeAvg,
        borderColor: 'rgba(255, 159, 64, 0.5)',
        borderWidth: 2,
        borderDash: [6, 6],
        label: {
            enabled: true,
            content: '本店均值 ' + storeAvg.toFixed(2) + '%',
            position: 'end',
            backgroundColor: 'rgba(255, 159, 64, 0.8)',
        }
    };
    
    // 标记波动过大区域（波动超过2%的点）
    let previousValue = null;
    for (let i = 0; i < chart.data.datasets[0].data.length; i++) {
        const currentValue = chart.data.datasets[0].data[i];
        
        if (previousValue !== null) {
            const change = Math.abs(currentValue - previousValue);
            
            // 波动超过2%的点标记为异常点
            if (change > 2) {
                chart.options.plugins.annotation.annotations['volatility' + i] = {
                    type: 'point',
                    xValue: i,
                    yValue: currentValue,
                    backgroundColor: 'rgba(255, 0, 0, 0.5)',
                    radius: 6
                };
            }
        }
        
        previousValue = currentValue;
    }
    
    // 更新图表
    chart.update();
}

// 计算平均值
function calculateAverage(data) {
    const sum = data.reduce((a, b) => a + b, 0);
    return sum / data.length;
}