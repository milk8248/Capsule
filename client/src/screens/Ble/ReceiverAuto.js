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
import CapsulePcba from "./CapsulePcba";
import CapsuleFinish from "./CapsuleFinish";
import ReceiverAutoFinish from "./ReceiverAutoFinish";

class ReceiverAuto extends React.Component {

    constructor(props) {
        super(props);

        const {bleMac} = props.match.params

        this.state = {
            bleMac: bleMac,
        };

    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }




    render() {

        const {
            bleMac
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
                            Breadcrumb={[]}
                        />
                        <ReceiverAutoFinish bleMac={bleMac} />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({}) => ({});

export default connect(mapStateToProps, {})(ReceiverAuto);
