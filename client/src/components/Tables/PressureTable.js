import React, { useState } from "react";
import { connect } from "react-redux";
import { Table } from 'antd';
import moment from "moment";

class PressureTable extends React.Component {

    render() {

        const { pressureData } = this.props;

        const columns = [
            {
                title: '時間',
                dataIndex: 'timestamp',
                key: 'timestamp',
            },
            {
                title: '壓力',
                dataIndex: 'value',
                key: 'pressure',
            },
        ];

        return (
            <div className="col-md-3">
                <div className="card">
                    <div className="header">
                        <h2>
                            壓力儀資料{" "}
                            <small>
                                來自壓力計量測的資料
                            </small>
                        </h2>
                    </div>
                    <div className="body table-responsive">
                        <Table dataSource={pressureData} columns={columns} />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ }) => ({});

export default connect(mapStateToProps, {})(PressureTable);
