export const ON_PRESS_SEARCH = "dashboardReducer/ON_PRESS_SEARCH";
export const CHANGE_BLE_MAC = "dashboardReducer/CHANGE_BLE_MAC";

export const onPressSearch = () => (dispatch) => {
  dispatch({
    type: ON_PRESS_SEARCH,
  });
};

export const changeBleMac = (val) => (disptch) => {
  disptch({
    type: CHANGE_BLE_MAC,
    payload: val,
  });
};