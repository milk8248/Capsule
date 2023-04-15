import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import BleListTable from "../../components/Tables/BleListTable";
import SearchBLECard from "../../components/Dashboard/SearchBLECard";
import { Link } from "react-router-dom";

class CapsuleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bleData: [],
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidMount() {
    this.getCapsules();
  }

  handleMacChange(text) {
    if (text.length != 12) {
      alert('輸入格式錯誤!')
    } else {
      this.postCapsule(text);
    }
  }

  postCapsule = (bleMac) => {
    var urlencoded = new URLSearchParams();
    urlencoded.append("mac", bleMac);
    fetch('/api/capsule', {
      method: 'POST',
      body: urlencoded
    })
      .then(response => response.json())
      .then(response => {
        if (response.code == 200) {
          alert(response.response[0].mac + ',註冊成功!')
          this.getCapsules();
        } else if (response.code == 500) {
          alert(response.massage)
        } else {
          alert("輸入有錯誤")
        }
      })
      .catch(err => console.error(err));
  };

  getCapsules = () => {
    fetch('/api/capsule', {
      method: 'GET',
      headers: { "Content-Type": "application/json" },
    })
      .then(response => response.json())
      .then(response => {
        response.response.forEach(element => {
          element.mac = <Link to={'/capsule/' + element.mac}>{element.mac}</Link>
          if (element.pressure_state == 0) {
            element.pressure_state = <span className="badge">未量測</span>
          } else if (element.pressure_state == 1) {
            element.pressure_state = <span className="badge badge-danger">量測中</span>
          } else {
            element.pressure_state = <span className="badge badge-success">已量測</span>
          }
          if (element.thermometer_state == 0) {
            element.thermometer_state = <span className="badge">未量測</span>
          } else if (element.thermometer_state == 1) {
            element.thermometer_state = <span className="badge badge-danger">量測中</span>
          } else {
            element.thermometer_state = <span className="badge badge-success">已量測</span>
          }
          if (element.airtightness_state == 0) {
            element.airtightness_state = <span className="badge">未量測</span>
          } else if (element.airtightness_state == 1) {
            element.airtightness_state = <span className="badge badge-danger">量測中</span>
          } else {
            element.airtightness_state = <span className="badge badge-success">已量測</span>
          }

          element.delete = <button
            type="button"
            data-type="confirm"
            className="btn btn-danger js-sweetalert"
            title="Delete"
          >
            <i className="fa fa-trash-o"></i>
          </button>

        });
        this.setState({
          bleData: response.response
        })
      })
      .catch(err => console.error(err));
  };

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
              HeaderText="膠囊清單"
              Breadcrumb={[
                { name: "膠囊清單", navigate: "" },
              ]}
            />
            <div className="row clearfix">
              <SearchBLECard handleMacChange={(text) => {
                this.handleMacChange(text);
              }} />
              <BleListTable
                bleData={this.state.bleData} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ }) => ({});

export default connect(mapStateToProps, {})(CapsuleList);
