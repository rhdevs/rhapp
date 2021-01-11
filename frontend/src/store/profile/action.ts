import { userProfileStub } from '../stubs'
import { Dispatch, GetState } from '../types'
import { ActionTypes, PROFILE_ACTIONS } from './types'

export const fetchUserDetails = () => (dispatch: Dispatch<ActionTypes>) => {
  const selectedUser = userProfileStub
  dispatch({ type: PROFILE_ACTIONS.SET_USER_DETAILS, user: selectedUser })
}

export const populateProfileEdits = () => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { user } = getState().profile

  dispatch({
    type: PROFILE_ACTIONS.EDIT_USER_DETAILS,
    newDisplayName: user.displayName,
    newTelegramHandle: user.telegramHandle,
    newBio: user.bio,
    newCCA: user.cca,
    newModules: user.modules,
  })
}

export const handleEditProfileDetails = (newUserItem: string) => () => {
  // TODO; do a POST request
  console.log(newUserItem.toString())
  // console.log(newUserItem.user.bio)
}
