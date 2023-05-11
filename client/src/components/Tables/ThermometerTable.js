import React, { useState } from "react";
import { connect } from "react-redux";
import { Table } from 'antd';
import moment from "moment";

class ThermometerTable extends React.Component {

    render() {

        const { thermoData, width="col-md-4" } = this.props;

        const columns = [
            {
                title: '時間',
                dataIndex: 'timestamp',
                key: 'timestamp',
            },
            {
                title: 'T1',
                dataIndex: 'value1',
                key: 'value1',
            },
            {
                title: 'T2',
                dataIndex: 'value2',
                key: 'value2',
            },
            {
                title: 'T3',
                dataIndex: 'value3',
                key: 'value3',
            },
            {
                title: 'T4',
                dataIndex: 'value4',
                key: 'value4',
            },
        ];

        return (
            <div className={width}>
                <div className="card">
                    <div className="header">
                        <h2>
                            溫度儀資料{" "}
                            <small>
                                來自溫度計量測的資料
                            </small>
                        </h2>
                    </div>
                    <div className="body table-responsive">
                        <Table dataSource={thermoData} columns={columns} />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ }) => ({});

export default connect(mapStateToProps, {})(ThermometerTable);
