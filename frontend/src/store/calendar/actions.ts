import { Dispatch } from '../types'
import { ActionTypes, CALENDAR_ACTIONS } from './types'

// TODO remove store
export const setClickedDate = (newClickedDate: Date) => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: CALENDAR_ACTIONS.SET_CLICKED_DATE,
    newClickedDate: newClickedDate,
  })
}
