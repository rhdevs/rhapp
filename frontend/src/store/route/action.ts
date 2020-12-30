import { Dispatch } from '../types'
import { ActionTypes, ROUTE_ACTIONS } from './types'
import { PATHS } from '../../routes/Routes'

export const redirect = (redirectTo: PATHS) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: ROUTE_ACTIONS.REDIRECT,
    redirectTo,
  })
}
