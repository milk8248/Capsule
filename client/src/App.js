import React from "react";
import { connect } from "react-redux";
import { Route, Switch, withRouter } from "react-router-dom";
import Login from "./screens/Login";
import dashboard from "./screens/Dashboard/Dashboard";
import ioT from "./screens/Dashboard/IoT";
import NavbarMenu from "./components/NavbarMenu";
import filemanagerdashboard from "./screens/FileManager/Dashboard";
import filedocuments from "./screens/FileManager/Documents";
import filemedia from "./screens/FileManager/Media";
import fileimages from "./screens/FileManager/Images";
import blognewPost from "./screens/Blog/NewPost";
import blogdetails from "./screens/Blog/BlogDetails";
import bloglist from "./screens/Blog/BlogList";
import uitypography from "./screens/UIElements/Typography";
import uitabs from "./screens/UIElements/Tabs";
import uibuttons from "./screens/UIElements/Button";
import bootstrapui from "./screens/UIElements/BootstrapUI";
import uiicons from "./screens/UIElements/Icons";
import uinotifications from "./screens/UIElements/Notifications";
import uicolors from "./screens/UIElements/Colors";
import uilistgroup from "./screens/UIElements/ListGroup";
import uimediaobject from "./screens/UIElements/MediaObject";
import uimodal from "./screens/UIElements/Modals";
import uiprogressbar from "./screens/UIElements/ProgressBar";
import widgetsdata from "./screens/Widgets/Data";
import widgetsweather from "./screens/Widgets/Weather";
import widgetsblog from "./screens/Widgets/Blog";
import widgetsecommers from "./screens/Widgets/ECommers";
import registration from "./screens/Auth/Registration";
import lockscreen from "./screens/Auth/Lockscreen";
import forgotpassword from "./screens/Auth/ForgotPassword";
import page404 from "./screens/Auth/Page404";
import page403 from "./screens/Auth/Page403";
import page500 from "./screens/Auth/Page500";
import page503 from "./screens/Auth/Page503";
import blankpage from "./screens/Pages/BlankPage";
import profilev1page from "./screens/Pages/ProfileV1";
import profilev2page from "./screens/Pages/ProfileV2";
import imagegalleryprofile from "./screens/Pages/ImageGallery";
import timeline from "./screens/Pages/TimeLine";
import pricing from "./screens/Pages/Pricing";
import invoices from "./screens/Pages/Invoices";
import invoicesv2 from "./screens/Pages/InvoicesV2";
import searchresult from "./screens/Pages/SearchResults";
import helperclass from "./screens/Pages/HelperClass";
import teamsboard from "./screens/Pages/TeamsBoard";
import projectslist from "./screens/Pages/ProjectsList";
import maintanance from "./screens/Pages/Maintanance";
import testimonials from "./screens/Pages/Testimonials";
import faqs from "./screens/Pages/Faqs";
import formvalidation from "./screens/Forms/FormValidation";
import basicelements from "./screens/Forms/BasicElements";
import tablenormal from "./screens/Tables/TableNormal";
import exam from "./screens/Charts/Exam";
import capsulelist from "./screens/Ble/CapsuleList";
import receiverlist from "./screens/Ble/ReceiverList";
import receiverAutolist from "./screens/Ble/ReceiverAutoList";
import receiver from "./screens/Ble/Receiver";
import capsule from "./screens/Ble/Capsule";
import receiverAuto from "./screens/Ble/ReceiverAuto";
import multiThermometer from "./screens/Ble/MultiThermometer";
import uploadcapsuleble from "./screens/Ble/UploadCapsuleBle";
import uploadcapsulereceivercsv from "./screens/Ble/UploadCapsuleReceiverCsv";
import multiPressure from "./screens/Ble/MultiPressure";

