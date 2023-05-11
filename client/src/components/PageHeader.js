import React from "react";
import * as echarts from "echarts";
import {
  visitorsSparcalOption,
  visitsSparcalOption,
} from "../Data/DashbordData";

class PageHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleMenu: false,
    };
  }

  onToggleMenu = async () => {
    await this.setState({
      toggleMenu: !this.state.toggleMenu,
    });
    const { toggleMenu } = this.state;
    if (!toggleMenu) {
      document.body.classList.remove("layout-fullwidth");
    } else {
      document.body.classList.add("layout-fullwidth");
    }
  };
  render() {
    const { HeaderText, Breadcrumb } = this.props;
    return (
      <div className="block-header">
        <div className="row">
          <div className="col-lg-5 col-md-6 col-sm-12">
            <h2>
              <a
                href="#!"
                className="btn btn-xs btn-link btn-toggle-fullwidth"
                onClick={(e) => {
                  e.preventDefault();
                  this.onToggleMenu();
                }}
              >
                <i
                  className={
                    !this.state.toggleMenu
                      ? `fa fa-arrow-left`
                      : "fa fa-arrow-right"
                  }
                ></i>
              </a>{" "}
              {HeaderText}
            </h2>
          </div>
        </div>
      </div>
    );
  }
}

export default PageHeader;
