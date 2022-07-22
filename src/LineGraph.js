import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';
import 'chartjs-adapter-moment';
import 'chartjs-adapter-date-fns';

// import './LineGraph.css'
// import {Chart as ChartJS} from 'chart.js/auto'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineController,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineController,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// const options = {
//     maintainAspectRatio: false,
//     aspectRatio: 0.4,
//     responsive: true,
//     title: {
//         display: true,
//         text: 'X-axis Example based on Time'
//     },
//     scales: {
//         xAxes: {
//             // type: "time",
//             // time: {
//             //     format: "lll",
//             //     tooltipFormat: 'lll'
//             // },
//             ticks: {
//                 autoSkip: true,
//                 maxRotation: 0,
//                 minRotation: 0
//             }
//         }
//     }
// }

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index", 
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        // xAxes: 
        //     {
        //         type: 'time',
        //         time: {
        //             format: "MM/DD/YY",
        //             tooltipFormat: "ll",
        //         },
        //     },
        
        yAxes: 
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        
    },
};

const buildChartData = (data, casesType) => {
    const chartData = [];
    let lastDataPoint;

    for (let date in data.cases) {
        // data[casesType].forEach(date => {
        if (lastDataPoint) {
            let newDataPoint = {
                x: date,
                y: data[casesType][date] - lastDataPoint,
            };
            chartData.push(newDataPoint);
        }
        lastDataPoint = data[casesType][date];
    }
    return chartData;
};

function LineGraph({ casesType = "cases" }, ...props) {
    const [data, setData] = useState({});

    // https://disease.sh/v3/covid-19/historical/all?lastdays=120

    useEffect(() => {
        const fetchData = async () => {
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=30")
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    let chartData = buildChartData(data, casesType);
                    setData(chartData);
                    console.log(chartData);
                    // buildChart(chartData);
                });
        };

        fetchData();
    }, [casesType]);



    return (
        <div className={props.className}>
            {data?.length > 0 && (
                <Line
                    data={{
                        datasets: [
                            {
                                backgroundColor: "rgba(204, 16, 52, 0.5)",
                                borderColor: "#CC1034",
                                data: data,
                            },
                        ],
                    }}
                    options={options}
                />
            )}
        </div>
    );
}

export default LineGraph
