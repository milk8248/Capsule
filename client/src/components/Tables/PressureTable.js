import React, {useState} from "react";
import {connect} from "react-redux";
import {Table} from 'antd';
import moment from "moment";

class PressureTable extends React.Component {

    render() {

        const {pressureData, width = "col-md-3"} = this.props;

        const columns = [
            {
                title: '時間',
                dataIndex: 'cs_timestamp',
                key: 'cs_timestamp',
            },
            {
                title: '標準儀器壓力',
                dataIndex: 'std_pressure',
                key: 'std_pressure',
                render: (_, {std_pressure}) => {
                    if (std_pressure != null) {
                        return (
                            <>
                                {std_pressure} mmHg
                            </>
                        )
                    } else {
                        return ''
                    }
                },
            },
            {
                title: '接收器壓力',
                dataIndex: 'reader_pressure',
                key: 'reader_pressure',
                render: (_, {reader_pressure}) => {
                    if (reader_pressure != null) {
                        return (
                            <>
                                {reader_pressure} mmHg
                            </>
                        )
                    } else {
                        return ''
                    }
                },
            },
            {
                title: '流水號',
                dataIndex: 'tag_counter',
                key: 'tag_counter',
            }
        ];

        return (
            <div className={width}>
                <div className="card">
                    <div className="header">
                        <h2>
                            壓力測試資料{" "}
                            <small>
                                來自壓力計量測的資料
                            </small>
                        </h2>
                    </div>
                    <div className="body table-responsive">
                        <Table dataSource={pressureData} columns={columns}/>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({}) => ({});

export default connect(mapStateToProps, {})(PressureTable);
