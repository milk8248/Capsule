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
                dataIndex: 'timestamp',
                key: 'timestamp',
            },
            {
                title: '標準',
                dataIndex: 'type',
                key: 'type',
            },
            {
                title: '壓力',
                dataIndex: 'value',
                key: 'pressure',
                render: (_, {value}) => (
                    <>
                        {value} mmHg
                    </>
                ),
            },
        ];

        return (
            <div className={width}>
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
                        <Table dataSource={pressureData} columns={columns}/>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({}) => ({});

export default connect(mapStateToProps, {})(PressureTable);
