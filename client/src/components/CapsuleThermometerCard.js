import React from "react";
import {Input, Space, Button} from "antd";
import {Dropdown} from "react-bootstrap";
import ReactEcharts from "echarts-for-react";
import {topProductOption} from "../Data/DashbordData";
import moment from "moment/moment";
import {connect} from "react-redux";

class CapsuleThermometerCard extends React.Component {
    constructor(props) {
        super(props);
        const {
            key, capsule,
        } = props

        this.state = {
            capsule: capsule,
            bleData: [],
            thermoData: [],
            threshold_thermometer: capsule.threshold_thermometer
        };

        this.getBleData(capsule.mac)
        this.getThermometerData(capsule.mac)

        // setInterval(() => {
        //     this.getBleData(capsule.mac)
        //     this.getThermometerData(capsule.mac)
        // }, 1000);

    }

    getBleData = (bleMac) => {
        fetch('/api/ble_data/' + bleMac, {
            method: 'GET', headers: {"Content-Type": "application/json"},
        })
            .then(response => response.json())
            .then(response => {
                response.response.map(entry => {
                    entry.timestamp = moment(entry.timestamp).format('YYYY-MM-DD HH:mm:ss')
                })
                this.setState({
                    bleData: response.response
                })
            })
            .catch(err => console.error(err));
    };

    getThermometerData = (bleMac) => {
        fetch('/api/capsule/thermometer/' + bleMac, {
            method: 'GET',
            headers: {"Content-Type": "application/json"},
        })
            .then(response => response.json())
            .then(response => {
                response.response.map(entry => {
                    entry.timestamp = moment(entry.timestamp).format('YYYY-MM-DD HH:mm:ss')
                })
                this.setState({
                    thermoData: response.response
                })
            })
            .catch(err => console.error(err));
    };

    handleInputChange = (e) => {
        this.setState({
            threshold_thermometer: e.target.value,
        })
    }

    handleThresholdChange = () => {
        this.putCapsuleThreshold('thermometer', this.state.threshold_thermometer)
    };

    putCapsuleThreshold = (type, value) => {
        var urlencoded = new URLSearchParams();
        urlencoded.append("type", type);
        urlencoded.append("value", value);
        urlencoded.append("mac", this.state.capsule.mac);
        fetch('/api/capsule/threshold', {
            method: 'PUT',
            body: urlencoded
        })
            .then(response => response.json())
            .then(response => {
                if (response.code == 200) {
                    alert('更新成功!')
                    // this.getCapsuleThreshold(this.state.bleMac);
                } else if (response.code == 500) {
                    alert(response.massage)
                } else {
                    alert("輸入有錯誤")
                }
            })
            .catch(err => console.error(err));
    };


    render() {
        const {
            capsule,
            handleDeleteCard,
            width = "col"
        } = this.props;

        const {
            thermoData,
            bleData,
            threshold_thermometer
        } = this.state;

        let dateTime = [];
        let allData = [];

        if (thermoData.length > 0) {
            thermoData.map(entry => {
                dateTime.push(entry.timestamp)
                if (typeof (entry.value1) === 'number') allData.push(entry.value1)
                if (typeof (entry.value2) === 'number') allData.push(entry.value2)
                if (typeof (entry.value3) === 'number') allData.push(entry.value3)
                if (typeof (entry.value4) === 'number') allData.push(entry.value4)
            })
        }

        if (bleData.length > 0) {
            bleData.map(entry => {
                dateTime.push(entry.timestamp)
                if (typeof (entry.temperature) === 'number') allData.push(entry.temperature)
            })
        }

        const chartDate = dateTime.sort()

        let chartT1Data = []
        let chartT2Data = []
        let chartT3Data = []
        let chartT4Data = []
        let chartBData = []
        if (chartDate.length > 0) {
            if (thermoData.length > 0) {
                thermoData.map(entry => {
                    chartT1Data.push([chartDate.indexOf(entry.timestamp), entry.value1])
                    chartT2Data.push([chartDate.indexOf(entry.timestamp), entry.value2])
                    chartT3Data.push([chartDate.indexOf(entry.timestamp), entry.value3])
                    chartT4Data.push([chartDate.indexOf(entry.timestamp), entry.value4])
                })
            }
            if (bleData.length > 0) {
                bleData.map(entry => {
                    chartBData.push([chartDate.indexOf(entry.timestamp), entry.temperature])
                })
            }
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
                min: (Math.min(...allData) * 0.9).toFixed(0),
                max: (Math.max(...allData) * 1.1).toFixed(0)
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

        const getResult = (result) => {
            if (result != null) {
                result = result.toLowerCase()
                switch (result) {
                    case "pass":
                        return "success";
                    case "fail":
                        return "danger";
                    case "資料不足":
                        return "warning";
                }
            }
        };

        const getSeverity = (status) => {
            switch (status) {
                case 0:
                    return null;

                case 1:
                    return "danger";

                case 2:
                    return "success";
            }
        };

        const getState = (status) => {
            switch (status) {
                case 0:
                    return "未量測";
                case 1:
                    return "量測中";
                case 2:
                    return "已量測";
            }
        };

        const stateBodyTemplate = (rowData, type) => {
            let test_res = 'Pass'
            switch (rowData['test_' + type]) {
                case 0:
                    test_res = "Fail"
                    break
                case 1:
                    test_res = "Pass"
                    break
                case 2:
                    test_res = "資料不足"
                    break
            }

            return (
                <div className={'flex flex-column'}>
                <span
                    className={'badge badge-' + getSeverity(rowData[type])}>{getState(rowData[type])}</span>
                    {rowData[type] === 2 &&
                        <span
                            className={'badge badge-' + getResult(test_res)}>{test_res}</span>
                    }
                </div>
            );
        }

        return (<div className={width}>
                <div className="card">
                    <div className="header">
                        <h2>{capsule.mac}</h2>
                        <Dropdown as="ul" className="header-dropdown">
                            <Dropdown.Toggle
                                variant="success"
                                as="li"
                                id="dropdown-basic"
                            >
                                <Dropdown.Menu
                                    as="ul"
                                    className="dropdown-menu dropdown-menu-right"
                                >
                                    <li>
                                        <a onClick={handleDeleteCard}>從待測清單移除</a>
                                    </li>
                                </Dropdown.Menu>
                            </Dropdown.Toggle>
                        </Dropdown>
                    </div>
                    <div className="body">
                        <div className={"flex flex-row align-items-center gap-1 mb-3"}>
                            {(capsule.thermometer > 0) &&
                                <div className="input-group align-items-center">
                                    測試門檻值: {threshold_thermometer}
                                </div>
                            }
                            {(capsule.thermometer == 2 || capsule.thermometer == 0) &&
                                <div className="input-group align-items-center">
                                    <div>測試結果:</div>
                                    {stateBodyTemplate(capsule,'thermometer')}
                                </div>
                            }
                        </div>
                        {(capsule.thermometer == 0) &&
                            <div className="input-group mb-3">
                                <Space style={{width: '100%'}}>
                                    <Input addonBefore="測試門檻值" value={threshold_thermometer}
                                           onChange={this.handleInputChange} onPressEnter={this.handleThresholdChange}/>
                                    <Button type="default" onClick={this.handleThresholdChange}>送出</Button>
                                </Space>
                            </div>
                        }

                        <ReactEcharts
                            option={option}
                            style={{height: '200px', width: '100%'}}
                            opts={{renderer: "svg"}}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({}) => ({});

export default connect(mapStateToProps, {})(CapsuleThermometerCard);