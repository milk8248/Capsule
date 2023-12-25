import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import { Link } from "react-router-dom";
import SearchReceiverCard from "../../components/Dashboard/SearchReceiverCard";
import ReceiverListTable from "../../components/Tables/ReceiverListTable";

class ReceiverList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receiverData: [],
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidMount() {
    this.getReceiver();
  }

  handleMacChange(text) {
    text = text.replaceAll(" ","")
    text = text.replaceAll(":","")
    if(text.indexOf('Mac')>=0) {
      text = text.substring(text.indexOf('Mac') + 3, 15)
    }
    if (text.length != 12) {
      alert('輸入格式錯誤!')
    } else {
      this.postReceiver(text)
    }
  }

  postReceiver = (receiverMac) => {
    var urlencoded = new URLSearchParams();
    urlencoded.append("mac", receiverMac);
    fetch('/api/receiver', {
      method: 'POST',
      body: urlencoded
    })
      .then(response => response.json())
      .then(response => {
        if (response.code == 200) {
          alert(response.response[0].mac + ',註冊成功!')
          this.getReceiver();
        } else if (response.code == 500) {
          alert(response.massage)
        } else {
          alert("輸入有錯誤")
        }
      })
      .catch(err => console.error(err));
  };

  getReceiver = () => {
    fetch('/api/receiver_csv_mac', {
      method: 'GET',
      headers: { "Content-Type": "application/json" },
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
          receiverData: response.response
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
              HeaderText="接收器CSV"
              Breadcrumb={[
                { name: "接收器CSV", navigate: "" },
              ]}
            />
            <div className="row clearfix">
              <ReceiverListTable
                receiverData={this.state.receiverData} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ }) => ({});

export default connect(mapStateToProps, {})(ReceiverList);
