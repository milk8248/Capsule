import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import Form from 'react-bootstrap/Form';

class UploadCapsuleReceiverCsv extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null
    };

  }

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
              HeaderText="上傳藍芽接收器CSV"
              Breadcrumb={[
                { name: "上傳藍芽接收器CSV", navigate: "" },
              ]}
            />
            <div className="row clearfix">
              <div className="col-lg-12">
                <div className="card">
                  <div className="body table-responsive">
                    <Form.Group controlId="formFile" className="mb-3">
                      <Form.Label>僅供上傳CSV檔案
                      </Form.Label>
                      <Form.Control type="file" onChange={this.onFileChange} />
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
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ }) => ({});

export default connect(mapStateToProps, {})(UploadCapsuleReceiverCsv);
