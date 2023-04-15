import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import LargeScaleAreaChart from "../../components/Charts/LargeScaleAreaChart";
import BleTable from "../../components/Tables/BleTable";
import ThermometerTable from "../../components/Tables/ThermometerTable";

class Exam extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  render() {
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
              HeaderText="E-Charts"
              Breadcrumb={[
                { name: "Cahrts", navigate: "" },
                { name: "E-Charts", navigate: "" },
              ]}
            />
            <div className="row clearfix">
              <LargeScaleAreaChart />
              <BleTable />
              <ThermometerTable />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ ioTReducer }) => ({});

export default connect(mapStateToProps, {})(Exam);
