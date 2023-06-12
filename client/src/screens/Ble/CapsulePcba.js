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
import BlePcbaTable from "../../components/Tables/BlePcbaTable";
import RfTable from "../../components/Tables/RfTable";

class CapsulePcba extends React.Component {

    constructor(props) {
        super(props);
        const {bleMac} = props
        this.state = {
            bleMac: bleMac,
            thermoPcbaData: [],
            isBleDataFetch: false,
            thermometerPcbaState: 0,
            thermometerPcbaStartTime: '',
            thermometerPcbaEndTime: '',
            pressurePcbaData: [],
            pressure750PcbaState: 0,
            pressure800PcbaState: 0,
            pressure850PcbaState: 0,
            pressurePcbaStartTime: '',
            pressurePcbaEndTime: '',
            rfPcbaData: [],
            rfPcbaState: 0,
            rfPcbaStartTime: '',
            rfPcbaEndTime: '',
            bleData: [],
            bleReceiverData: []
        };

        // this.getCapsuleInfo(bleMac);

        setInterval( () => {
            this.getCapsuleInfo(bleMac);
            this.getThermometerPcbaData(bleMac);
            this.getPressurePcbaData(bleMac);
            this.getRfPcbaData(bleMac);
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


    componentDidMount() {
        window.scrollTo(0, 0);
    }

    getThermometerPcbaData = (bleMac) => {
        fetch('/api/capsule/thermometer_pcba/' + bleMac, {
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

    getPressurePcbaData = (bleMac) => {
        fetch('/api/capsule/pressure_pcba/' + bleMac, {
            method: 'GET',
            headers: {"Content-Type": "application/json"},
        })
            .then(response => response.json())
            .then(response => {
                response.response.map(entry => {
                    entry.timestamp = moment(entry.timestamp).format('YYYY-MM-DD HH:mm:ss')
                })
                this.setState({
                    pressureData: response.response
                })
            })
            .catch(err => console.error(err));
    };

    getRfPcbaData = (bleMac) => {
        fetch('/api/capsule/rf_pcba/' + bleMac, {
            method: 'GET',
            headers: {"Content-Type": "application/json"},
        })
            .then(response => response.json())
            .then(response => {
                response.response.map(entry => {
                    entry.timestamp = moment(entry.timestamp).format('YYYY-MM-DD HH:mm:ss')
                })
                this.setState({
                    rfData: response.response
                })
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
                    if(response.response.length>0) {
                        switch (response.response[0].type) {
                            case 'thermometer_pcba':
                                this.setState({
                                    thermometerPcbaState: state
                                })
                                break;
                            case 'rf_pcba':
                                this.setState({
                                    rfPcbaState: state
                                })
                                break;
                            case 'pressure_750_pcba':
                                this.setState({
                                    pressure750PcbaState: state
                                })
                                break;
                            case 'pressure_800_pcba':
                                this.setState({
                                    pressure800PcbaState: state
                                })
                                break;
                            case 'pressure_850_pcba':
                                this.setState({
                                    pressure850PcbaState: state
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
            thermoData,
            pressureData,
            rfData,
            isBleDataFetch,
            bleData, bleReceiverData
        } = this.state;

        return (
            <div className="row clearfix">

                {bleMac !== '' &&
                    <SecurityMainCard
                        Heading="PCBA氣壓750測試"
                        OnClick={() => {
                            if (this.state.pressure750PcbaState == 0) {
                                this.onPressState(this.state.bleMac, 'pressure_750_pcba', 1);
                            } else if (this.state.pressure750PcbaState == 1) {
                                this.onPressState(this.state.bleMac, 'pressure_750_pcba', 2);
                            } else {
                                this.onPressState(this.state.bleMac, 'pressure_750_pcba', 0);
                            }
                        }}
                        Toggle={this.state.pressure750PcbaState}/>
                }
                {bleMac !== '' &&
                    <SecurityMainCard
                        Heading="PCBA氣壓800測試"
                        OnClick={() => {
                            if (this.state.pressure800PcbaState == 0) {
                                this.onPressState(this.state.bleMac, 'pressure_800_pcba', 1);
                            } else if (this.state.pressure800PcbaState == 1) {
                                this.onPressState(this.state.bleMac, 'pressure_800_pcba', 2);
                            } else {
                                this.onPressState(this.state.bleMac, 'pressure_800_pcba', 0);
                            }
                        }}
                        Toggle={this.state.pressure800PcbaState}/>
                }
                {bleMac !== '' &&
                    <SecurityMainCard
                        Heading="PCBA氣壓850測試"
                        OnClick={() => {
                            if (this.state.pressure850PcbaState == 0) {
                                this.onPressState(this.state.bleMac, 'pressure_850_pcba', 1);
                            } else if (this.state.pressure850PcbaState == 1) {
                                this.onPressState(this.state.bleMac, 'pressure_850_pcba', 2);
                            } else {
                                this.onPressState(this.state.bleMac, 'pressure_850_pcba', 0);
                            }
                        }}
                        Toggle={this.state.pressure850PcbaState}/>
                }
                {bleMac !== '' &&
                    <SecurityMainCard
                        Heading="PCBA 溫度測試"
                        OnClick={() => {
                            if (this.state.thermometerPcbaState == 0) {
                                this.onPressState(this.state.bleMac, 'thermometer_pcba', 1);
                            } else if (this.state.thermometerPcbaState == 1) {
                                this.onPressState(this.state.bleMac, 'thermometer_pcba', 2);
                            } else {
                                this.onPressState(this.state.bleMac, 'thermometer_pcba', 0);
                            }
                        }}
                        Toggle={this.state.thermometerPcbaState}/>
                }
                {bleMac !== '' &&
                    <SecurityMainCard
                        Heading="PCBA RF測試"
                        OnClick={() => {
                            if (this.state.rfPcbaState == 0) {
                                this.onPressState(this.state.bleMac, 'rf_pcba', 1);
                            } else if (this.state.rfPcbaState == 1) {
                                this.onPressState(this.state.bleMac, 'rf_pcba', 2);
                            } else {
                                this.onPressState(this.state.bleMac, 'rf_pcba', 0);
                            }
                        }}
                        Toggle={this.state.rfPcbaState}/>
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
                        width="col-md-6"
                        thermoData={thermoData}/>
                }
                {bleMac !== '' &&
                    <PressureTable
                        width="col-md-6"
                        pressureData={pressureData}/>
                }
                {bleMac !== '' &&
                    <RfTable
                        width="col-md-6"
                        rfData={rfData}/>
                }
                {bleMac !== '' &&
                    <BlePcbaTable
                        width="col-md-6"
                        bleData={bleData}/>
                }

            </div>
        );
    }
}

const mapStateToProps = ({}) => ({});

export default connect(mapStateToProps, {})(CapsulePcba);
