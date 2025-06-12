document.addEventListener('DOMContentLoaded', function() {
    // 生成30天的日期标签
    const dates = generateDates(30);
    
    // 生成模拟数据
    const industryData = generateIndustryData();
    const storeData = generateStoreData();
    
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
                    borderColor: 'rgba(53, 162, 235, 1)',
                    backgroundColor: 'rgba(53, 162, 235, 0.2)',
                    borderWidth: 3,
                    tension: 0.4, // 增加平滑度
                    pointRadius: 4,
                    pointBackgroundColor: 'rgba(53, 162, 235, 1)',
                },
                {
                    label: '商圈同行均值',
                    data: [],  // 初始为空，将通过动画填充
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 3,
                    tension: 0.4, // 增加平滑度
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
                    min: 15,
                    max: 35,
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
});
// 生成过去30天的日期
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
        // 产生围绕基准值的适中波动，范围±2%
        // 使用上一个点的值作为参考，确保曲线平滑
        const randomVariation = (Math.random() * 1.0 - 0.5); // 适中的波动
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
}// 生成店铺数据 - 围绕27.5%波动 (25-30%范围)
function generateStoreData() {
    const data = [];
    const baseValue = 27.5;
    let lastValue = baseValue;
    
    // 平滑连贯的波动
    for (let i = 0; i < 30; i++) {
        // 产生围绕基准值的适中波动
        // 使用上一个点的值作为参考，确保曲线平滑
        const randomVariation = (Math.random() * 1.2 - 0.6); // 适中的波动
        lastValue = lastValue + randomVariation;
        
        // 防止偏离基准值太远
        if (lastValue > baseValue + 2.5) {
            lastValue = baseValue + 2.5 - (Math.random() * 0.8);
        } else if (lastValue < baseValue - 2.5) {
            lastValue = baseValue - 2.5 + (Math.random() * 0.8);
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
            setTimeout(addData, 150); // 放慢动画速度，让过渡更平滑
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
    
    // 添加优势区域高亮
    chart.options.plugins.annotation.annotations.zone1 = {
        type: 'box',
        xMin: 0,
        xMax: chart.data.labels.length - 1,
        yMin: industryAvg,
        yMax: storeAvg,
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 0,
        label: {
            display: true,
            content: '优势区间',
            position: 'center',
            color: 'rgba(75, 192, 192, 0.8)',
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
        borderColor: 'rgba(53, 162, 235, 0.5)',
        borderWidth: 2,
        borderDash: [6, 6],
        label: {
            enabled: true,
            content: '本店均值 ' + storeAvg.toFixed(2) + '%',
            position: 'end',
            backgroundColor: 'rgba(53, 162, 235, 0.8)',
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