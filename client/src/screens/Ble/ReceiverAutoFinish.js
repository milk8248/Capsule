import React from "react";
import {connect} from "react-redux";
import LargeScaleAreaChart from "../../components/Charts/LargeScaleAreaChart";
import BleTable from "../../components/Tables/BleTable";
import ThermometerTable from "../../components/Tables/ThermometerTable";
import PressureTable from "../../components/Tables/PressureTable";
import SecurityMainCard from "../../components/SecurityMainCard";
import moment from "moment";
import RfTable from "../../components/Tables/RfTable";
import ReceiverAutoTable from "../../components/Tables/ReceiverAutoTable";

class ReceiverAutoFinish extends React.Component {

    constructor(props) {
        super(props);
        const {bleMac} = props
        this.state = {
            bleMac: bleMac,
            pressureData: [],
            isBleDataFetch: false,
            pressure750State: 0,
            pressure800State: 0,
            pressure850State: 0,
            pressureStartTime: '',
            pressureEndTime: '',
            bleData: [],
            bleReceiverData: [],
            threshold_pressure_750: 0,
            threshold_pressure_800: 0,
            threshold_pressure_850: 0,
            test_pressure_750: false,
            test_pressure_800: false,
            test_pressure_850: false,
        };

        this.getCapsuleThreshold(bleMac);

        setInterval(() => {
            this.getCapsuleInfo(bleMac);
            this.getBleData(bleMac);
            this.getBleReceiverData(bleMac);
            this.getPressureData(bleMac);
        }, 1000);

    }

    onPressState(bleMac, type, state) {
        if (state == 0) {
            if (window.confirm('確定要重新開始測試嗎?')) {
                this.putState(bleMac, type, state);
            }
        } else {
            this.putState(bleMac, type, state);
        }
    }

