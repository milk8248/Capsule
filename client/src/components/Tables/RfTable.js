import React, {useState} from "react";
import {connect} from "react-redux";
import {Table} from 'antd';
import moment from "moment";

class RfTable extends React.Component {

    render() {

        const {rfData, width = "col-md-3"} = this.props;

        const columns = [
            {
                title: '時間',
                dataIndex: 'timestamp',
                key: 'timestamp',
            },
            {
                title: 'Pass/Fail',
                dataIndex: 'result',
                key: 'result',
            },
            {
                title: '閾值',
                dataIndex: 'threshold',
                key: 'threshold',
            },
            {
                title: 'V1',
                dataIndex: 'value1',
                key: 'value1',
            },
            {
                title: 'V2',
                dataIndex: 'value2',
                key: 'value2',
            },
        ];

        return (
            <div className={width}>
                <div className="card">
                    <div className="header">
                        <h2>
                            RF資料{" "}
                            <small>
                                來自RF量測的資料
                            </small>
                        </h2>
                    </div>
                    <div className="body table-responsive">
                        <Table dataSource={rfData} columns={columns}/>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({}) => ({});

export default connect(mapStateToProps, {})(RfTable);
