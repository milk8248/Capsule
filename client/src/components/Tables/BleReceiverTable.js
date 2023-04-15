import React, { useState } from "react";
import { connect } from "react-redux";
import { Table } from 'antd';
import moment from "moment";

class BleReceiverTable extends React.Component {

    render() {

        const { bleReceiverData } = this.props;

        const columns = [
            {
                title: '時間',
                dataIndex: 'timestamp',
                key: 'timestamp',
            },
            {
                title: 'TAG壓力',
                dataIndex: 'tag_pressure',
                key: 'tag_pressure',
            },
            {
                title: 'READER壓力',
                dataIndex: 'reader_pressure',
                key: 'reader_pressure',
            },
            {
                title: '壓力差',
                dataIndex: 'pressure_diff',
                key: 'pressure_diff',
            },
            {
                title: 'TAG溫度',
                dataIndex: 'tag_temperature',
                key: 'tag_temperature',
            },
            {
                title: 'READER溫度',
                dataIndex: 'reader_temperature',
                key: 'reader_temperature',
            }
        ];

        return (
            <div className="col-lg-12">
                <div className="card">
                    <div className="header">
                        <h2>
                            接收器藍芽資料{" "}
                        </h2>
                    </div>
                    <div className="body table-responsive">
                        <Table dataSource={bleReceiverData} columns={columns} />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ mailInboxReducer }) => ({});

export default connect(mapStateToProps, {})(BleReceiverTable);
