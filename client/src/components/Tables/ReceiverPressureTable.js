import React, {useState} from "react";
import {connect} from "react-redux";
import {Table} from 'antd';
import moment from "moment";

class ReceiverPressureTable extends React.Component {

    render() {

        const {pressureData, width = "col-md-3"} = this.props;

        const columns = [
            {
                title: '時間',
                dataIndex: 'timestamp',
                key: 'timestamp',
            },
            {
                title: '壓力',
                dataIndex: 'reader_pressure',
                key: 'reader_pressure',
            },
        ];

        return (
            <div className={width}>
                <div className="card">
                    <div className="header">
                        <h2>
                            接收器壓力CSV資料{" "}
                            <small>
                                來自CSV的資料
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

export default connect(mapStateToProps, {})(ReceiverPressureTable);
