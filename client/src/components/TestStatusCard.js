import React from "react";

class TestStatusCard extends React.Component {
  render() {
    const {
      Heading,
      Value,
      OnClick
    } = this.props;
    return (

      <div className="col-lg-3 col-md-6 col-sm-6">
        <div className="card overflowhidden number-chart">
          <div className="body">
            <div className="number">
              <h6>{Heading}</h6>
              <span>{Value}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TestStatusCard;
