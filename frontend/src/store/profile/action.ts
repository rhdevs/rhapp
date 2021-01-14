import { userProfileStub } from '../stubs'
import { Dispatch, GetState } from '../types'
import { initialState } from './reducer'
import { ActionTypes, PROFILE_ACTIONS, User, UserCCA } from './types'

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
    newCCAs: user.ccas,
    newModules: user.modules,
  })
}

export const handleEditProfileDetails = (bio: string, displayName: string, telegramHandle: string) => (
  dispatch: Dispatch<ActionTypes>,
  getState: GetState,
) => {
  const { user, newCCAs, newModules } = getState().profile
  const newUser: User = {
    ...user,
    displayName: displayName,
    telegramHandle: telegramHandle,
    bio: bio,
    ccas: newCCAs,
    modules: newModules,
  }
  // Update state
  dispatch(updateCurrentUser(newUser))
  console.log(newUser)
  // TODO; do a POST request

  // dispatch({
  //   type: PROFILE_ACTIONS.UPDATE_CURRENT_USER,
  //   user: {
  //     ...user,
  //     displayName: displayName,
  //     telegramHandle: telegramHandle,
  //     bio: bio,
  //     // cca: newCCA,
  //     // modules: newModules,
  //   },
  // })
  // console.log(newUserItem.toString())
  // console.log(newUserItem.user.bio)
}

export const updateCurrentUser = (newUser: User) => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { user } = getState().profile
  dispatch({
    type: PROFILE_ACTIONS.UPDATE_CURRENT_USER,
    user: {
      ...user,
      displayName: newUser.displayName,
      telegramHandle: newUser.telegramHandle,
      bio: newUser.bio,
      ccas: newUser.ccas,
      modules: newUser.modules,
    },
  })
}

export const handleCCADetails = (actionType: 'Delete' | 'Add', newCcaName: string) => (
  dispatch: Dispatch<ActionTypes>,
  getState: GetState,
) => {
  const { user } = getState().profile
  const newCca = {
    // TODO userId string or number?
    userId: user.userId.toString(),
    //TODO CCA ID
    ccaId: 1,
    ccaName: newCcaName,
  }
  const newUserCcas = user.ccas
  // user.cca = ["rhdevs", "rhmp"]
  switch (actionType) {
    case 'Delete':
      // newUserCcas.remove(newCCA)
      for (let i = 0; i < newUserCcas.length; i++)
        if (newUserCcas[i].ccaName === newCcaName) {
          newUserCcas.splice(i, 1)
          break
        }
      // user.cca = ["rhdevs"]
      break
    case 'Add':
      newUserCcas.push(newCca)
      // user.cca = ["rhdevs","rhmp","voices"]
      break
  }
  // newUserCca (array of new cca) = ["rhdevs","rhmp","voices"] OR = ["rhdevs"]
  // To confirm something/ lock-in:
  // 1. updatestate
  dispatch({ type: PROFILE_ACTIONS.UPDATE_USER_CCAS, newCcas: newUserCcas })
  // 2. backend
  // POST('/SMTHSMTH'), body({ newCCAString }) //refer to backend Documentation OR just ask
}

export const handleModuleDetails = (actionType: 'Delete' | 'Add', newModule: string) => (
  dispatch: Dispatch<ActionTypes>,
  getState: GetState,
) => {
  const { user } = getState().profile
  const newUserModules = user.modules
  // user.cca = ["rhdevs", "rhmp"]
  switch (actionType) {
    case 'Delete':
      // newUserModules.delete(newModule)
      const index = newUserModules.indexOf(newModule)
      if (index > -1) {
        newUserModules.splice(index, 1)
      }

      // user.cca = ["rhdevs"]
      break
    case 'Add':
      newUserModules.push(newModule)
      // user.cca = ["rhdevs","rhmp","voices"]
      break
  }
  // newUserCca (array of new cca) = ["rhdevs","rhmp","voices"] OR = ["rhdevs"]
  // To confirm something/ lock-in:
  // 1. updatestate
  dispatch({ type: PROFILE_ACTIONS.UPDATE_USER_MODULES, newModules: newUserModules })
  // 2. backend
  // POST('/SMTHSMTH'), body({ newCCAString }) //refer to backend Documentation OR just ask
}
