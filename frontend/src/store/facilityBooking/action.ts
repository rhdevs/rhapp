import { Dispatch } from '../types'
import { ActionTypes, FACILITY_ACTIONS } from './types'
// import { get, ENDPOINTS } from '../endpoints'
import { facilityListStub } from '../stubs'

export const getFacilityList = () => (dispatch: Dispatch<ActionTypes>) => {
  // get(ENDPOINTS.FACILITY_LIST).then((resp) => {
  //   const fetchedList: Facility[] = resp.data
  //   dispatch({
  //     type: FACILITY_ACTIONS.GET_FACILITY_LIST,
  //     facilityList: facilityListStub,
  //   })
  // })

  // filters through all locations and gives a unique list
  const uniqueLocationList = [...new Set(facilityListStub.map((item) => item.facilityLocation))]
  dispatch({
    type: FACILITY_ACTIONS.GET_FACILITY_LIST,
    facilityList: facilityListStub,
    locationList: uniqueLocationList,
  })
}

export const changeTab = (newTab: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.CHANGE_TAB, newTab: newTab })
}
