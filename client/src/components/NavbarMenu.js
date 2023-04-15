import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, Nav, Toast } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  onPressDashbord,
  onPressDashbordChild,
  onPressThemeColor,
  onPressGeneralSetting,
  onPressNotification,
  onPressEqualizer,
  onPressSideMenuToggle,
  onPressMenuProfileDropdown,
  onPressSideMenuTab,
  tostMessageLoad,
} from "../actions";
import Logo from "../assets/images/logo.svg";
import LogoWhite from "../assets/images/logo-white.svg";
import UserImage from "../assets/images/user.png";
import Avatar4 from "../assets/images/xs/avatar4.jpg";
import Avatar5 from "../assets/images/xs/avatar5.jpg";
import Avatar2 from "../assets/images/xs/avatar2.jpg";
import Avatar1 from "../assets/images/xs/avatar1.jpg";
import Avatar3 from "../assets/images/xs/avatar3.jpg";

class NavbarMenu extends React.Component {
  state = {
    linkupdate: false,
  };
  componentDidMount() {
    this.props.tostMessageLoad(true);
    var res = window.location.pathname;
    res = res.split("/");
    res = res.length > 4 ? res[4] : "/";
    const { activeKey } = this.props;
    this.activeMenutabwhenNavigate("/" + activeKey);
  }

  activeMenutabwhenNavigate(activeKey) {
    if (
      activeKey === "/dashboard" ||
      activeKey === "/demographic" ||
      activeKey === "/ioT" ||
      activeKey === "/capsule"
    ) {
      this.activeMenutabContainer("dashboradContainer");
    } else if (
      activeKey === "/filemanagerdashboard" ||
      activeKey === "/filedocuments" ||
      activeKey === "/filemedia"
    ) {
      this.activeMenutabContainer("FileManagerContainer");
    } else if (
      activeKey === "/blognewpost" ||
      activeKey === "/bloglist" ||
      activeKey === "/blogdetails"
    ) {
      this.activeMenutabContainer("BlogContainer");
    } else if (
      activeKey === "/uitypography" ||
      activeKey === "/uitabs" ||
      activeKey === "/uibuttons" ||
      activeKey === "/bootstrapui" ||
      activeKey === "/uiicons" ||
      activeKey === "/uinotifications" ||
      activeKey === "/uicolors" ||
      activeKey === "/uilistgroup" ||
      activeKey === "/uimediaobject" ||
      activeKey === "/uimodal" ||
      activeKey === "/uiprogressbar"
    ) {
      this.activeMenutabContainer("UIElementsContainer");
    } else if (
      activeKey === "/widgetsdata" ||
      activeKey === "/widgetsweather" ||
      activeKey === "/widgetsblog" ||
      activeKey === "/widgetsecommers"
    ) {
      this.activeMenutabContainer("WidgetsContainer");
    } else if (activeKey === "/login") {
      this.activeMenutabContainer("WidgetsContainer");
    } else if (
      activeKey === "/teamsboard" ||
      activeKey === "/profilev2page" ||
      activeKey === "/helperclass" ||
      activeKey === "/searchresult" ||
      activeKey === "/invoicesv2" ||
      activeKey === "/invoices" ||
      activeKey === "/pricing" ||
      activeKey === "/timeline" ||
      activeKey === "/profilev1page" ||
      activeKey === "/blankpage" ||
      activeKey === "/imagegalleryprofile" ||
      activeKey === "/projectslist" ||
      activeKey === "/maintanance" ||
      activeKey === "/testimonials" ||
      activeKey === "/faqs"
    ) {
      this.activeMenutabContainer("PagesContainer");
    } else if (
      activeKey === "/formvalidation" ||
      activeKey === "/basicelements"
    ) {
      this.activeMenutabContainer("FormsContainer");
    } else if (activeKey === "/tablenormal") {
      this.activeMenutabContainer("TablesContainer");
    } else if (activeKey === "/echart") {
      this.activeMenutabContainer("chartsContainer");
    } else if (activeKey === "/leafletmap") {
      this.activeMenutabContainer("MapsContainer");
    }
  }

  // componentWillReceiveProps(){
  //   this.setState({
  //     linkupdate:!this.state.linkupdate
  //   })
  // }

