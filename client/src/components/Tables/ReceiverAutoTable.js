import React, { useState } from "react";
import { connect } from "react-redux";
import { Table } from 'antd';
import moment from "moment";

class ReceiverAutoTable extends React.Component {

    render() {

        const { bleData } = this.props;

        const columns = [
            {
                title: '時間',
                dataIndex: 'timestamp',
                key: 'timestamp',
            },
            {
                title: '壓力',
                dataIndex: 'pressure',
                key: 'pressure',
                render: (_, {pressure}) => (
                    <>
                        {pressure} mmHg
                    </>
                ),
            },
        ];

        return (
            <div className="col-lg-6">
                <div className="card">
                    <div className="header">
                        <h2>
                            接收器資料{" "}
                            <small>
                                來自接收器端的資料
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

const mapStateToProps = ({ mailInboxReducer }) => ({});

export default connect(mapStateToProps, {})(ReceiverAutoTable);
