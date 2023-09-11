import React from "react";
import {InputText} from "primereact/inputtext";

class AddMultiCapsule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {bleMac: ''};
        this.handleInputChange = this.handleInputChange.bind(this)
    }

    submitForm = (e) => {
        this.props.handleMacChange(this.state.bleMac)
        e.preventDefault()
        return false
    }

    handleInputChange = (e) => {
        this.setState({bleMac: e.target.value})
    }


    render() {

        return (
            <div className="col-lg-6">
                <div className="card">
                    <div className="header">
                        <h2>加入待側清單</h2>
                        <small>Example: c464e3983e70</small>
                    </div>
                    <div className="body">
                        {this.props.Toggle == 0 &&
                            <form onSubmit={this.submitForm}>
                                <div className="input-group mb-3">
                                    <InputText
                                        aria-describedby="basic-addon2"
                                        aria-label="MAC Address"
                                        className="form-control"
                                        placeholder="MAC Address"
                                        type="text"
                                        onChange={this.handleInputChange}
                                    />
                                    <div className="input-group-append">
                                        <input className="btn btn-outline-secondary" type="submit" value="加入"/>
                                    </div>
                                </div>
                            </form>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default AddMultiCapsule;