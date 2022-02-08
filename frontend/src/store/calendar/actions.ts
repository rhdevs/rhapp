import { Dispatch, GetState } from '../types'
import { ActionTypes, CALENDAR_ACTIONS } from './types'

export const SetIsClicked = (isClicked: boolean) => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: CALENDAR_ACTIONS.SET_IS_CLICKED,
    newIsClicked: isClicked,
  })
}