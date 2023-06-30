import React from "react";
import {Input, Space,Button} from "antd";

export default function settingCard(props) {
    const {
        Heading,
        width = "col-lg-4 col-md-4 col-md-12",
        data,
        handleInputChange,
        handleThresholdChange
    } = props;

    return (
        <div className={width}>
            <div className="card">
                <div className="body">
                    <div className="clearfix">
                        <div className={"flex justify-content-between"}>
                            <div>
                                <h6 className="mb-0">{Heading}</h6>
                            </div>
                        </div>
                        <div className={"mt-1"}>
                            <Space.Compact>
                                <Input value={data} onChange={handleInputChange} onPressEnter={handleThresholdChange}/>
                                <Button type="default" onClick={handleThresholdChange}>送出</Button>
                            </Space.Compact>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}