  activeMenutabContainer(id) {
    var parents = document.getElementById("main-menu");
    var activeMenu = document.getElementById(id);

    for (let index = 0; index < parents.children.length; index++) {
      if (parents.children[index].id !== id) {
        parents.children[index].classList.remove("active");
        parents.children[index].children[1].classList.remove("in");
      }
    }
    setTimeout(() => {
      activeMenu.classList.toggle("active");
      activeMenu.children[1].classList.toggle("in");
    }, 10);
  }
  render() {
    const {
      addClassactive,
      addClassactiveChildAuth,
      addClassactiveChildMaps,
      themeColor,
      toggleNotification,
      toggleEqualizer,
      sideMenuTab,
      isToastMessage,
      activeKey,
    } = this.props;
    var path = window.location.pathname;
    document.body.classList.add(themeColor);

    return (
      <div>
        <nav className="navbar navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-btn">
              <button
                className="btn-toggle-offcanvas"
                onClick={() => {
                  this.props.onPressSideMenuToggle();
                }}
              >
                <i className="lnr lnr-menu fa fa-bars"></i>
              </button>
            </div>

            <div className="navbar-brand">
              <a href="/" style={{ color: '#17191c', fontWeight: "bold" }}>
                膠囊試量產測試平台
              </a>
            </div>
          </div>
        </nav>

        <div id="left-sidebar" className="sidebar" style={{ zIndex: 9 }}>
          <div className="sidebar-scroll">
            <Nav id="left-sidebar-nav" className="sidebar-nav">
              <ul id="main-menu" className="metismenu">
                <li className="" id="dashboradContainer">
                  <a
                    href="#!"
                    className="has-arrow"
                    onClick={(e) => {
                      e.preventDefault();
                      this.activeMenutabContainer("dashboradContainer");
                    }}
                  >
                    <i className="icon-home"></i> <span>Dashboard</span>
                  </a>
                  <ul className="collapse">
                    {/* <li
                      className={activeKey === "dashboard" ? "active" : ""}
                    >
                      <Link to="dashboard">Analytical</Link>
                    </li> */}
                    {/* <li
                      className={
                        activeKey === "demographic" ? "active" : ""
                      }
                    >
                      <Link to="demographic">Demographic</Link>
                    </li>
                    <li className={activeKey === "ioT" ? "active" : ""}>
                      <Link to="/ioT">IoT</Link>
                    </li> */}
                    <li className={activeKey === "capsule" ? "active" : ""}>
                      <Link to="/capsule">膠囊清單</Link>
                    </li>
                    <li className={activeKey === "capsule" ? "active" : ""}>
                      <Link to="/receiver">接收器清單</Link>
                    </li>
                    {/* <li className={activeKey === "uploadcapsuleble" ? "active" : ""}>
                      <Link to="/uploadcapsuleble">上傳膠囊藍芽CSV</Link>
                    </li>
                    <li className={activeKey === "uploadcapsulereceivercsv" ? "active" : ""}>
                      <Link to="/uploadcapsulereceivercsv">上傳藍芽接收器CSV</Link>
                    </li> */}
                  </ul>
                </li>
                {/*<li id="FileManagerContainer" className="">*/}
                {/*  <a*/}
                {/*    href="#!"*/}
                {/*    className="has-arrow"*/}
                {/*    onClick={(e) => {*/}
                {/*      e.preventDefault();*/}
                {/*      this.activeMenutabContainer("FileManagerContainer");*/}
                {/*    }}*/}
                {/*  >*/}
                {/*    <i className="icon-folder"></i>{" "}*/}
                {/*    <span>File Manager</span>*/}
                {/*  </a>*/}
                {/*  <ul className="collapse">*/}
                {/*    <li*/}
                {/*      className={*/}
                {/*        activeKey === "filemanagerdashboard" ? "active" : ""*/}
                {/*      }*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="filemanagerdashboard">Dashboard</Link>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={*/}
                {/*        activeKey === "filedocuments" ? "active" : ""*/}
                {/*      }*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="filedocuments">Documents</Link>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={activeKey === "filemedia" ? "active" : ""}*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="filemedia">Media</Link>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={activeKey === "fileimages" ? "active" : ""}*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="fileimages">Images</Link>*/}
                {/*    </li>*/}
                {/*  </ul>*/}
                {/*</li>*/}
                {/*<li id="BlogContainer" className="">*/}
                {/*  <a*/}
                {/*    href="#!"*/}
                {/*    className="has-arrow"*/}
                {/*    onClick={(e) => {*/}
                {/*      e.preventDefault();*/}
                {/*      this.activeMenutabContainer("BlogContainer");*/}
                {/*    }}*/}
                {/*  >*/}
                {/*    <i className="icon-globe"></i> <span>Blog</span>*/}
                {/*  </a>*/}
                {/*  <ul className="collapse">*/}
                {/*    <li*/}
                {/*      className={*/}
                {/*        activeKey === "blognewpost" ? "active" : ""*/}
                {/*      }*/}
                {/*    >*/}
                {/*      <Link to="blognewpost">New Post</Link>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={activeKey === "bloglist" ? "active" : ""}*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="bloglist">Blog List</Link>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={*/}
                {/*        activeKey === "blogdetails" ? "active" : ""*/}
                {/*      }*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="blogdetails">Blog Detail</Link>*/}
                {/*    </li>*/}
                {/*  </ul>*/}
                {/*</li>*/}
                {/*<li id="UIElementsContainer" className="">*/}
                {/*  <a*/}
                {/*    href="#uiElements"*/}
                {/*    className="has-arrow"*/}
                {/*    onClick={(e) => {*/}
                {/*      e.preventDefault();*/}
                {/*      this.activeMenutabContainer("UIElementsContainer");*/}
                {/*    }}*/}
                {/*  >*/}
                {/*    <i className="icon-diamond"></i>{" "}*/}
                {/*    <span>UI Elements</span>*/}
                {/*  </a>*/}
                {/*  <ul className="collapse">*/}
                {/*    <li*/}
                {/*      className={*/}
                {/*        activeKey === "uitypography" ? "active" : ""*/}
                {/*      }*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="uitypography">Typography</Link>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={activeKey === "uitabs" ? "active" : ""}*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="uitabs">Tabs</Link>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={activeKey === "uibuttons" ? "active" : ""}*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="uibuttons">Buttons</Link>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={*/}
                {/*        activeKey === "bootstrapui" ? "active" : ""*/}
                {/*      }*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="bootstrapui">Bootstrap UI</Link>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={activeKey === "uiicons" ? "active" : ""}*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="uiicons">Icons</Link>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={*/}
                {/*        activeKey === "uinotifications" ? "active" : ""*/}
                {/*      }*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="uinotifications">Notifications</Link>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={activeKey === "uicolors" ? "active" : ""}*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="uicolors">Colors</Link>*/}
                {/*    </li>*/}

                {/*    <li*/}
                {/*      className={*/}
                {/*        activeKey === "uilistgroup" ? "active" : ""*/}
                {/*      }*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="uilistgroup">List Group</Link>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={*/}
                {/*        activeKey === "uimediaobject" ? "active" : ""*/}
                {/*      }*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="uimediaobject">Media Object</Link>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={activeKey === "uimodal" ? "active" : ""}*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="uimodal">Modals</Link>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={*/}
                {/*        activeKey === "uiprogressbar" ? "active" : ""*/}
                {/*      }*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="uiprogressbar">Progress Bars</Link>*/}
                {/*    </li>*/}
                {/*  </ul>*/}
                {/*</li>*/}
                {/*<li id="WidgetsContainer" className="">*/}
                {/*  <a*/}
                {/*    href="#!"*/}
                {/*    className="has-arrow"*/}
                {/*    onClick={(e) => {*/}
                {/*      e.preventDefault();*/}
                {/*      this.activeMenutabContainer("WidgetsContainer");*/}
                {/*    }}*/}
                {/*  >*/}
                {/*    <i className="icon-puzzle"></i> <span>Widgets</span>*/}
                {/*  </a>*/}
                {/*  <ul className="collapse">*/}
                {/*    <li*/}
                {/*      className={*/}
                {/*        activeKey === "widgetsdata" ? "active" : ""*/}
                {/*      }*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="widgetsdata">Data</Link>*/}
                {/*    </li>*/}

                {/*    <li*/}
                {/*      className={*/}
                {/*        activeKey === "widgetsweather" ? "active" : ""*/}
                {/*      }*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="widgetsweather">Weather</Link>*/}
                {/*    </li>*/}

                {/*    <li*/}
                {/*      className={*/}
                {/*        activeKey === "widgetsblog" ? "active" : ""*/}
                {/*      }*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="widgetsblog">Blog</Link>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={*/}
                {/*        activeKey === "widgetsecommers" ? "active" : ""*/}
                {/*      }*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="widgetsecommers">eCommerce</Link>*/}
                {/*    </li>*/}
                {/*  </ul>*/}
                {/*</li>*/}
                {/*<li id="AuthenticationContainer" className="">*/}
                {/*  <a*/}
                {/*    href="#!"*/}
                {/*    className="has-arrow"*/}
                {/*    onClick={(e) => {*/}
                {/*      e.preventDefault();*/}
                {/*      this.activeMenutabContainer(*/}
                {/*        "AuthenticationContainer"*/}
                {/*      );*/}
                {/*    }}*/}
                {/*  >*/}
                {/*    <i className="icon-lock"></i>{" "}*/}
                {/*    <span>Authentication</span>*/}
                {/*  </a>*/}
                {/*  <ul*/}
                {/*    className={*/}
                {/*      addClassactive[6] ? "collapse in" : "collapse"*/}
                {/*    }*/}
                {/*  >*/}
                {/*    <li*/}
                {/*      className={addClassactiveChildAuth[0] ? "active" : ""}*/}
                {/*    >*/}
                {/*      <a href="login">Login</a>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={addClassactiveChildAuth[1] ? "active" : ""}*/}
                {/*    >*/}
                {/*      <a href="registration">Register</a>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={addClassactiveChildAuth[2] ? "active" : ""}*/}
                {/*    >*/}
                {/*      <a href="lockscreen">Lockscreen</a>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={addClassactiveChildAuth[3] ? "active" : ""}*/}
                {/*    >*/}
                {/*      <a href="forgotpassword">Forgot Password</a>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={addClassactiveChildAuth[4] ? "active" : ""}*/}
                {/*    >*/}
                {/*      <a href="page404">Page 404</a>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={addClassactiveChildAuth[5] ? "active" : ""}*/}
                {/*    >*/}
                {/*      <a href="page403">Page 403</a>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={addClassactiveChildAuth[6] ? "active" : ""}*/}
                {/*    >*/}
                {/*      <a href="page500">Page 500</a>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={addClassactiveChildAuth[7] ? "active" : ""}*/}
                {/*    >*/}
                {/*      <a href="page503">Page 503</a>*/}
                {/*    </li>*/}
                {/*  </ul>*/}
                {/*</li>*/}
                {/*<li id="PagesContainer" className="">*/}
                {/*  <a*/}
                {/*    href="#!"*/}
                {/*    className="has-arrow"*/}
                {/*    onClick={(e) => {*/}
                {/*      e.preventDefault();*/}
                {/*      this.activeMenutabContainer("PagesContainer");*/}
                {/*    }}*/}
                {/*  >*/}
                {/*    <i className="icon-docs"></i> <span>Pages</span>*/}
                {/*  </a>*/}
                {/*  <ul className="collapse">*/}
                {/*    <li*/}
                {/*      className={activeKey === "blankpage" ? "active" : ""}*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="blankpage">Blank Page</Link>{" "}*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={*/}
                {/*        activeKey === "profilev1page" ? "active" : ""*/}
                {/*      }*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="profilev1page">*/}
                {/*        Profile{" "}*/}
                {/*        <span className="badge badge-default float-right">*/}
                {/*          v1*/}
                {/*        </span>*/}
                {/*      </Link>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={*/}
                {/*        activeKey === "profilev2page" ? "active" : ""*/}
                {/*      }*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="profilev2page">*/}
                {/*        Profile{" "}*/}
                {/*        <span className="badge badge-warning float-right">*/}
                {/*          v2*/}
                {/*        </span>*/}
                {/*      </Link>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={*/}
                {/*        activeKey === "imagegalleryprofile" ? "active" : ""*/}
                {/*      }*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="imagegalleryprofile">Image Gallery </Link>{" "}*/}
                {/*    </li>*/}

                {/*    <li*/}
                {/*      className={activeKey === "timeline" ? "active" : ""}*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="timeline">Timeline</Link>*/}
                {/*    </li>*/}

                {/*    <li*/}
                {/*      className={activeKey === "pricing" ? "active" : ""}*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="pricing">Pricing</Link>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={activeKey === "invoices" ? "active" : ""}*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="invoices">*/}
                {/*        Invoices*/}
                {/*        <span className="badge badge-default float-right">*/}
                {/*          v1*/}
                {/*        </span>*/}
                {/*      </Link>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={activeKey === "invoicesv2" ? "active" : ""}*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="invoicesv2">*/}
                {/*        Invoices{" "}*/}
                {/*        <span className="badge badge-warning float-right">*/}
                {/*          v2*/}
                {/*        </span>*/}
                {/*      </Link>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={*/}
                {/*        activeKey === "searchresult" ? "active" : ""*/}
                {/*      }*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="searchresult">Search Results</Link>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={*/}
                {/*        activeKey === "helperclass" ? "active" : ""*/}
                {/*      }*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="helperclass">Helper Classes</Link>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={activeKey === "teamsboard" ? "active" : ""}*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="teamsboard">Teams Board</Link>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={*/}
                {/*        activeKey === "projectslist" ? "active" : ""*/}
                {/*      }*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="projectslist">Projects List</Link>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={*/}
                {/*        activeKey === "maintanance" ? "active" : ""*/}
                {/*      }*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="maintanance">Maintenance</Link>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={*/}
                {/*        activeKey === "testimonials" ? "active" : ""*/}
                {/*      }*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="testimonials">Testimonials</Link>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={activeKey === "faqs" ? "active" : ""}*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="faqs">FAQ</Link>*/}
                {/*    </li>*/}
                {/*  </ul>*/}
                {/*</li>*/}
                {/*<li id="FormsContainer" className="">*/}
                {/*  <a*/}
                {/*    href="#!"*/}
                {/*    className="has-arrow"*/}
                {/*    onClick={(e) => {*/}
                {/*      e.preventDefault();*/}
                {/*      this.activeMenutabContainer("FormsContainer");*/}
                {/*    }}*/}
                {/*  >*/}
                {/*    <i className="icon-pencil"></i> <span>Forms</span>*/}
                {/*  </a>*/}
                {/*  <ul className={"collapse"}>*/}
                {/*    <li*/}
                {/*      className={*/}
                {/*        activeKey === "formvalidation" ? "active" : ""*/}
                {/*      }*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="formvalidation">Form Validation</Link>*/}
                {/*    </li>*/}
                {/*    <li*/}
                {/*      className={*/}
                {/*        activeKey === "basicelements" ? "active" : ""*/}
                {/*      }*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="basicelements">Basic Elements</Link>*/}
                {/*    </li>*/}
                {/*  </ul>*/}
                {/*</li>*/}
                {/*<li id="TablesContainer" className="">*/}
                {/*  <a*/}
                {/*    href="#!"*/}
                {/*    className="has-arrow"*/}
                {/*    onClick={(e) => {*/}
                {/*      e.preventDefault();*/}
                {/*      this.activeMenutabContainer("TablesContainer");*/}
                {/*    }}*/}
                {/*  >*/}
                {/*    <i className="icon-tag"></i> <span>Tables</span>*/}
                {/*  </a>*/}
                {/*  <ul className="collapse">*/}
                {/*    <li*/}
                {/*      className={*/}
                {/*        activeKey === "tablenormal" ? "active" : ""*/}
                {/*      }*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="tablenormal">Normal Tables</Link>{" "}*/}
                {/*    </li>*/}
                {/*  </ul>*/}
                {/*</li>*/}
                {/*<li id="chartsContainer" className="">*/}
                {/*  <a*/}
                {/*    href="#!"*/}
                {/*    className="has-arrow"*/}
                {/*    onClick={(e) => {*/}
                {/*      e.preventDefault();*/}
                {/*      this.activeMenutabContainer("chartsContainer");*/}
                {/*    }}*/}
                {/*  >*/}
                {/*    <i className="icon-bar-chart"></i> <span>Charts</span>*/}
                {/*  </a>*/}
                {/*  <ul className="collapse">*/}
                {/*    <li*/}
                {/*      className={activeKey === "echart" ? "active" : ""}*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="echart">E-chart</Link>{" "}*/}
                {/*    </li>*/}
                {/*  </ul>*/}
                {/*</li>*/}
                {/*<li id="MapsContainer" className="">*/}
                {/*  <a*/}
                {/*    href="#!"*/}
                {/*    className="has-arrow"*/}
                {/*    onClick={(e) => {*/}
                {/*      e.preventDefault();*/}
                {/*      this.activeMenutabContainer("MapsContainer");*/}
                {/*    }}*/}
                {/*  >*/}
                {/*    <i className="icon-map"></i> <span>Maps</span>*/}
                {/*  </a>*/}
                {/*  <ul className="collapse">*/}
                {/*    <li*/}
                {/*      className={*/}
                {/*        activeKey === "leafletmap" ||*/}
                {/*        addClassactiveChildMaps[0]*/}
                {/*          ? "active"*/}
                {/*          : ""*/}
                {/*      }*/}
                {/*      onClick={() => {}}*/}
                {/*    >*/}
                {/*      <Link to="leafletmap">Leaflet Map</Link>*/}
                {/*    </li>*/}
                {/*  </ul>*/}
                {/*</li>*/}
              </ul>
            </Nav>
          </div>
        </div>
      </div>
    );
  }
}

