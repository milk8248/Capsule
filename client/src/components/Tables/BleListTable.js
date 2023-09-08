import React, {useState, useEffect} from "react";
import {FilterMatchMode, FilterOperator} from "primereact/api";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Link} from "react-router-dom";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import moment from "moment/moment";


export default function BleListTable(props) {

    const {bleData} = props;
    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [statuses] = useState([
        "未量測",
        "量測中",
        "已量測"
    ]);

    useEffect(() => {
        initFilters();
    }, []);

    const clearFilter = () => {
        initFilters();
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = {...filters};

        _filters["global"].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const initFilters = () => {
        setFilters({
            global: {value: null, matchMode: FilterMatchMode.CONTAINS}
        });
        setGlobalFilterValue("");
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <div className="flex gap-2">
                <Button
                    type="button"
                    icon="pi pi-filter-slash"
                    label="Clear"
                    outlined
                    onClick={clearFilter}
                />
                {/*<Button*/}
                {/*    type="button"*/}
                {/*    icon="pi pi-filter-slash"*/}
                {/*    label="Export"*/}
                {/*    outlined*/}
                {/*    onClick={'export'}*/}
                {/*/>*/}
                </div>
                <span className="p-input-icon-left">
          <i className="pi pi-search"/>
          <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Time / Mac Search"
          />
        </span>
            </div>
        );
    };
    const macBodyTemplate = (rowData) => {
        const mac = rowData.mac;
        return (
            <Link to={'/capsule/' + mac}>{mac}</Link>
        );
    };

    const timeBodyTemplate = (rowData) => {
        const time = moment(rowData.timestamp).format('YYYY-MM-DD HH:mm:ss')
        return (
            time
        );
    };

    const stateBodyTemplate = (rowData, type) => {
        let test_res = 'Pass'
        switch (rowData['test_' + type]) {
            case 0:
                test_res = "Fail"
                break
            case 1:
                test_res = "Pass"
                break
            case 2:
                test_res = "資料不足"
                break
        }

        return (
            <div className={'flex flex-column'}>
                <span
                    className={'badge badge-' + getSeverity(rowData[type])}>{getState(rowData[type])}</span>
                {rowData[type] === 2 &&
                    <span
                        className={'badge badge-' + getResult(test_res)}>{test_res}</span>
                }
            </div>
        );
    }

    const pressure750PcbaStateBodyTemplate = (rowData) => {
        return (stateBodyTemplate(rowData, 'pressure_750_pcba'))
    };
    const pressure800PcbaStateBodyTemplate = (rowData) => {
        return (stateBodyTemplate(rowData, 'pressure_800_pcba'))
    };
    const pressure850PcbaStateBodyTemplate = (rowData) => {
        return (stateBodyTemplate(rowData, 'pressure_850_pcba'))
    };
    const rfPcbaStateBodyTemplate = (rowData) => {
        return (stateBodyTemplate(rowData, 'rf_pcba'))
    };
    const pressure750StateBodyTemplate = (rowData) => {
        return (stateBodyTemplate(rowData, 'pressure_750'))
    };
    const pressure800StateBodyTemplate = (rowData) => {
        return (stateBodyTemplate(rowData, 'pressure_800'))
    };
    const pressure850StateBodyTemplate = (rowData) => {
        return (stateBodyTemplate(rowData, 'pressure_850'))
    };
    const thermometerStateBodyTemplate = (rowData) => {
        return (stateBodyTemplate(rowData, 'thermometer'))
    };

    const thermometerPcbaStateBodyTemplate = (rowData) => {
        return (stateBodyTemplate(rowData, 'thermometer_pcba'))
    };

    const airtightnessStateBodyTemplate = (rowData) => {
        return (
            <div className={'flex flex-column'}>
                <span
                    className={'badge badge-' + getSeverity(rowData.airtightness)}>{getState(rowData.airtightness)}</span>
                {rowData.airtightness === 2 &&
                    <span
                        className={'badge badge-' + getResult(rowData.airtightness_data)}>{rowData.airtightness_data}</span>
                }
            </div>
        );
    };

    const rfStateBodyTemplate = (rowData) => {
        return (stateBodyTemplate(rowData, 'rf'))
    };

    const getState = (status) => {
        switch (status) {
            case 0:
                return "未量測";
            case 1:
                return "量測中";
            case 2:
                return "已量測";
        }
    };

    const getSeverity = (status) => {
        switch (status) {
            case 0:
                return null;
            case 1:
                return "danger";
            case 2:
                return "success";
        }
    };

    const getResult = (result) => {
        if (result != null) {
            result = result.toLowerCase()
            console.log(result)
            switch (result) {
                case "pass":
                    return "success";
                case "fail":
                    return "danger";
                case "資料不足":
                    return "warning";
            }
        }
    };

    const header = renderHeader();

    return (
        <div className="col-lg-12">
            <div className="card">
                <div className="header">
                    <h2>
                        藍芽膠囊清單
                    </h2>
                </div>
                <div className="body table-responsive">
                    <DataTable header={header} value={bleData} paginator
                               showGridlines
                               rows={10}
                               dataKey="mac"
                               filters={filters}
                               globalFilterFields={[
                                   "mac","timestamp"
                               ]}
                               header={header}
                               emptyMessage="No data found.">
                        <Column field="timestamp" header="Time" sortable body={timeBodyTemplate}></Column>
                        <Column field="mac" header="Mac" sortable body={macBodyTemplate}></Column>
                        <Column field="thermometer_pcba" header="PCBA溫度"
                                body={thermometerPcbaStateBodyTemplate}></Column>
                        <Column field="pressure_750_pcba" header="PCBA氣壓750"
                                body={pressure750PcbaStateBodyTemplate}></Column>
                        <Column field="pressure_800_pcba" header="PCBA氣壓800"
                                body={pressure800PcbaStateBodyTemplate}></Column>
                        <Column field="pressure_850_pcba" header="PCBA氣壓850"
                                body={pressure850PcbaStateBodyTemplate}></Column>
                        <Column field="rf_pcba" header="PCBA RF"
                                body={rfPcbaStateBodyTemplate}></Column>
                        <Column field="airtightness" header="氣密"
                                body={airtightnessStateBodyTemplate}></Column>
                        <Column field="thermometer" header="溫度"
                                body={thermometerStateBodyTemplate}></Column>
                        <Column field="pressure" header="氣壓750"
                                body={pressure750StateBodyTemplate}></Column>
                        <Column field="pressure" header="氣壓800"
                                body={pressure800StateBodyTemplate}></Column>
                        <Column field="pressure" header="氣壓850"
                                body={pressure850StateBodyTemplate}></Column>
                        <Column field="rf" header="RF"
                                body={rfStateBodyTemplate}></Column>
                    </DataTable>
                    {/*<Table dataSource={bleData} columns={columns} />*/}
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = ({mailInboxReducer}) => ({});
