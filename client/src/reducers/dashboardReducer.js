import {
    ON_PRESS_SEARCH,
    CHANGE_BLE_MAC
} from "../actions/DashboardAction";

const initialState = {
    isSearch: false,
    bleMac: '',
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ON_PRESS_SEARCH: {
            return {
                ...state,
                isSearch: !state.isSearch,
            };
        }

        case CHANGE_BLE_MAC: {
            return {
                ...state,
                bleMac: action.payload,
            };
        }

        default:
            return state;
    }
};
