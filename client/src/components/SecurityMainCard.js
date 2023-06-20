import React from "react";
import {Button, Input, Space} from "antd";

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
            Threshold,
            width = "col-lg-4 col-md-4 col-md-12",
            handleInputChange,
            handleThresholdChange
        } = this.props;

        return (
            <div className={width}>
                <div className="card card-test">
                    <div className="body">
                        <div className="flex flex-column gap-1">
                            <div className={"flex justify-content-between"}>
                                <div className="flex align-items-center">
                                    <h5 className={"mb-0"}>{Heading}</h5>
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
                                (ShowInput) &&
                                <div className={"mt-1"}>
                                    <Space>
                                        <Input addonBefore="測試門檻值" value={Threshold} onChange={handleInputChange} onPressEnter={handleThresholdChange}/>
                                        <Button type="default" onClick={handleThresholdChange}>送出</Button>
                                    </Space>
                                </div>
                            }
                            <div className={"flex justify-content-between"}>
                                {
                                    Toggle == 0 &&
                                    <div className="text-danger">No Data</div>
                                }
                                {
                                    Toggle == 1 &&
                                    <div className="text-danger">測試中</div>
                                }
                                {
                                    Toggle == 2 &&
                                    <div className="text-success">測試完成</div>
                                }
                                {
                                    (Toggle == 2 && ShowValue) &&
                                    <ResultTemplate value={Value} />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SecurityMainCard;
