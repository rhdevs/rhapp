import { Dispatch, GetState } from '../types'
import { ActionTypes, CALENDAR_ACTIONS } from './types'

export const SetIsClicked = (newClickedDate: number) => async (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { isClicked, clickedDate } = getState().calendar
  if (isClicked) {
    if (newClickedDate !== clickedDate) {
      return
    } else {
      dispatch({
        type: CALENDAR_ACTIONS.SET_IS_CLICKED,
        newIsClicked: false,
        newClickedDate: 0,
      })
      return
    }
  }
  dispatch({
    type: CALENDAR_ACTIONS.SET_IS_CLICKED,
    newIsClicked: true,
    newClickedDate: newClickedDate,
  })
}
