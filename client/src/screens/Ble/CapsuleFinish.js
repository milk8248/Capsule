import React from "react";
import {connect} from "react-redux";
import LargeScaleAreaChart from "../../components/Charts/LargeScaleAreaChart";
import BleTable from "../../components/Tables/BleTable";
import ThermometerTable from "../../components/Tables/ThermometerTable";
import PressureTable from "../../components/Tables/PressureTable";
import SecurityMainCard from "../../components/SecurityMainCard";
import moment from "moment";
import RfTable from "../../components/Tables/RfTable";

class Capsule extends React.Component {

    constructor(props) {
        super(props);
        const {bleMac} = props
        this.state = {
            bleMac: bleMac,
            thermoData: [],
            pressureData: [],
            rfData: [],
            airtightnessData: 'Null',
            isBleDataFetch: false,
            airtightnessState: 0,
            thermometerState: 0,
            pressure750State: 0,
            pressure800State: 0,
            pressure850State: 0,
            rfState: 0,
            airtightnessStartTime: '',
            airtightnessEndTime: '',
            thermometerStartTime: '',
            thermometerEndTime: '',
            pressureStartTime: '',
            pressureEndTime: '',
            rfStartTime: '',
            rfEndTime: '',
            bleData: [],
            bleReceiverData: [],
            threshold_pressure_750: 0,
            threshold_pressure_800: 0,
            threshold_pressure_850: 0,
            threshold_pressure_750_pcba: 0,
            threshold_pressure_800_pcba: 0,
            threshold_pressure_850_pcba: 0,
            threshold_thermometer: 0,
            threshold_thermometer_pcba: 0,
            threshold_rf: 0,
            threshold_rf_pcba: 0,
            test_pressure_750: false,
            test_pressure_800: false,
            test_pressure_850: false,
            test_pressure_750_pcba: false,
            test_pressure_800_pcba: false,
            test_pressure_850_pcba: false,
            test_thermometer: false,
            test_thermometer_pcba: false,
            test_rf: false,
            test_rf_pcba: false
        };

        this.getCapsuleThreshold(bleMac);

        setInterval(() => {
            this.getCapsuleInfo(bleMac);
            this.getBleData(bleMac);
            this.getBleReceiverData(bleMac);
            this.getThermometerData(bleMac);
            this.getPressureData(bleMac);
            this.getAirtightnessData(bleMac);
            this.getRfData(bleMac);
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
        this.getThermometerData(text);
        this.getBleData(text);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

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
                this.setState({
                    pressureData: response.response,
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

    getAirtightnessData = (bleMac) => {
        fetch('/api/capsule/airtightness/' + bleMac, {
            method: 'GET',
            headers: {"Content-Type": "application/json"},
        })
            .then(response => response.json())
            .then(response => {
                response.response.map(entry => {
                    entry.timestamp = moment(entry.timestamp).format('YYYY-MM-DD HH:mm:ss')
                })
                if (response.response.length > 0) {
                    this.setState({
                        airtightnessData: response.response[response.response.length - 1].value,
                    })
                }

            })
            .catch(err => console.error(err));
    };

    getRfData = (bleMac) => {
        fetch('/api/capsule/rf/' + bleMac, {
            method: 'GET',
            headers: {"Content-Type": "application/json"},
        })
            .then(response => response.json())
            .then(response => {
                response.response.map(entry => {
                    entry.timestamp = moment(entry.timestamp).format('YYYY-MM-DD HH:mm:ss')
                })
                if (response.response.length > 0) {
                    this.setState({
                        rfData: response.response,
                    })
                }

            })
            .catch(err => console.error(err));
    };

    getCapsuleInfo = (bleMac) => {
        fetch('/api/capsule/' + bleMac, {
            method: 'GET',
            headers: {"Content-Type": "application/json"},
        })
            .then(response => response.json())
            .then(response => {
                if (response.response.length > 0) {
                    this.setState({
                        airtightnessState: response.response[0].airtightness,
                        rfState: response.response[0].rf,
                        rfPcbaState: response.response[0].rf_pcba,
                        pressure750State: response.response[0].pressure_750,
                        pressure800State: response.response[0].pressure_800,
                        pressure850State: response.response[0].pressure_850,
                        thermometerState: response.response[0].thermometer,
                        pressure750PcbaState: response.response[0].pressure_750_pcba,
                        pressure800PcbaState: response.response[0].pressure_800_pcba,
                        pressure850PcbaState: response.response[0].pressure_850_pcba,
                        thermometerPcbaState: response.response[0].thermometer_pcba,
                        test_pressure_750: ((response.response[0].test_pressure_750) ? "pass" : "fail"),
                        test_pressure_800: ((response.response[0].test_pressure_800) ? "pass" : "fail"),
                        test_pressure_850: ((response.response[0].test_pressure_850) ? "pass" : "fail"),
                        test_pressure_750_pcba: ((response.response[0].test_pressure_750_pcba) ? "pass" : "fail"),
                        test_pressure_800_pcba: ((response.response[0].test_pressure_800_pcba) ? "pass" : "fail"),
                        test_pressure_850_pcba: ((response.response[0].test_pressure_850_pcba) ? "pass" : "fail"),
                        test_thermometer: ((response.response[0].test_thermometer) ? "pass" : "fail"),
                        test_thermometer_pcba: ((response.response[0].test_thermometer_pcba) ? "pass" : "fail"),
                        test_rf: ((response.response[0].test_rf) ? "pass" : "fail"),
                        test_rf_pcba: ((response.response[0].test_rf_pcba) ? "pass" : "fail"),
                    })
                }
            })
            .catch(err => console.error(err));
    };

    getCapsuleThreshold = (bleMac) => {
        fetch('/api/capsule/' + bleMac, {
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
                        threshold_pressure_750_pcba: response.response[0].threshold_pressure_750_pcba,
                        threshold_pressure_800_pcba: response.response[0].threshold_pressure_800_pcba,
                        threshold_pressure_850_pcba: response.response[0].threshold_pressure_850_pcba,
                        threshold_thermometer: response.response[0].threshold_thermometer,
                        threshold_thermometer_pcba: response.response[0].threshold_thermometer_pcba,
                        threshold_rf: response.response[0].threshold_rf,
                        threshold_rf_pcba: response.response[0].threshold_rf_pcba
                    })
                }
            })
            .catch(err => console.error(err));
    };

    getBleData = (bleMac) => {
        fetch('/api/ble_data/' + bleMac, {
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

        fetch('/api/state/' + type, {
            method: 'PUT',
            body: urlencoded
        })
            .then(response => response.json())
            .then(response => {
                if (response.code == 200) {
                    if (response.response.length > 0) {
                        switch (response.response[0].type) {
                            case 'thermometer':
                                this.setState({
                                    thermometerState: state
                                })
                                break;
                            case 'rf':
                                this.setState({
                                    rfState: state
                                })
                                break;
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
            case "pressure_750_pcba":
                this.setState({
                    threshold_pressure_750_pcba: e.target.value,
                })
                break
            case "pressure_800_pcba":
                this.setState({
                    threshold_pressure_800_pcba: e.target.value,
                })
                break
            case "pressure_850_pcba":
                this.setState({
                    threshold_pressure_850_pcba: e.target.value,
                })
                break
            case "thermometer":
                this.setState({
                    threshold_thermometer: e.target.value,
                })
                break
            case "thermometer_pcba":
                this.setState({
                    threshold_thermometer_pcba: e.target.value,
                })
                break
            case "rf":
                this.setState({
                    threshold_rf: e.target.value,
                })
                break
            case "rf_pcba":
                this.setState({
                    threshold_rf_pcba: e.target.value,
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
            case "pressure_750_pcba":
                this.putCapsuleThreshold(type, this.state.threshold_pressure_750_pcba)
                break
            case "pressure_800_pcba":
                this.putCapsuleThreshold(type, this.state.threshold_pressure_800_pcba)
                break
            case "pressure_850_pcba":
                this.putCapsuleThreshold(type, this.state.threshold_pressure_850_pcba)
                break
            case "thermometer":
                this.putCapsuleThreshold(type, this.state.threshold_thermometer)
                break
            case "thermometer_pcba":
                this.putCapsuleThreshold(type, this.state.threshold_thermometer_pcba)
                break
            case "rf":
                this.putCapsuleThreshold(type, this.state.threshold_rf)
                break
            case "rf_pcba":
                this.putCapsuleThreshold(type, this.state.threshold_rf_pcba)
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
        fetch('/api/capsule/threshold', {
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
            isThermoDataFetch,
            thermoData, pressureData, rfData,
            isBleDataFetch,
            airtightnessData,
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
                    <SecurityMainCard
                        Heading="溫度測試"
                        StartTime={this.state.thermometerStartTime}
                        EndTime={this.state.thermometerEndTime}
                        width="col-lg-4 col-md-3 col-md-12"
                        OnClick={() => {
                            if (this.state.thermometerState == 0) {
                                this.onPressState(this.state.bleMac, 'thermometer', 1);
                            } else if (this.state.thermometerState == 1) {
                                this.onPressState(this.state.bleMac, 'thermometer', 2);
                            } else {
                                this.onPressState(this.state.bleMac, 'thermometer', 0);
                            }
                        }}
                        Toggle={this.state.thermometerState}
                        ShowInput={true}
                        Threshold={this.state.threshold_thermometer}
                        Value={this.state.test_thermometer}
                        ShowValue={true}
                        handleInputChange={(text) => {
                            this.handleInputChange("thermometer", text);
                        }}
                        handleThresholdChange={() => {
                            this.handleThresholdChange("thermometer");
                        }}
                    />
                }
                {bleMac !== '' &&
                    <SecurityMainCard
                        Heading="RF測試"
                        StartTime={this.state.rfStartTime}
                        EndTime={this.state.rfEndTime}
                        width="col-lg-4 col-md-3 col-md-12"
                        OnClick={() => {
                            if (this.state.rfState == 0) {
                                this.onPressState(this.state.bleMac, 'rf', 1);
                            } else if (this.state.rfState == 1) {
                                this.onPressState(this.state.bleMac, 'rf', 2);
                            } else {
                                this.onPressState(this.state.bleMac, 'rf', 0);
                            }
                        }}
                        Toggle={this.state.rfState}
                        ShowInput={true}
                        Threshold={this.state.threshold_rf}
                        Value={this.state.test_rf}
                        ShowValue={true}
                        handleInputChange={(text) => {
                            this.handleInputChange("rf", text);
                        }}
                        handleThresholdChange={() => {
                            this.handleThresholdChange("rf");
                        }}
                    />
                }

                {bleMac !== '' &&
                    <SecurityMainCard
                        Heading="氣密測試"
                        StartTime={this.state.airtightnessStartTime}
                        EndTime={this.state.airtightnessEndTime}
                        Value={airtightnessData}
                        ShowValue={true}
                        width="col-lg-4 col-md-3 col-md-12"
                        OnClick={() => {
                            if (this.state.airtightnessState == 0) {
                                this.onPressState(this.state.bleMac, 'airtightness', 1);
                            } else if (this.state.airtightnessState == 1) {
                                this.onPressState(this.state.bleMac, 'airtightness', 2);
                            } else {
                                this.onPressState(this.state.bleMac, 'airtightness', 0);
                            }
                        }}
                        Toggle={this.state.airtightnessState}/>
                }


                {bleMac !== '' &&
                    <LargeScaleAreaChart
                        isThermoDataFetch={isThermoDataFetch}
                        thermoData={thermoData}
                        isBleDataFetch={isBleDataFetch}
                        bleData={bleData}/>
                }
                {bleMac !== '' &&
                    <ThermometerTable
                        thermoData={thermoData}/>
                }
                {bleMac !== '' &&
                    <PressureTable
                        width="col-md-4"
                        pressureData={pressureData}/>
                }
                {bleMac !== '' &&
                    <RfTable
                        width="col-md-4"
                        rfData={rfData}/>
                }
                {bleMac !== '' &&
                    <BleTable
                        bleData={bleData}/>
                }

            </div>
        );
    }
}

const mapStateToProps = ({}) => ({});

export default connect(mapStateToProps, {})(Capsule);
