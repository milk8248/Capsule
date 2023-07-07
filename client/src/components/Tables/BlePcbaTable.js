import React, { useState } from "react";
import { connect } from "react-redux";
import { Table } from 'antd';
import moment from "moment";

class BlePcbaTable extends React.Component {

    render() {

        const { bleData, width = "col-lg-5" } = this.props;

        const columns = [
            {
                title: '時間',
                dataIndex: 'timestamp',
                key: 'timestamp',
            },
            {
                title: '溫度',
                dataIndex: 'temperature',
                key: 'temperature',
            },
            {
                title: '壓力',
                dataIndex: 'pressure',
                key: 'pressure',
            }
        ];

        return (
            <div className={width}>
                <div className="card">
                    <div className="header">
                        <h2>
                            PCBA藍芽資料{" "}
                            <small>
                                來自PCBA藍芽端的膠囊資料
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

export default connect(mapStateToProps, {})(BlePcbaTable);
