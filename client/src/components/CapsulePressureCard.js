import React from "react";
import {Input, Space, Button, Table} from "antd";
import {Dropdown} from "react-bootstrap";
import ReactEcharts from "echarts-for-react";
import {topProductOption} from "../Data/DashbordData";
import moment from "moment/moment";
import {connect} from "react-redux";

class CapsulePressureCard extends React.Component {
    constructor(props) {
        super(props);
        const {
            key, capsule
        } = props

        this.state = {
            capsule: capsule,
            bleData: [],
            pressureData: [],
            threshold_pressure_750: capsule.threshold_pressure_750,
            threshold_pressure_800: capsule.threshold_pressure_800,
            threshold_pressure_850: capsule.threshold_pressure_850
        };

        this.getBleData(capsule.mac)
        this.getPressureData(capsule.mac)

        // setInterval(() => {
        //     this.getBleData(capsule.mac)
        //     this.getPressureData(capsule.mac)
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

    getPressureData = (bleMac) => {
        fetch('/api/capsule/pressure/' + bleMac, {
            method: 'GET',
            headers: {"Content-Type": "application/json"},
        })
            .then(response => response.json())
            .then(response => {
                response.response.map(entry => {
                    entry.timestamp = moment(entry.timestamp).format('YYYY-MM-DD HH:mm:ss')
                })
                // console.log(response.response)
                this.setState({
                    pressureData: response.response
                })
            })
            .catch(err => console.error(err));
    };

    handleInputChange = (e) => {
        const type = e.target.dataset.type
        this.setState({
            [`threshold_${type}`]: e.target.value,
        })
    }

    handleThresholdChange = (e) => {
        const type = e.currentTarget.dataset.type
        this.putCapsuleThreshold(type, this.state[`threshold_${type}`])
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
            multiTestState,
            width = "col"
        } = this.props;

        const {
            pressureData,
            bleData,
            threshold_pressure_750,
            threshold_pressure_800,
            threshold_pressure_850,
        } = this.state;

        let dateTime = [];
        let allData = [];

        if (pressureData.length > 0) {
            pressureData.map(entry => {
                dateTime.push(entry.timestamp)
                if (typeof (entry.value) === 'number') allData.push(entry.value)
            })
        }

        if (bleData.length > 0) {
            bleData.map(entry => {
                dateTime.push(entry.timestamp)
                if (typeof (entry.pressure) === 'number') allData.push(entry.pressure)
            })
        }

        const chartDate = dateTime.sort()

        let chartT1Data = []
        let chartT2Data = []
        let chartT3Data = []
        let chartBData = []
        if (chartDate.length > 0) {
            if (pressureData.length > 0) {
                pressureData.map(entry => {
                    // console.log(entry)
                    if (entry.type == '750') chartT1Data.push([chartDate.indexOf(entry.timestamp), entry.value])
                    if (entry.type == '800') chartT2Data.push([chartDate.indexOf(entry.timestamp), entry.value])
                    if (entry.type == '850') chartT3Data.push([chartDate.indexOf(entry.timestamp), entry.value])
                })
            }
            if (bleData.length > 0) {
                bleData.map(entry => {
                    chartBData.push([chartDate.indexOf(entry.timestamp), entry.pressure])
                })
            }
        }

        // console.log(chartBData)
        console.log(chartDate)

        const option = {
            legend: {
                data: ['750', '800', '850', 'BLE']
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
                    name: "750",
                    type: "line",
                    itemStyle: {
                        color: "rgb(205, 30, 160)",
                    },
                    data: chartT1Data
                },
                {
                    name: "800",
                    type: "line",
                    itemStyle: {
                        color: "rgb(255, 70, 131)",
                    },
                    data: chartT2Data
                },
                {
                    name: "850",
                    type: "line",
                    itemStyle: {
                        color: "rgb(153, 170, 11)",
                    },
                    data: chartT3Data
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
                <div className={'flex flex-row'}>
                <span
                    className={'badge badge-' + getSeverity(rowData[type])}>{getState(rowData[type])}</span>
                    {rowData[type] === 2 &&
                        <span
                            className={'badge badge-' + getResult(test_res)}>{test_res}</span>
                    }
                </div>
            );
        }

        const columns = [
            {
                title: '標準',
                dataIndex: 'standard',
                key: 'standard',
            },
            {
                title: '門檻值',
                dataIndex: 'threshold',
                key: 'threshold',
            },
            {
                title: '測試結果',
                dataIndex: 'test_result',
                key: 'test_result',
            },
        ];

        const dataSource = [
            {
                key: '1',
                standard: '750',
                threshold: threshold_pressure_750,
                test_result: stateBodyTemplate(capsule, 'pressure_750'),
            },
            {
                key: '2',
                standard: '800',
                threshold: threshold_pressure_800,
                test_result: stateBodyTemplate(capsule, 'pressure_800'),
            },
            {
                key: '3',
                standard: '850',
                threshold: threshold_pressure_850,
                test_result: stateBodyTemplate(capsule, 'pressure_850'),
            },
        ];

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
                        {(multiTestState == 0) &&
                            <div>
                                <div className="input-group mb-3">
                                    <Space style={{width: '100%'}}>
                                        <Input addonBefore="測試門檻值750" value={threshold_pressure_750}
                                               onChange={this.handleInputChange} data-type="pressure_750"
                                               onPressEnter={this.handleThresholdChange}/>
                                        <Button type="default" data-type="pressure_750"
                                                onClick={this.handleThresholdChange}>送出</Button>
                                    </Space>
                                </div>
                                <div className="input-group mb-3">
                                    <Space style={{width: '100%'}}>
                                        <Input addonBefore="測試門檻值800" value={threshold_pressure_800}
                                               onChange={this.handleInputChange} data-type="pressure_800"
                                               onPressEnter={this.handleThresholdChange}/>
                                        <Button type="default" data-type="pressure_800"
                                                onClick={this.handleThresholdChange}>送出</Button>
                                    </Space>
                                </div>
                                <div className="input-group mb-3">
                                    <Space style={{width: '100%'}}>
                                        <Input addonBefore="測試門檻值850" value={threshold_pressure_850}
                                               onChange={this.handleInputChange} data-type="pressure_850"
                                               onPressEnter={this.handleThresholdChange}/>
                                        <Button type="default" data-type="pressure_850"
                                                onClick={this.handleThresholdChange}>送出</Button>
                                    </Space>
                                </div>
                            </div>
                        }

                        <div className="mb-3">
                            <Table size="small" dataSource={dataSource} columns={columns} pagination={false} />
                        </div>

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

export default connect(mapStateToProps, {})(CapsulePressureCard);