import { FACILITY_ACTIONS } from '../facilityBooking/types'

export type Date = {
  type: typeof FACILITY_ACTIONS.SET_FACILITY_BOOKINGS
  isClicked: boolean
}

export enum CALENDAR_ACTIONS {
  SET_IS_CLICKED = 'CALENDAR_ACTIONS.SET_IS_CLICKED',
}

type SetIsClicked = {
  type: typeof CALENDAR_ACTIONS.SET_IS_CLICKED
  newIsClicked: boolean
}

export type ActionTypes = SetIsClicked
