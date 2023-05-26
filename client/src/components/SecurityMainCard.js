import React from "react";

class SecurityMainCard extends React.Component {
  render() {
    const {
      Heading,
      OnClick,
      Toggle,
      Value,
      ShowValue,
      width = "col-lg-4 col-md-4 col-md-12"
    } = this.props;
    return (
      <div className={width}>
        <div className="card">
          <div className="body">
            <div className="clearfix">
              <div className="pull-left">
                <h6 className="mb-0">{Heading}</h6>
                {
                  Toggle == 0 &&
                  <small className="text-danger">No Data</small>
                }
                {
                  Toggle == 1 &&
                  <small className="text-danger">測試中</small>
                }
                {
                  Toggle == 2 &&
                  <small className="text-success">測試完成</small>
                }

                {
                  (Toggle > 0 && ShowValue) &&
                  <p>測試結果: {Value}</p>
                }
              </div>
              <div className="pull-right">
                {Toggle == 0 &&
                  <button
                    onClick={OnClick}
                    className="btn btn-outline-success"
                    type="button"
                  >
                    開始測試
                  </button>
                }
                {Toggle == 1 &&
                  <button
                    onClick={OnClick}
                    className="btn btn-outline-danger"
                    type="button"
                  >
                    結束測試
                  </button>
                }
                {Toggle == 2 &&
                  <button
                    onClick={OnClick}
                    className="btn btn-outline-warning"
                    type="button"
                  >
                    重新測試
                  </button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SecurityMainCard;