window.__DEV__ = true;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
    };
  }
  render() {

    var res = window.location.pathname;
    var baseUrl = process.env.PUBLIC_URL;
    baseUrl = baseUrl.split("/");
    res = res.split("/");
    res = res.length > 0 ? res[baseUrl.length] : "/";
    res = res ? res : "/";
    const activeKey1 = res;

    return (
      <div id="wrapper">
        {activeKey1 === "page404" ||
          activeKey1 === "page403" ||
          activeKey1 === "page500" ||
          activeKey1 === "page503" ? (
          <Switch>
            {/* <Route exact path={`${process.env.PUBLIC_URL}`} component={Login} /> */}
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/page404`}
              component={page404}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/page403`}
              component={page403}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/page500`}
              component={page500}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/page503`}
              component={page503}
            />
          </Switch>
        ) : (
          <>
            <NavbarMenu history={this.props.history} activeKey={activeKey1} />
            <div id="main-content">
              <Switch>
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/`}
                  component={capsulelist}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/dashboard`}
                  component={dashboard}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/capsule/:bleMac`}
                  component={capsule}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/capsule`}
                  component={capsulelist}
                />
                <Route
                    exact
                    path={`${process.env.PUBLIC_URL}/receiver`}
                    component={receiverlist}
                />
                <Route
                    exact
                    path={`${process.env.PUBLIC_URL}/receiver_auto`}
                    component={receiverAutolist}
                />
                <Route
                    exact
                    path={`${process.env.PUBLIC_URL}/receiver_auto/:bleMac`}
                    component={receiverAuto}
                />
                <Route
                    exact
                    path={`${process.env.PUBLIC_URL}/multi_thermometer`}
                    component={multiThermometer}
                />
                <Route
                    exact
                    path={`${process.env.PUBLIC_URL}/multi_pressure`}
                    component={multiPressure}
                />
                <Route
                    exact
                    path={`${process.env.PUBLIC_URL}/receiver/:bleMac`}
                    component={receiver}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/uploadcapsuleble`}
                  component={uploadcapsuleble}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/uploadcapsulereceivercsv`}
                  component={uploadcapsulereceivercsv}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/ioT`}
                  component={ioT}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/filemanagerdashboard`}
                  component={filemanagerdashboard}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/filedocuments`}
                  component={filedocuments}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/filemedia`}
                  component={filemedia}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/fileimages`}
                  component={fileimages}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/blognewpost`}
                  component={blognewPost}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/blogdetails`}
                  component={blogdetails}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/bloglist`}
                  component={bloglist}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/uitypography`}
                  component={uitypography}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/uitabs`}
                  component={uitabs}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/bootstrapui`}
                  component={bootstrapui}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/uiicons`}
                  component={uiicons}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/uinotifications`}
                  component={uinotifications}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/uicolors`}
                  component={uicolors}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/uilistgroup`}
                  component={uilistgroup}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/uimediaobject`}
                  component={uimediaobject}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/uimodal`}
                  component={uimodal}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/uibuttons`}
                  component={uibuttons}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/uiprogressbar`}
                  component={uiprogressbar}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/widgetsdata`}
                  component={widgetsdata}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/widgetsweather`}
                  component={widgetsweather}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/widgetsblog`}
                  component={widgetsblog}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/widgetsecommers`}
                  component={widgetsecommers}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/blankpage`}
                  component={blankpage}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/profilev1page`}
                  component={profilev1page}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/profilev2page`}
                  component={profilev2page}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/imagegalleryprofile`}
                  component={imagegalleryprofile}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/timeline`}
                  component={timeline}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/pricing`}
                  component={pricing}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/invoices`}
                  component={invoices}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/invoicesv2`}
                  component={invoicesv2}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/searchresult`}
                  component={searchresult}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/helperclass`}
                  component={helperclass}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/teamsboard`}
                  component={teamsboard}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/projectslist`}
                  component={projectslist}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/testimonials`}
                  component={testimonials}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/faqs`}
                  component={faqs}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/formvalidation`}
                  component={formvalidation}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/basicelements`}
                  component={basicelements}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/tablenormal`}
                  component={tablenormal}
                />
                <Route
                  exact
                  path={`${process.env.PUBLIC_URL}/exam`}
                  component={exam}
                />
              </Switch>
            </div>
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ loginReducer }) => ({
  isLoggedin: loginReducer.isLoggedin,
});

export default withRouter(connect(mapStateToProps, {})(App));
