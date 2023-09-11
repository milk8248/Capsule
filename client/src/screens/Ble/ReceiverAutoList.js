import React from "react";
import {connect} from "react-redux";
import PageHeader from "../../components/PageHeader";
import BleListTable from "../../components/Tables/BleListTable";
import SearchBLECard from "../../components/Dashboard/SearchBLECard";
import {Link} from "react-router-dom";
import SettingCard from "../../components/SettingCard";
import ReceiverAutoListTable from "../../components/Tables/ReceiverAutoListTable";
import SearchReceiverCard from "../../components/Dashboard/SearchReceiverCard";

class ReceiverAutoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bleData: [],
      threshold_pressure_750: 0,
      threshold_pressure_800: 0,
      threshold_pressure_850: 0,
    }
    this.getThreshold();
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

  getCapsules = () => {
    fetch('/api/receiver_auto', {
      method: 'GET',
      headers: {"Content-Type": "application/json"},
    })
        .then(response => response.json())
        .then(response => {
          response.response.forEach(element => {

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

  getThreshold = () => {
    fetch('/api/threshold_receiver_auto', {
      method: 'GET',
      headers: {"Content-Type": "application/json"},
    })
        .then(response => response.json())
        .then(response => {
          if (response.response.length > 0) {
            this.setState({
              threshold_pressure_750: response.response[0].pressure_750,
              threshold_pressure_800: response.response[0].pressure_800,
              threshold_pressure_850: response.response[0].pressure_850,
            })
          }
        })
        .catch(err => console.error(err));
  };

  handleInputChange = (type, e) => {
    switch (type) {
      case "pressure_750":
        this.setState({
          threshold_pressure_750: e.target.value,
        })
        break
      case "pressure_800":
        this.setState({
          threshold_pressure_800: e.target.value,
        })
        break
      case "pressure_850":
        this.setState({
          threshold_pressure_850: e.target.value,
        })
        break
      default:
        break
    }
  }

  handleThresholdChange = (type) => {
    switch (type) {
      case "pressure_750":
        this.postThreshold(type, this.state.threshold_pressure_750)
        break
      case "pressure_800":
        this.postThreshold(type, this.state.threshold_pressure_800)
        break
      case "pressure_850":
        this.postThreshold(type, this.state.threshold_pressure_850)
        break
      default:
        break
    }
  }

  postCapsule = (bleMac) => {
    var urlencoded = new URLSearchParams();
    urlencoded.append("mac", bleMac);
    fetch('/api/receiver_auto', {
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

  postThreshold = (type, value) => {
    var urlencoded = new URLSearchParams();
    urlencoded.append("type", type);
    urlencoded.append("value", value);
    fetch('/api/threshold_receiver_auto', {
      method: 'POST',
      body: urlencoded
    })
        .then(response => response.json())
        .then(response => {
          if (response.code == 200) {
            alert('更新成功!')
            this.getThreshold();

          } else if (response.code == 500) {
            alert(response.massage)
          } else {
            alert("輸入有錯誤")
          }
        })
        .catch(err => console.error(err));
  };

  render() {
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
                  HeaderText="接收器清單"
                  Breadcrumb={[
                    {name: "接收器清單", navigate: ""},
                  ]}
              />
              <div className="row">
                <SearchReceiverCard handleMacChange={(text) => {
                  this.handleMacChange(text);
                }}/>
              </div>
              <div className="row row-cols-3">
                <SettingCard
                    Heading="氣壓750門檻值"
                    width="col"
                    data={this.state.threshold_pressure_750}
                    handleInputChange={(text) => {
                      this.handleInputChange("pressure_750", text);
                    }}
                    handleThresholdChange={() => {
                      this.handleThresholdChange("pressure_750");
                    }}
                />
                <SettingCard
                    Heading="氣壓800門檻值"
                    width="col"
                    data={this.state.threshold_pressure_800}
                    handleInputChange={(text) => {
                      this.handleInputChange("pressure_800", text);
                    }}
                    handleThresholdChange={() => {
                      this.handleThresholdChange("pressure_800");
                    }}
                />
                <SettingCard
                    Heading="氣壓850門檻值"
                    width="col"
                    data={this.state.threshold_pressure_850}
                    handleInputChange={(text) => {
                      this.handleInputChange("pressure_850", text);
                    }}
                    handleThresholdChange={() => {
                      this.handleThresholdChange("pressure_850");
                    }}
                />
              </div>
              <div className="row">
                <ReceiverAutoListTable
                    bleData={this.state.bleData}/>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

const mapStateToProps = ({}) => ({});

export default connect(mapStateToProps, {})(ReceiverAutoList);
