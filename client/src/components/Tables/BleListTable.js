import React, { useState } from "react";
import { connect } from "react-redux";
import { Table } from 'antd';
import { Badge } from 'react-bootstrap'
import moment from "moment";


class BleListTable extends React.Component {


    render() {

        const { bleData } = this.props;

        const columns = [
            {
                title: 'MAC',
                dataIndex: 'mac',
                key: 'mac',
                filterSearch: true,
            },
            {
                title: '氣密',
                dataIndex: 'airtightness_state',
            },
            {
                title: '溫度',
                dataIndex: 'thermometer_state',
            },
            {
                title: '氣壓',
                dataIndex: 'pressure_state',
            },
            // {
            //     title: '刪除',
            //     dataIndex: 'delete',
            // },

        ];

        return (
            <div className="col-lg-12">
                <div className="card">
                    <div className="header">
                        <h2>
                            藍芽膠囊清單
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

export default connect(mapStateToProps, {})(BleListTable);
