import React from "react";
import {Input, Space} from "antd";

const getResultColor = (value) => {
    switch (value.toLowerCase()) {
        case 'pass':
            return "success";
        default:
            return "danger";
    }
};
const ResultTemplate = (props) => {
    return (
        <div className={"flex flex-row align-items-center gap-1"}>
            <div>測試結果:</div>
            <div className={"bg-" + getResultColor(props.value) + " rounded p-1 text-center d-inline text-white"}>{props.value}</div>
        </div>
    );
};

class SecurityMainCard extends React.Component {

    render() {
        const {
            Heading,
            OnClick,
            Toggle,
            Value,
            ShowValue,
            ShowInput,
            width = "col-lg-4 col-md-4 col-md-12"
        } = this.props;

        return (
            <div className={width}>
                <div className="card">
                    <div className="body">
                        <div className="clearfix">
                            <div className={"flex justify-content-between"}>
                                <div>
                                    <h6 className="mb-0">{Heading}</h6>
                                    {
                                        Toggle == 0 &&
                                        <small className="text-danger">No Data</small>
                                    }
                                    {
                                        Toggle == 1 &&
                                        <small className="text-danger">測試中</small>
                                    }
                                    {
                                        Toggle == 2 &&
                                        <small className="text-success">測試完成</small>
                                    }
                                </div>
                                <div>
                                    {Toggle == 0 &&
                                        <button
                                            onClick={OnClick}
                                            className="btn btn-outline-success"
                                            type="button"
                                        >
                                            開始測試
                                        </button>
                                    }
                                    {Toggle == 1 &&
                                        <button
                                            onClick={OnClick}
                                            className="btn btn-outline-danger"
                                            type="button"
                                        >
                                            結束測試
                                        </button>
                                    }
                                    {Toggle == 2 &&
                                        <button
                                            onClick={OnClick}
                                            className="btn btn-outline-warning"
                                            type="button"
                                        >
                                            重新測試
                                        </button>
                                    }
                                </div>
                            </div>
                            {
                                (Toggle == 2 && ShowValue) &&
                                <ResultTemplate value={Value} />
                            }
                            {
                                (ShowInput) &&
                                <div className={"mt-1"}>
                                    <Space direction="vertical">
                                        <Input addonBefore="測試門檻值" defaultValue="" />
                                    </Space>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SecurityMainCard;
