import React from "react";
import { connect } from "react-redux";
import * as echarts from "echarts";
import ReactECharts from 'echarts-for-react';
import { optionAreaEchart } from "../../Data/Charts";
import moment from "moment";

class LargeScaleAreaChart extends React.Component {

    render() {
        const {

            thermoData,
            bleData } = this.props;

        let dateTime = []

        thermoData.map(entry => {
            dateTime.push(entry.timestamp)
        })

        bleData.map(entry => {
            dateTime.push(entry.timestamp)
        })

        const chartDate = dateTime.sort()

        // let chartDate = []
        // for (var i = 0; i <= (moment(dateTime[dateTime.length - 1]) - moment(dateTime[0])) / 1000; i++) {
        //     chartDate.push(moment(dateTime[0]).add(i, 'seconds').format('YYYY-MM-DD HH:mm:ss'))
        // }

        let chartT1Data = []
        let chartT2Data = []
        let chartT3Data = []
        let chartT4Data = []
        let chartBData = []
        if (chartDate.length > 0) {
            thermoData.map(entry => {
                chartT1Data.push([chartDate.indexOf(entry.timestamp), entry.value1])
                chartT2Data.push([chartDate.indexOf(entry.timestamp), entry.value2])
                chartT3Data.push([chartDate.indexOf(entry.timestamp), entry.value3])
                chartT4Data.push([chartDate.indexOf(entry.timestamp), entry.value4])
            })
            bleData.map(entry => {
                chartBData.push([chartDate.indexOf(entry.timestamp), entry.temperature])
            })
        }

        const option = {
            legend: {
                data: ['T1', 'T2', 'T3', 'T4', 'BLE']
            },
            tooltip: {
                trigger: "axis",
            },
            title: {
                left: "center",
                text: "",
            },
            grid: {
                top: 60,
                left: 45,
                right: 35,
            },
            toolbox: {
                show: false,
                feature: {
                    restore: {},
                    saveAsImage: {},
                },
            },
            xAxis: [
                {
                    type: "category",
                    boundaryGap: false,
                    data: dateTime,
                }
            ],
            yAxis: {
                type: "value",
            },
            series: [
                {
                    name: "T1",
                    type: "line",
                    itemStyle: {
                        color: "rgb(205, 30, 160)",
                    },
                    data: chartT1Data
                },
                {
                    name: "T2",
                    type: "line",
                    itemStyle: {
                        color: "rgb(255, 70, 131)",
                    },
                    data: chartT2Data
                },
                {
                    name: "T3",
                    type: "line",
                    itemStyle: {
                        color: "rgb(153, 170, 11)",
                    },
                    data: chartT3Data
                },
                {
                    name: "T4",
                    type: "line",
                    itemStyle: {
                        color: "rgb(95, 73, 81)",
                    },
                    data: chartT4Data
                },
                {
                    name: "BLE",
                    type: "line",
                    itemStyle: {
                        color: "rgb(60, 10, 10)"
                    },
                    data: chartBData,
                }
            ],
        }

        return (
            <div className="col-lg-12 col-md-12">
                <div className="card">
                    <div className="header">
                        <h2>溫度對照圖</h2>
                    </div>
                    <div className="body">
                        <ReactECharts
                            option={option}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ analyticalReducer }) => ({});

export default connect(mapStateToProps, {})(LargeScaleAreaChart);
