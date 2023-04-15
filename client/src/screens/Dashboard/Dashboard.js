import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import LargeScaleAreaChart from "../../components/Charts/LargeScaleAreaChart";
import BleTable from "../../components/Tables/BleTable";
import ThermometerTable from "../../components/Tables/ThermometerTable";
import SearchBLECard from "../../components/Dashboard/SearchBLECard";
import SecurityMainCard from "../../components/SecurityMainCard";

import {
    onPressSearch,
    changeBleMac
} from "../../actions";
import moment from "moment";

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bleMac: '',
            isThermoDataFetch: false,
            thermoData: [],
            isBleDataFetch: false,
            bleData: []
        };

    }

    onPressAirStart() {
        this.putAirtightnessStart();
    }

    handleMacChange(text) {
        this.setState({
            bleMac: text
        })
        this.getThermometerData();
        this.getBleData(text);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     this.getBleData()
    //     this.getThermometerData();
    // }

    getThermometerData = () => {
        fetch('/api/thermometer_data', {
            method: 'GET',
            headers: { "Content-Type": "application/json" },
        })
            .then(response => response.json())
            .then(response => {
                response.response.map(entry => {
                    entry.timestamp = moment(entry.timestamp).format('YYYY-MM-DD HH:mm:ss')
                })
                this.setState({
                    thermoData: response.response,
                    isThermoDataFetch: true,
                })
            })
            .catch(err => console.error(err));
    };

    getBleData = (bleMac) => {
        fetch('/api/ble_data/' + bleMac, {
            method: 'GET',
            headers: { "Content-Type": "application/json" },
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

    putAirtightnessStart = (bleMac) => {
        var urlencoded = new URLSearchParams();
        console.log(bleMac)
        urlencoded.append("mac", bleMac);
        urlencoded.append("state", "1");

        fetch('/api/capsule/airtightness', {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: urlencoded
        })
            .then(response => response.json())
            .then(response => {
                response.response.map(entry => {
                    entry.timestamp = moment(entry.timestamp).format('YYYY-MM-DD HH:mm:ss')
                })
                this.setState({
                    bleData: response.response,
                    isAirtightnessFetch: true,
                })
            })
            .catch(err => console.error(err));
    };

    putPressureStart = (bleMac) => {
        var urlencoded = new URLSearchParams();
        urlencoded.append("mac", bleMac);
        urlencoded.append("state", "1");

        fetch('/api/capsule/pressure', {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: urlencoded
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


    render() {

        const {
            bleMac,
            isThermoDataFetch,
            thermoData,
            isBleDataFetch,
            bleData
        } = this.state;

        return (
            <div
                style={{ flex: 1 }}
                onClick={() => {
                    document.body.classList.remove("offcanvas-active");
                }}
            >
                <div>
                    <div className="container-fluid">
                        <PageHeader
                            HeaderText="查詢膠囊資料"
                            Breadcrumb={[]}
                        />
                        <div className="row clearfix">
                            <SearchBLECard handleMacChange={(text) => {
                                this.handleMacChange(text);
                            }} />

                            {bleMac !== '' &&
                                <SecurityMainCard
                                    Heading="氣密測試"
                                    SuccessText="Done"
                                    DangerText="No Data"
                                    DangerButtonText="No Data"
                                    SuccessButtonText="開始測試"
                                    OnClick={() => {
                                        this.onPressAirStart();
                                    }}
                                />
                            }
                            {bleMac !== '' &&
                                <SecurityMainCard
                                    Heading="溫度測試"
                                    SuccessText="Done"
                                    DangerText="No Data"
                                    DangerButtonText="完成"
                                    SuccessButtonText="開始測試"
                                    Toggle={true} />
                            }
                            {bleMac !== '' &&
                                <SecurityMainCard
                                    Heading="壓力測試"
                                    SuccessText="Done"
                                    DangerText="No Data"
                                    DangerButtonText="完成"
                                    SuccessButtonText="開始測試"
                                    handlePressureStateChange={() => {
                                        this.handlePressureStateChange();
                                    }}
                                    Toggle={true} />
                            }
                            {bleMac !== '' &&
                                <LargeScaleAreaChart
                                    isThermoDataFetch={isThermoDataFetch}
                                    thermoData={thermoData}
                                    isBleDataFetch={isBleDataFetch}
                                    bleData={bleData} />
                            }
                            {bleMac !== '' &&
                                <BleTable
                                    isBleDataFetch={isBleDataFetch}
                                    bleData={bleData} />
                            }
                            {bleMac !== '' &&
                                <ThermometerTable
                                    thermoData={thermoData} />
                            }

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ }) => ({});

export default connect(mapStateToProps, {})(Dashboard);
