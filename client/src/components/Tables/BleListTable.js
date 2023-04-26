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
              placeholder="Mac Search"
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

    const pressureStateBodyTemplate = (rowData) => {
        return (
            <span
                className={'badge badge-' + getSeverity(rowData.pressure_state)}>{getState(rowData.pressure_state)}</span>);
    };
    const thermometerStateBodyTemplate = (rowData) => {
        return (<span
            className={'badge badge-' + getSeverity(rowData.thermometer_state)}>{getState(rowData.thermometer_state)}</span>);
    };

    const airtightnessStateBodyTemplate = (rowData) => {
        return (<span
            className={'badge badge-' + getSeverity(rowData.airtightness_state)}>{getState(rowData.airtightness_state)}</span>);
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
                                   "mac"
                               ]}
                               header={header}
                               emptyMessage="No data found.">
                        <Column field="mac" header="Mac" sortable body={macBodyTemplate}></Column>
                        <Column field="airtightness_state" header="氣密"
                                body={airtightnessStateBodyTemplate}></Column>
                        <Column field="thermometer_state" header="溫度"
                                body={thermometerStateBodyTemplate}></Column>
                        <Column field="pressure_state" header="氣壓"
                                body={pressureStateBodyTemplate}></Column>
                    </DataTable>
                    {/*<Table dataSource={bleData} columns={columns} />*/}
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = ({mailInboxReducer}) => ({});
