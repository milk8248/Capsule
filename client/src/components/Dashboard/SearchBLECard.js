import React from "react";

class SearchBLECard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { bleMac: '' };
        this.handleInputChange = this.handleInputChange.bind(this)
    }

    submitForm = (e) => {
        this.props.handleMacChange(this.state.bleMac)
        e.preventDefault()
        return false
    }

    handleInputChange = (e) => {
        this.setState({ bleMac: e.target.value })
    }


    render() {

        return (
            <div className="col-lg-12">
                <div className="card">
                    <div className="header">
                        <h2>註冊膠囊</h2>
                        <small>Example: c464e3983e70</small>
                    </div>
                    <div className="body">
                        <form onSubmit={this.submitForm}>
                            <div className="input-group mb-3">
                                <input
                                    aria-describedby="basic-addon2"
                                    aria-label="BLE MAC Address"
                                    className="form-control"
                                    placeholder="BLE MAC Address"
                                    type="text"
                                    onChange={this.handleInputChange}
                                />
                                <div className="input-group-append">
                                    <input className="btn btn-outline-secondary" type="submit" value="送出" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default SearchBLECard;