import { Dispatch, GetState } from '../types'
import { ActionTypes, CALENDAR_ACTIONS } from './types'

export const SetIsClicked = (currentlyClickedDate: number) => async (
  dispatch: Dispatch<ActionTypes>,
  getState: GetState,
) => {
  const { isClicked, clickedDate } = getState().calendar
  if (isClicked) {
    if (currentlyClickedDate !== clickedDate) {
      return
    } else {
      console.log('Disabling click now.')
      dispatch({
        type: CALENDAR_ACTIONS.SET_IS_CLICKED,
        newIsClicked: false,
        newClickedDate: 0,
      })
    }
  }
  dispatch({
    type: CALENDAR_ACTIONS.SET_IS_CLICKED,
    newIsClicked: true,
    newClickedDate: currentlyClickedDate,
  })
}
