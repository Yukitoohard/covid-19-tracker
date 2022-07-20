import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';
import './LineGraph.css'
import {Chart as ChartJS} from 'chart.js/auto'

// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend,
//     } from 'chart.js';
    
//     ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend
//     );

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        }
    },
    maintainAspectRatio: false,
    tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function(tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            }
        }
    },
    scales: {
        // xAxis: {
        //   type: 'time',
        //   time: {
        //     format: "MM/DD/YY",
        //     tooltipFormat: 'll'
        //   },
        // },
        yAxis: {
            gridLines: {
                display: false,
            },
            ticks: {
                // For a category axis, the val is the index so the lookup via getLabelForValue is needed
                callback: function(value, index, values) {
                  // Hide every 2nd tick label
                  return numeral(value).format("0a");
                },
              }
        }
      },
};

const buildChartData = (data, casesType='cases') => {
    const chartData = [];
    let lastDataPoint;

    for (let date in data.cases) {
    // data[casesType].forEach(date => {
        if (lastDataPoint) {
            const newDataPoint = {
                x: date,
                y: data[casesType][date] - lastDataPoint
            }
            chartData.push(newDataPoint)
        }
        lastDataPoint = data[casesType][date];
    };
    return chartData;
};

function LineGraph() {
    const [data, setData] = useState({});

    // https://disease.sh/v3/covid-19/historical/all?lastdays=120

    useEffect(() => {
        const fetchData = async () => {
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
                .then(response => response.json())
                .then(data => {
                    let chartData = buildChartData(data, "cases");
                    setData(chartData);
                    console.log(chartData);
                })
        }

        fetchData();
    }, [])

    

    return (
        <div>
            <h1>I'm a Graph</h1>
            {data?.length > 0 && (
                // data && data.length > 0
                <Line 
                    className='line__graph'
                    options={options} 
                    data={{
                        datasets: [{
                            backgroundColor: "rgba(204, 16, 52, 0.5)",
                            borderColor: "#CC1034",
                            data: data
                        }]
                }} 
                />
            )} 
            
        </div>
    )
}

export default LineGraph
