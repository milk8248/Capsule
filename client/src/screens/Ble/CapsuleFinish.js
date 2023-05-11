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

class Capsule extends React.Component {

    constructor(props) {
        super(props);
        const {bleMac} = props
        this.state = {
            bleMac: bleMac,
            thermoData: [],
            pressureData: [],
            airtightnessData: 'Null',
            isBleDataFetch: false,
            airtightnessState: 0,
            thermometerState: 0,
            pressureState: 0,
            airtightnessStartTime: '',
            airtightnessEndTime: '',
            thermometerStartTime: '',
            thermometerEndTime: '',
            pressureStartTime: '',
            pressureEndTime: '',
            bleData: [],
            bleReceiverData: []
        };

        this.getCapsuleInfo(bleMac);
        this.getBleData(bleMac);
        this.getBleReceiverData(bleMac);
        this.getThermometerData(bleMac);
        this.getPressureData(bleMac);
        this.getAirtightnessData(bleMac);
        
    }

    onPressAir(bleMac, state) {
        if (state == 0) {
            if (window.confirm('確定要重新開始測試嗎?')) {
                this.putAirtightnessState(bleMac, state);
                this.getAirtightnessData(bleMac);
            }
        } else {
            this.putAirtightnessState(bleMac, state);
            this.getAirtightnessData(bleMac);
        }
    }

    onPressThermometer(bleMac, state) {
        if (state == 0) {
            if (window.confirm('確定要重新開始測試嗎?')) {
                this.putThermometerState(bleMac, state);
            }
        } else {
            this.putThermometerState(bleMac, state);
        }
    }

    onPressPressure(bleMac, state) {
        if (state == 0) {
            if (window.confirm('確定要重新開始測試嗎?')) {
                this.putPressureState(bleMac, state);
            }
        } else {
            this.putPressureState(bleMac, state);
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
        fetch('/api/receiver/pressure/' + bleMac, {
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

    getCapsuleInfo = (bleMac) => {
        fetch('/api/capsule/' + bleMac, {
            method: 'GET',
            headers: {"Content-Type": "application/json"},
        })
            .then(response => response.json())
            .then(response => {
                if (response.response.length > 0) {
                    this.setState({
                        airtightnessState: response.response[0].airtightness_state,
                        thermometerState: response.response[0].thermometer_state,
                        pressureState: response.response[0].pressure_state,
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

    putAirtightnessState = (bleMac, state) => {
        var urlencoded = new URLSearchParams();
        // console.log(bleMac)
        urlencoded.append("mac", bleMac);
        urlencoded.append("state", state);

        fetch('/api/capsule/airtightness', {
            method: 'PUT',
            body: urlencoded
        })
            .then(response => response.json())
            .then(response => {
                if (response.code == 200) {
                    this.setState({
                        airtightnessState: state
                    })
                }
            })
            .catch(err => console.error(err));
    };

    putThermometerState = (bleMac, state) => {
        var urlencoded = new URLSearchParams();
        urlencoded.append("mac", bleMac);
        urlencoded.append("state", state);

        fetch('/api/capsule/thermometer', {
            method: 'PUT',
            body: urlencoded
        })
            .then(response => response.json())
            .then(response => {
                if (response.code == 200) {
                    this.setState({
                        thermometerState: state,
                    })
                }
            })
            .catch(err => console.error(err));
    };

    putPressureState = (bleMac, state) => {
        var urlencoded = new URLSearchParams();
        // console.log(bleMac)
        urlencoded.append("mac", bleMac);
        urlencoded.append("state", state);

        fetch('/api/capsule/pressure', {
            method: 'PUT',
            body: urlencoded
        })
            .then(response => response.json())
            .then(response => {
                if (response.code == 200) {
                    this.setState({
                        pressureState: state,
                    })
                }
            })
            .catch(err => console.error(err));
    };


    render() {

        const {
            bleMac,
            isThermoDataFetch,
            thermoData, pressureData,
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
                        OnClick={() => {
                            if (this.state.airtightnessState == 0) {
                                this.onPressAir(this.state.bleMac, 1);
                            } else if (this.state.airtightnessState == 1) {
                                this.onPressAir(this.state.bleMac, 2);
                            } else {
                                this.onPressAir(this.state.bleMac, 0);
                            }
                        }}
                        Toggle={this.state.airtightnessState}/>
                }
                {bleMac !== '' &&
                    <SecurityMainCard
                        Heading="溫度測試"
                        StartTime={this.state.thermometerStartTime}
                        EndTime={this.state.thermometerEndTime}
                        OnClick={() => {
                            if (this.state.thermometerState == 0) {
                                this.onPressThermometer(this.state.bleMac, 1);
                            } else if (this.state.thermometerState == 1) {
                                this.onPressThermometer(this.state.bleMac, 2);
                            } else {
                                this.onPressThermometer(this.state.bleMac, 0);
                            }
                        }}
                        Toggle={this.state.thermometerState}/>
                }
                {bleMac !== '' &&
                    <SecurityMainCard
                        Heading="氣壓測試"
                        StartTime={this.state.pressureStartTime}
                        EndTime={this.state.pressureEndTime}
                        OnClick={() => {
                            if (this.state.pressureState == 0) {
                                this.onPressPressure(this.state.bleMac, 1);
                            } else if (this.state.pressureState == 1) {
                                this.onPressPressure(this.state.bleMac, 2);
                            } else {
                                this.onPressPressure(this.state.bleMac, 0);
                            }
                        }}
                        Toggle={this.state.pressureState}
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
                    <BleTable
                        bleData={bleData}/>
                }

            </div>
        );
    }
}

const mapStateToProps = ({}) => ({});

export default connect(mapStateToProps, {})(Capsule);