    handleMacChange(text) {
        this.setState({
            bleMac: text
        })
        this.getBleData(text);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    getPressureData = (bleMac) => {
        fetch('/api/receiver_auto/pressure/' + bleMac, {
            method: 'GET',
            headers: {"Content-Type": "application/json"},
        })
            .then(response => response.json())
            .then(response => {
                response.response.map(entry => {
                    entry.timestamp = moment(entry.timestamp).format('YYYY-MM-DD HH:mm:ss')
                })
                this.setState({
                    pressureData: response.response,
                })
            })
            .catch(err => console.error(err));
    };

    getCapsuleInfo = (bleMac) => {
        fetch('/api/receiver_auto/' + bleMac, {
            method: 'GET',
            headers: {"Content-Type": "application/json"},
        })
            .then(response => response.json())
            .then(response => {
                if (response.response.length > 0) {
                    this.setState({
                        pressure750State: response.response[0].pressure_750,
                        pressure800State: response.response[0].pressure_800,
                        pressure850State: response.response[0].pressure_850,
                        test_pressure_750: ((response.response[0].test_pressure_750 == 0) ? "fail" : ((response.response[0].test_pressure_750 == 1) ? "pass" : "資料不足")),
                        test_pressure_800: ((response.response[0].test_pressure_800 == 0) ? "fail" : ((response.response[0].test_pressure_800 == 1) ? "pass" : "資料不足")),
                        test_pressure_850: ((response.response[0].test_pressure_850 == 0) ? "fail" : ((response.response[0].test_pressure_850 == 1) ? "pass" : "資料不足")),
                    })
                }
            })
            .catch(err => console.error(err));
    };

    getCapsuleThreshold = (bleMac) => {
        fetch('/api/receiver_auto/' + bleMac, {
            method: 'GET',
            headers: {"Content-Type": "application/json"},
        })
            .then(response => response.json())
            .then(response => {
                if (response.response.length > 0) {
                    this.setState({
                        threshold_pressure_750: response.response[0].threshold_pressure_750,
                        threshold_pressure_800: response.response[0].threshold_pressure_800,
                        threshold_pressure_850: response.response[0].threshold_pressure_850,
                    })
                }
            })
            .catch(err => console.error(err));
    };

    getBleData = (bleMac) => {
        fetch('/api/receiver_auto_data/' + bleMac, {
            method: 'GET',
            headers: {"Content-Type": "application/json"},
        })
            .then(response => response.json())
            .then(response => {
                response.response.map(entry => {
                    entry.timestamp = moment(entry.timestamp).format('YYYY-MM-DD HH:mm:ss')
                })
                this.setState({
                    bleData: response.response,
                    isBleDataFetch: true,
                })
            })
            .catch(err => console.error(err));
    };

    getBleReceiverData = (bleMac) => {
        fetch('/api/ble_receiver_data/' + bleMac, {
            method: 'GET',
            headers: {"Content-Type": "application/json"},
        })
            .then(response => response.json())
            .then(response => {
                response.response.map(entry => {
                    entry.timestamp = moment(entry.timestamp).format('YYYY-MM-DD HH:mm:ss')
                })
                this.setState({
                    bleReceiverData: response.response,
                })
            })
            .catch(err => console.error(err));
    };

    putState = (bleMac, type, state) => {
        var urlencoded = new URLSearchParams();
        urlencoded.append("mac", bleMac);
        urlencoded.append("state", state);

        fetch('/api/receiver_auto_state/' + type, {
            method: 'PUT',
            body: urlencoded
        })
            .then(response => response.json())
            .then(response => {
                if (response.code == 200) {
                    if (response.response.length > 0) {
                        switch (response.response[0].type) {
                            case 'pressure_750':
                                this.setState({
                                    pressure750State: state
                                })
                                break;
                            case 'pressure_800':
                                this.setState({
                                    pressure800State: state
                                })
                                break;
                            case 'pressure_850':
                                this.setState({
                                    pressure850State: state
                                })
                                break;
                        }
                    }
                }
            })
            .catch(err => console.error(err));
    };

    handleInputChange = (type, e) => {
        switch (type) {
            case "pressure_750":
                this.setState({
                    threshold_pressure_750: e.target.value,
                })
                break
            case "pressure_800":
                this.setState({
                    threshold_pressure_800: e.target.value,
                })
                break
            case "pressure_850":
                this.setState({
                    threshold_pressure_850: e.target.value,
                })
                break
            default:
                break
        }
    }

    handleThresholdChange = (type) => {
        switch (type) {
            case "pressure_750":
                this.putCapsuleThreshold(type, this.state.threshold_pressure_750)
                break
            case "pressure_800":
                this.putCapsuleThreshold(type, this.state.threshold_pressure_800)
                break
            case "pressure_850":
                this.putCapsuleThreshold(type, this.state.threshold_pressure_850)
                break
            default:
                break
        }
    }

    putCapsuleThreshold = (type, value) => {
        var urlencoded = new URLSearchParams();
        urlencoded.append("type", type);
        urlencoded.append("value", value);
        urlencoded.append("mac", this.state.bleMac);
        fetch('/api/receiver_auto/threshold', {
            method: 'PUT',
            body: urlencoded
        })
            .then(response => response.json())
            .then(response => {
                if (response.code == 200) {
                    alert('更新成功!')
                    this.getCapsuleThreshold(this.state.bleMac);

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
            bleMac,
            pressureData,
            isBleDataFetch,
            bleData, bleReceiverData
        } = this.state;

        return (
            <div className="row clearfix">


                {bleMac !== '' &&
                    <SecurityMainCard
                        Heading="氣壓750測試"
                        width="col-lg-4 col-md-3 col-md-12"
                        OnClick={() => {
                            if (this.state.pressure750State == 0) {
                                this.onPressState(this.state.bleMac, 'pressure_750', 1);
                            } else if (this.state.pressure750State == 1) {
                                this.onPressState(this.state.bleMac, 'pressure_750', 2);
                            } else {
                                this.onPressState(this.state.bleMac, 'pressure_750', 0);
                            }
                        }}
                        Toggle={this.state.pressure750State}
                        ShowInput={true}
                        Threshold={this.state.threshold_pressure_750}
                        Value={this.state.test_pressure_750}
                        ShowValue={true}
                        handleInputChange={(text) => {
                            this.handleInputChange("pressure_750", text);
                        }}
                        handleThresholdChange={() => {
                            this.handleThresholdChange("pressure_750");
                        }}
                    />
                }
                {bleMac !== '' &&
                    <SecurityMainCard
                        Heading="氣壓800測試"
                        width="col-lg-4 col-md-3 col-md-12"
                        OnClick={() => {
                            if (this.state.pressure800State == 0) {
                                this.onPressState(this.state.bleMac, 'pressure_800', 1);
                            } else if (this.state.pressure800State == 1) {
                                this.onPressState(this.state.bleMac, 'pressure_800', 2);
                            } else {
                                this.onPressState(this.state.bleMac, 'pressure_800', 0);
                            }
                        }}
                        Toggle={this.state.pressure800State}
                        ShowInput={true}
                        Threshold={this.state.threshold_pressure_800}
                        Value={this.state.test_pressure_800}
                        ShowValue={true}
                        handleInputChange={(text) => {
                            this.handleInputChange("pressure_800", text);
                        }}
                        handleThresholdChange={() => {
                            this.handleThresholdChange("pressure_800");
                        }}
                    />
                }
                {bleMac !== '' &&
                    <SecurityMainCard
                        Heading="氣壓850測試"
                        width="col-lg-4 col-md-3 col-md-12"
                        OnClick={() => {
                            if (this.state.pressure850State == 0) {
                                this.onPressState(this.state.bleMac, 'pressure_850', 1);
                            } else if (this.state.pressure850State == 1) {
                                this.onPressState(this.state.bleMac, 'pressure_850', 2);
                            } else {
                                this.onPressState(this.state.bleMac, 'pressure_850', 0);
                            }
                        }}
                        Toggle={this.state.pressure850State}
                        ShowInput={true}
                        Threshold={this.state.threshold_pressure_850}
                        Value={this.state.test_pressure_850}
                        ShowValue={true}
                        handleInputChange={(text) => {
                            this.handleInputChange("pressure_850", text);
                        }}
                        handleThresholdChange={() => {
                            this.handleThresholdChange("pressure_850");
                        }}
                    />
                }
                {bleMac !== '' &&
                    <PressureTable
                        width="col-md-6"
                        pressureData={pressureData}/>
                }
                {bleMac !== '' &&
                    <ReceiverAutoTable
                        width="col-md-6"
                        bleData={bleData}/>
                }

            </div>
        );
    }
}

const mapStateToProps = ({}) => ({});

export default connect(mapStateToProps, {})(ReceiverAutoFinish);
