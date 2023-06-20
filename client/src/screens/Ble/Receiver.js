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
            bleReceiverData: [],
            selectedFile: null
        };

        setInterval(() => {
            this.getReceiverInfo(bleMac);
            this.getBleReceiverData(bleMac);
            this.getRecevierPressureData(bleMac);
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
        fetch('/api/receiver/' + bleMac, {
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

    putReceiverPressureState = (bleMac, state) => {
        var urlencoded = new URLSearchParams();
        // console.log(bleMac)
        urlencoded.append("mac", bleMac);
        urlencoded.append("state", state);

        fetch('/api/receiver/pressure', {
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

    onFileChange = event => {

        console.log(event.target.files[0])
        this.setState({ selectedFile: event.target.files[0] });

    };

    onFileUpload = () => {
        var formdata = new FormData();
        formdata.append("file", this.state.selectedFile, this.state.selectedFile.name);
        fetch('/api/upload_ble_receiver_csv', {
            method: 'POST',
            body: formdata
        })
            .then(response => response.json())
            .then(response => {
                if (response.code == 200) {
                    alert('上傳成功!')
                }
            })
            .catch(err => console.error(err));
    };


    render() {

        const {
            bleMac,
            pressureData,
            bleReceiverData
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
                        <div className="row clearfix">
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

                            <div className="col-lg-8">
                                <div className="card">
                                    <div className="body table-responsive">
                                        <Form.Group controlId="formFile" className="mb-3">
                                            <Form.Label>僅供上傳CSV檔案
                                            </Form.Label>
                                            <Form.Control type="file" onChange={this.onFileChange}/>
                                        </Form.Group>
                                        <button
                                            className="btn btn-primary"
                                            onClick={this.onFileUpload}
                                        >
                                            上傳
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="row">
                            {bleMac !== '' &&
                                <PressureTable
                                    width="col-md-6"
                                    pressureData={pressureData}/>
                            }
                            {bleMac !== '' &&
                                <ReceiverPressureTable
                                    width="col-md-6"
                                    pressureData={bleReceiverData}/>
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
