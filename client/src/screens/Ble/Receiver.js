import React from "react";
import {connect} from "react-redux";
import PageHeader from "../../components/PageHeader";
import LargeScaleAreaChart from "../../components/Charts/LargeScaleAreaChart";
import BleTable from "../../components/Tables/BleTable";
import BleReceiverTable from "../../components/Tables/BleReceiverTable";
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
import CapsulePcba from "./CapsulePcba";
import CapsuleFinish from "./CapsuleFinish";
import ReceiverPressureTable from "../../components/Tables/ReceiverPressureTable";
import Form from "react-bootstrap/Form";
import ReceiverCsvTable from "../../components/Tables/ReceiverCsvTable";

class Receiver extends React.Component {

    constructor(props) {
        super(props);
        const {bleMac} = props.match.params
        this.state = {
            bleMac: bleMac,
            pressureData: [],
            pressureState: 0,
            pressureStartTime: '',
            pressureEndTime: '',
            receiverCsvData: [],
            selectedFile: null
        };

        setInterval(() => {
            this.getReceiverInfo(bleMac);
            this.getReceiverCsvData(bleMac);
        }, 1000);

    }

    onPressPressure(bleMac, state) {
        if (state == 0) {
            if (window.confirm('確定要重新開始測試嗎?')) {
                this.putReceiverPressureState(bleMac, state);
            }
        } else {
            this.putReceiverPressureState(bleMac, state);
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

    getRecevierPressureData = (bleMac) => {
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

    getReceiverInfo = (bleMac) => {
        fetch('/api/receiver_csv/' + bleMac, {
            method: 'GET',
            headers: {"Content-Type": "application/json"},
        })
            .then(response => response.json())
            .then(response => {
                if (response.response.length > 0) {
                    this.setState({
                        pressureState: response.response[0].pressure_state,
                    })
                }
            })
            .catch(err => console.error(err));
    };

    getReceiverCsvData = (bleMac) => {
        fetch('/api/receiver_csv/' + bleMac, {
            method: 'GET',
            headers: {"Content-Type": "application/json"},
        })
            .then(response => response.json())
            .then(response => {
                response.response.map(entry => {
                    entry.ins_timestamp = moment(entry.ins_timestamp).format('YYYY-MM-DD HH:mm:ss')
                })
                this.setState({
                    receiverCsvData: response.response,
                })
            })
            .catch(err => console.error(err));
    };

    render() {

        const {
            bleMac,
            pressureData,
            receiverCsvData
        } = this.state;


        return (
            <div
                style={{flex: 1}}
                onClick={() => {
                    document.body.classList.remove("offcanvas-active");
                }}
            >
                <div>
                    <div className="container-fluid">
                        <PageHeader
                            HeaderText={"接收器MAC : " + bleMac}
                        />
                        <div className="row">
                            {bleMac !== '' &&
                                <ReceiverCsvTable
                                    width="col-md-12"
                                    receiverCsvData={receiverCsvData}/>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({}) => ({});

export default connect(mapStateToProps, {})(Receiver);
