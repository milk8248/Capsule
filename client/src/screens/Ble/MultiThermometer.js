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
import PageHeader from "../../components/PageHeader";
import ReceiverAutoFinish from "./ReceiverAutoFinish";
import SearchBLECard from "../../components/Dashboard/SearchBLECard";
import AddMultiCapsule from "../../components/Dashboard/AddMultiCapsule";
import SettingCard from "../../components/SettingCard";
import CapsuleThermometerCard from "../../components/CapsuleThermometerCard";
import {Dropdown} from "react-bootstrap";
import ReactEcharts from "echarts-for-react";
import {InputText} from "primereact/inputtext";

class MultiThermometer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            capsules: [],
            multiTestState: 0,
            multiTesterTime: 7
        };

        this.getMultiTester();
        this.getMultiTestState();
        this.getMultiThermometerList();
    }


    cleanAll() {
        if (window.confirm('確定要清除待側清單嗎?')) {
            this.cleanMultiThermometerList();
        }
    }

    handleMacChange(text) {
        if (text.length != 12) {
            alert('輸入格式錯誤!')
        } else {
            this.addCapsuleCard(text);
        }
    }

    handleInputChange = (e) => {
        this.setState({
            multiTesterTime: e.target.value,
        })
    }

    submitForm = (e) => {
        // this.props.handleMacChange(this.state.bleMac)
        console.log(e)
        e.preventDefault()
        return false
    }

    addCapsuleCard = (bleMac) => {
        var urlencoded = new URLSearchParams();
        urlencoded.append("mac", bleMac);
        fetch('/api/multi_thermometer_list', {
            method: 'POST',
            body: urlencoded
        })
            .then(response => response.json())
            .then(response => {
                if (response.code == 200) {
                    alert(response.response[0].mac + ',加入成功!')
                    this.getMultiThermometerList();
                } else if (response.code == 500) {
                    alert(response.massage)
                } else {
                    alert("輸入有錯誤")
                }
            })
            .catch(err => console.error(err));
    };

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    getMultiTester = () => {
        fetch('/api/multi_tester/thermometer', {
            method: 'GET',
            headers: {"Content-Type": "application/json"},
        })
            .then(response => response.json())
            .then(response => {
                this.setState({
                    multiTesterTime: response.response[0].time
                })
            })
            .catch(err => console.error(err));
    };

    getMultiTestState = () => {
        fetch('/api/multi_state/thermometer', {
            method: 'GET',
            headers: {"Content-Type": "application/json"},
        })
            .then(response => response.json())
            .then(response => {
                if (response.response.length > 0) {
                    this.setState({
                        multiTestState: response.response[0]?.state,
                        test_start_timestamp: response.response[0]?.timestamp
                    })
                }
            })
            .catch(err => console.error(err));
    };

    getMultiThermometerList = () => {
        fetch('/api/multi_thermometer_list', {
            method: 'GET',
            headers: {"Content-Type": "application/json"},
        })
            .then(response => response.json())
            .then(response => {
                if (response.response.length > 0) {
                    this.setState({
                        capsules: response.response
                    })
                } else {
                    this.setState({
                        capsules: []
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

    putState = (type, state) => {
        var urlencoded = new URLSearchParams();
        urlencoded.append("state", state);

        fetch('/api/multi_state/' + type, {
            method: 'PUT',
            body: urlencoded
        })
            .then(response => response.json())
            .then(response => {
                this.getMultiTestState();
                this.getMultiThermometerList();
            })
            .catch(err => console.error(err));
    };

    putMultiTesterTime = (time) => {
        var urlencoded = new URLSearchParams();
        urlencoded.append("time", time);

        fetch('/api/multi_tester/thermometer', {
            method: 'PUT',
            body: urlencoded
        })
            .then(response => response.json())
            .then(response => {
                if (response.code == 200) {
                    alert('更新成功!')
                    this.getMultiTester();

                } else if (response.code == 500) {
                    alert(response.massage)
                } else {
                    alert("輸入有錯誤")
                }
            })
            .catch(err => console.error(err));
    };

    deleteMultiThermometerList = (bleMac) => {
        fetch('/api/multi_thermometer_list/' + bleMac, {
            method: 'DELETE', headers: {"Content-Type": "application/json"},
        })
            .then(response => response.json())
            .then(response => {
                alert(response.massage);
                this.getMultiThermometerList();
            })
            .catch(err => console.error(err));
    };

    cleanMultiThermometerList = (bleMac) => {
        fetch('/api/multi_thermometer_list', {
            method: 'DELETE', headers: {"Content-Type": "application/json"},
        })
            .then(response => response.json())
            .then(response => {
                alert(response.massage);
                this.getMultiThermometerList();
                this.getMultiTestState();
            })
            .catch(err => console.error(err));
    };

    onPressState(type, state) {
        if (state == 0) {
            if (window.confirm('確定要重新開始測試嗎?')) {
                this.putState(type, state);
            }
        } else {
            this.putState(type, state);
        }
    }

    submitForm = (e) => {
        if(/^[1-9]\d*$/.test(this.state.multiTesterTime)) {
            this.putMultiTesterTime(this.state.multiTesterTime)
        }else{
            alert('輸入格式有誤，請輸入分鐘（正整數）')
        }
        e.preventDefault()
        return false
    }

    render() {

        const {
            capsules,
            multiTestState,
            multiTesterTime
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
                            HeaderText={"6顆膠囊測試溫度"}
                            Breadcrumb={[]}
                        />
                        <div className="row">
                            <AddMultiCapsule
                                Toggle={multiTestState}
                                handleMacChange={(text) => {
                                    this.handleMacChange(text);
                                }}/>
                            <div className="col-lg-6">
                                <div className="card">
                                    <div className="body">
                                        <form onSubmit={this.submitForm}>
                                            <div className="d-flex align-items-center gap-2 mb-3">
                                                <div className="w-25">倒數計時</div>
                                                <div className="input-group">
                                                    <InputText
                                                        aria-describedby="basic-addon2"
                                                        aria-label="分鐘"
                                                        className="form-control"
                                                        placeholder="分鐘"
                                                        type="number"
                                                        value={multiTesterTime}
                                                        onChange={this.handleInputChange}
                                                    />
                                                    <div className="input-group-append">
                                                        <input className="btn btn-outline-secondary" type="submit"
                                                               value="確定"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                        <div className="flex align-items-center justify-content-center">
                                            {multiTestState == 0 &&
                                                <div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary mr-1"
                                                        onClick={() => {
                                                            if (multiTestState == 0) {
                                                                this.onPressState('thermometer', 1);
                                                            } else if (multiTestState == 1) {
                                                                this.onPressState('thermometer', 2);
                                                            } else {
                                                                this.onPressState('thermometer', 0);
                                                            }
                                                        }}
                                                    >
                                                        開始測試
                                                    </button>

                                                </div>
                                            }
                                            {multiTestState == 1 &&
                                                <button
                                                    type="button"
                                                    className="btn btn-danger mr-1"
                                                    onClick={() => {
                                                        if (multiTestState == 0) {
                                                            this.onPressState('thermometer', 1);
                                                        } else if (multiTestState == 1) {
                                                            this.onPressState('thermometer', 2);
                                                        } else {
                                                            this.onPressState('thermometer', 0);
                                                        }
                                                    }}
                                                >
                                                    結束測試
                                                </button>
                                            }
                                            {multiTestState == 2 &&
                                                <div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-warning mr-1"
                                                        onClick={() => {
                                                            if (multiTestState == 0) {
                                                                this.onPressState('thermometer', 1);
                                                            } else if (multiTestState == 1) {
                                                                this.onPressState('thermometer', 2);
                                                            } else {
                                                                this.onPressState('thermometer', 0);
                                                            }
                                                        }}
                                                    >
                                                        重新測試
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger mr-1"
                                                        onClick={() => {
                                                            this.cleanAll();
                                                        }}
                                                    >
                                                        清除所有
                                                    </button>

                                                </div>
                                            }


                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row row-cols-3">
                            {capsules.map((item, index) => (
                                <CapsuleThermometerCard
                                    key={item.mac}
                                    capsule={item}
                                    handleDeleteCard={() => {
                                        this.deleteMultiThermometerList(item.mac);
                                    }}
                                />
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({}) => ({});

export default connect(mapStateToProps, {})(MultiThermometer);
