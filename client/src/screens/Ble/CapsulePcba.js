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
            bleData: [],
            bleReceiverData: []
        };

        this.getCapsuleInfo(bleMac);
        // this.getBleData(bleMac);
        // this.getBleReceiverData(bleMac);
        this.getThermometerPcbaData(bleMac);

    }

    onPressThermometerPcba(bleMac, state) {
        if (state == 0) {
            if (window.confirm('確定要重新開始測試嗎?')) {
                this.putThermometerPcbaState(bleMac, state);
            }
        } else {
            this.putThermometerPcbaState(bleMac, state);
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

    getCapsuleInfo = (bleMac) => {
        fetch('/api/capsule/' + bleMac, {
            method: 'GET',
            headers: {"Content-Type": "application/json"},
        })
            .then(response => response.json())
            .then(response => {
                if (response.response.length > 0) {
                    this.setState({
                        thermometerPcbaState: response.response[0].thermometer_pcba_state,
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

    putThermometerPcbaState = (bleMac, state) => {
        var urlencoded = new URLSearchParams();
        urlencoded.append("mac", bleMac);
        urlencoded.append("state", state);

        fetch('/api/capsule/thermometer_pcba', {
            method: 'PUT',
            body: urlencoded
        })
            .then(response => response.json())
            .then(response => {
                if (response.code == 200) {
                    this.setState({
                        thermometerPcbaState: state,
                    })
                }
            })
            .catch(err => console.error(err));
    };

    render() {

        const {
            bleMac,
            isThermoDataFetch,
            thermoData,
            isBleDataFetch,
            bleData, bleReceiverData
        } = this.state;

        return (
            <div className="row clearfix">

                {bleMac !== '' &&
                    <SecurityMainCard
                        Heading="PCBA 溫度測試"
                        StartTime={this.state.thermometerPcbaStartTime}
                        EndTime={this.state.thermometerPcbaEndTime}
                        OnClick={() => {
                            if (this.state.thermometerPcbaState == 0) {
                                this.onPressThermometerPcba(this.state.bleMac, 1);
                            } else if (this.state.thermometerPcbaState == 1) {
                                this.onPressThermometerPcba(this.state.bleMac, 2);
                            } else {
                                this.onPressThermometerPcba(this.state.bleMac, 0);
                            }
                        }}
                        Toggle={this.state.thermometerPcbaState}/>
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
