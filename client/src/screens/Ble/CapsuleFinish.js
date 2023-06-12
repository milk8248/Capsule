import React from "react";
import {connect} from "react-redux";
import PageHeader from "../../components/PageHeader";
import LargeScaleAreaChart from "../../components/Charts/LargeScaleAreaChart";
import BleTable from "../../components/Tables/BleTable";
import BleReceiverTable from "../../components/Tables/BleReceiverTable";
import ThermometerTable from "../../components/Tables/ThermometerTable";
import PressureTable from "../../components/Tables/PressureTable";
import SearchBLECard from "../../components/Dashboard/SearchBLECard";
import SecurityMainCard from "../../components/SecurityMainCard";
import TestStatusCard from "../../components/TestStatusCard";
import {Tabs, TabsProps} from 'antd';

import {
    onPressSearch,
    changeBleMac
} from "../../actions";
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
            // pressureState: 0,
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
            bleReceiverData: []
        };

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

    // onPressAir(bleMac, state) {
    //     if (state == 0) {
    //         if (window.confirm('確定要重新開始測試嗎?')) {
    //             this.putAirtightnessState(bleMac, state);
    //             this.getAirtightnessData(bleMac);
    //         }
    //     } else {
    //         this.putAirtightnessState(bleMac, state);
    //         this.getAirtightnessData(bleMac);
    //     }
    // }

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
                        pressure750State: response.response[0].pressure_750,
                        pressure800State: response.response[0].pressure_800,
                        pressure850State: response.response[0].pressure_850,
                        thermometerState: response.response[0].thermometer,
                        rfState: response.response[0].rf,
                        pressure750PcbaState: response.response[0].pressure_750_pcba,
                        pressure800PcbaState: response.response[0].pressure_800_pcba,
                        pressure850PcbaState: response.response[0].pressure_850_pcba,
                        thermometerPcbaState: response.response[0].thermometer_pcba,
                        rfPcbaState: response.response[0].rf_pcba,
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
                        Heading="氣密測試"
                        StartTime={this.state.airtightnessStartTime}
                        EndTime={this.state.airtightnessEndTime}
                        Value={airtightnessData}
                        ShowValue={true}
                        width="col-lg-3 col-md-3 col-md-12"
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
                    <SecurityMainCard
                        Heading="溫度測試"
                        StartTime={this.state.thermometerStartTime}
                        EndTime={this.state.thermometerEndTime}
                        width="col-lg-3 col-md-3 col-md-12"
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
                    />
                }
                {bleMac !== '' &&
                    <SecurityMainCard
                        Heading="氣壓750測試"
                        width="col-lg-3 col-md-3 col-md-12"
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
                    />
                }
                {bleMac !== '' &&
                    <SecurityMainCard
                        Heading="氣壓800測試"
                        width="col-lg-3 col-md-3 col-md-12"
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
                    />
                }
                {bleMac !== '' &&
                    <SecurityMainCard
                        Heading="氣壓850測試"
                        width="col-lg-3 col-md-3 col-md-12"
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
                    />
                }

                {bleMac !== '' &&
                    <SecurityMainCard
                        Heading="RF測試"
                        StartTime={this.state.rfStartTime}
                        EndTime={this.state.rfEndTime}
                        width="col-lg-3 col-md-3 col-md-12"
                        OnClick={() => {
                            if (this.state.rfState == 0) {
                                this.onPressState(this.state.bleMac,'rf', 1);
                            } else if (this.state.rfState == 1) {
                                this.onPressState(this.state.bleMac,'rf', 2);
                            } else {
                                this.onPressState(this.state.bleMac,'rf', 0);
                            }
                        }}
                        Toggle={this.state.rfState}
                    />
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
                        pressureData={pressureData}/>
                }
                {bleMac !== '' &&
                    <RfTable
                        width="col-md-5"
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
