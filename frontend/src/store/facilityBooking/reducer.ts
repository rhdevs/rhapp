import { Reducer } from 'redux'
import { ActionTypes, FACILITY_ACTIONS, Facility } from './types'

const initialState = {
  facilityList: [],
  locationList: [],
  selectedTab: '',
}

type State = {
  facilityList: Facility[]
  locationList: string[]
  selectedTab: string
}

export const facilityBooking: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case FACILITY_ACTIONS.GET_FACILITY_LIST: {
      return {
        ...state,
        facilityList: action.facilityList,
        locationList: action.locationList,
      }
    }
    case FACILITY_ACTIONS.CHANGE_TAB: {
      return {
        ...state,
        selectedTab: action.newTab,
      }
    }
    default:
      return state
  }
}
