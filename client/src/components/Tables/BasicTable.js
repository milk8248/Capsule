import React, {useState} from "react";
import {connect} from "react-redux";
import {Table} from 'antd';

class BasicTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bleData: []
        }
    }

    componentDidMount() {
        this.getBleData();
    }

    getBleData = () => {
        fetch('/api/ble_data', {
            method: 'GET',
            headers: {"Content-Type": "application/json"},
        })
            .then(response => response.json())
            .then(response => {
                this.setState({
                    bleData: response.response
                })
            })
            .catch(err => console.error(err));
    };

    render() {

        const {bleData} = this.state;

        // console.log(bleData)

        const columns = [
            {
                title: 'Timestamp',
                dataIndex: 'timestamp',
                key: 'timestamp',
            },
            {
                title: 'MAC',
                dataIndex: 'mac',
                key: 'mac',
            },
            {
                title: 'Temperature',
                dataIndex: 'temperature',
                key: 'temperature',
            },
        ];

        return (
            <div className="col-lg-6">
                <div className="card">
                    <div className="header">
                        <h2>
                            Basic Table{" "}
                            <small>
                                Basic example without any additional modification classes
                            </small>
                        </h2>
                    </div>
                    <div className="body table-responsive">
                        <Table dataSource={bleData} columns={columns} />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({mailInboxReducer}) => ({});

export default connect(mapStateToProps, {})(BasicTable);