NavbarMenu.propTypes = {
  addClassactive: PropTypes.array.isRequired,
  addClassactiveChild: PropTypes.array.isRequired,
  addClassactiveChildApp: PropTypes.array.isRequired,
  addClassactiveChildFM: PropTypes.array.isRequired,
  addClassactiveChildBlog: PropTypes.array.isRequired,
  addClassactiveChildUI: PropTypes.array.isRequired,
  addClassactiveChildWidgets: PropTypes.array.isRequired,
  addClassactiveChildAuth: PropTypes.array.isRequired,
  addClassactiveChildPages: PropTypes.array.isRequired,
  addClassactiveChildForms: PropTypes.array.isRequired,
  addClassactiveChildTables: PropTypes.array.isRequired,
  addClassactiveChildChart: PropTypes.array.isRequired,
  addClassactiveChildMaps: PropTypes.array.isRequired,
  themeColor: PropTypes.string.isRequired,
  generalSetting: PropTypes.array.isRequired,
  toggleNotification: PropTypes.bool.isRequired,
  toggleEqualizer: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ navigationReducer }) => {
  const {
    addClassactive,
    addClassactiveChild,
    addClassactiveChildApp,
    addClassactiveChildFM,
    addClassactiveChildBlog,
    addClassactiveChildUI,
    addClassactiveChildWidgets,
    addClassactiveChildAuth,
    addClassactiveChildPages,
    addClassactiveChildForms,
    addClassactiveChildTables,
    addClassactiveChildChart,
    addClassactiveChildMaps,
    themeColor,
    generalSetting,
    toggleNotification,
    toggleEqualizer,
    menuProfileDropdown,
    sideMenuTab,
    isToastMessage,
  } = navigationReducer;
  return {
    addClassactive,
    addClassactiveChild,
    addClassactiveChildApp,
    addClassactiveChildFM,
    addClassactiveChildBlog,
    addClassactiveChildUI,
    addClassactiveChildWidgets,
    addClassactiveChildAuth,
    addClassactiveChildPages,
    addClassactiveChildForms,
    addClassactiveChildTables,
    addClassactiveChildChart,
    addClassactiveChildMaps,
    themeColor,
    generalSetting,
    toggleNotification,
    toggleEqualizer,
    menuProfileDropdown,
    sideMenuTab,
    isToastMessage,
  };
};

export default connect(mapStateToProps, {
  onPressDashbord,
  onPressDashbordChild,
  onPressThemeColor,
  onPressGeneralSetting,
  onPressNotification,
  onPressEqualizer,
  onPressSideMenuToggle,
  onPressMenuProfileDropdown,
  onPressSideMenuTab,
  tostMessageLoad,
})(NavbarMenu);
