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


export default function ReceiverAutoListTable(props) {

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
                <Button
                    type="button"
                    icon="pi pi-filter-slash"
                    label="Clear"
                    outlined
                    onClick={clearFilter}
                />
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
            <Link to={'/receiver_auto/' + mac}>{mac}</Link>
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

    const pressure750StateBodyTemplate = (rowData) => {
        return (stateBodyTemplate(rowData, 'pressure_750'))
    };
    const pressure800StateBodyTemplate = (rowData) => {
        return (stateBodyTemplate(rowData, 'pressure_800'))
    };
    const pressure850StateBodyTemplate = (rowData) => {
        return (stateBodyTemplate(rowData, 'pressure_850'))
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
                        接收器清單
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
                        <Column field="pressure" header="氣壓750"
                                body={pressure750StateBodyTemplate}></Column>
                        <Column field="pressure" header="氣壓800"
                                body={pressure800StateBodyTemplate}></Column>
                        <Column field="pressure" header="氣壓850"
                                body={pressure850StateBodyTemplate}></Column>
                    </DataTable>
                    {/*<Table dataSource={bleData} columns={columns} />*/}
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = ({mailInboxReducer}) => ({});
