// 生成日期数据 - 近30天
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

// 生成店铺进店率数据 - 范围在6.5%-7.2%之间小幅波动
function generateStoreEntryRates() {
    const data = [];
    const baseValue = 6.8; // 基础进店率为6.8%
    let lastValue = baseValue;
    
    // 平滑连贯的波动
    for (let i = 0; i < 30; i++) {
        // 产生围绕基准值的适中波动
        // 使用上一个点的值作为参考，确保曲线平滑
        const randomVariation = (Math.random() * 0.3 - 0.15); // 适中的波动
        lastValue = lastValue + randomVariation;
        
        // 防止偏离基准值太远
        if (lastValue > baseValue + 0.4) {
            lastValue = baseValue + 0.4 - (Math.random() * 0.1);
        } else if (lastValue < baseValue - 0.3) {
            lastValue = baseValue - 0.3 + (Math.random() * 0.1);
        }
        
        data.push(parseFloat(lastValue.toFixed(1)));
    }
    
    return data;
}

// 生成行业平均进店率数据 - 范围在4.8%-5.2%之间小幅波动
function generateIndustryEntryRates() {
    const data = [];
    const baseValue = 5.0; // 基础行业进店率为5.0%
    let lastValue = baseValue;
    
    for (let i = 0; i < 30; i++) {
        // 使用正弦函数生成更平滑的波动，加上更小的随机因素
        const randomVariation = (Math.random() * 0.2 - 0.1);
        lastValue = lastValue + randomVariation;
        
        // 确保在合理范围内
        if (lastValue > baseValue + 0.2) {
            lastValue = baseValue + 0.2 - (Math.random() * 0.05);
        } else if (lastValue < baseValue - 0.2) {
            lastValue = baseValue - 0.2 + (Math.random() * 0.05);
        }
        
        data.push(parseFloat(lastValue.toFixed(1)));
    }
    
    return data;
}

// 初始化图表
function initChart() {
    const dates = generateDates(30);
    const storeData = generateStoreEntryRates();
    const industryData = generateIndustryEntryRates();
    
    // 获取Canvas元素
    const ctx = document.getElementById('entryRateChart').getContext('2d');
    
    // 计算行业均值横线
    const industryAverage = industryData.reduce((sum, value) => sum + value, 0) / industryData.length;
    
    // 创建图表
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: '本店铺进店率',
                    data: [],  // 初始为空，将通过动画填充
                    borderColor: 'rgba(46, 134, 193, 1)',
                    backgroundColor: 'rgba(46, 134, 193, 0.2)',
                    borderWidth: 3,
                    tension: 0.4, // 增加平滑度
                    pointRadius: 4,
                    pointBackgroundColor: 'rgba(46, 134, 193, 1)',
                },
                {
                    label: '商圈同行均值',
                    data: [],  // 初始为空，将通过动画填充
                    borderColor: 'rgba(192, 57, 43, 1)',
                    backgroundColor: 'rgba(192, 57, 43, 0.2)',
                    borderWidth: 3,
                    tension: 0.4, // 增加平滑度
                    pointRadius: 4,
                    pointBackgroundColor: 'rgba(192, 57, 43, 1)',
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
                            return context.dataset.label + ': ' + context.raw.toFixed(1) + '%';
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
                            yMin: 5.0,
                            yMax: 5.0,
                            borderColor: 'rgba(192, 57, 43, 0.5)',
                            borderWidth: 2,
                            borderDash: [6, 6],
                            label: {
                                enabled: true,
                                content: '行业均值 5.0%',
                                position: 'start',
                                backgroundColor: 'rgba(192, 57, 43, 0.8)',
                            }
                        },
                    }
                }
            },
            scales: {
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
                    min: 3,
                    max: 8,
                    title: {
                        display: true,
                        text: '进店率 (%)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        stepSize: 1, // 设置刻度间距为1%
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
    
    // 文字分析部分的渐入动画
    const analysisItems = document.querySelectorAll('.analysis p');
    analysisItems.forEach((item, index) => {
        item.style.opacity = 0;
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            item.style.opacity = 1;
            item.style.transform = 'translateY(0)';
        }, 5000 + index * 400); // 在图表动画接近完成后逐条显示
    });
}

// 添加对比高亮指示
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
        backgroundColor: 'rgba(46, 134, 193, 0.1)',
        borderColor: 'rgba(46, 134, 193, 0.2)',
        borderWidth: 0,
        label: {
            display: true,
            content: '优势区间',
            position: 'center',
            color: 'rgba(46, 134, 193, 0.8)',
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
        borderColor: 'rgba(46, 134, 193, 0.5)',
        borderWidth: 2,
        borderDash: [6, 6],
        label: {
            enabled: true,
            content: '本店均值 ' + storeAvg.toFixed(1) + '%',
            position: 'end',
            backgroundColor: 'rgba(46, 134, 193, 0.8)',
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

// 页面加载完成后初始化图表
document.addEventListener('DOMContentLoaded', initChart); 