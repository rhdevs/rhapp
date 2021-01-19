import { DOMAINS, DOMAIN_URL, ENDPOINTS, put } from '../endpoints'
import { Dispatch, GetState } from '../types'
import { ActionTypes, PROFILE_ACTIONS, User } from './types'

export const fetchUserDetails = (userID: string) => (dispatch: Dispatch<ActionTypes>) => {
  // const selectedUser = userProfileStub
  // dispatch({ type: PROFILE_ACTIONS.SET_USER_DETAILS, user: selectedUser })
  fetch(DOMAIN_URL.SOCIAL + ENDPOINTS.USER_DETAILS + '/' + userID, {
    method: 'GET',
  })
    .then((resp) => resp.json())
    .then((data) => {
      dispatch({ type: PROFILE_ACTIONS.SET_USER_DETAILS, user: data })
    })
}

export const fetchUserCCAs = (userID: string) => (dispatch: Dispatch<ActionTypes>) => {
  // const selectedUser = userProfileStub
  // dispatch({ type: PROFILE_ACTIONS.SET_USER_DETAILS, user: selectedUser })
  fetch(DOMAIN_URL.EVENT + ENDPOINTS.USER_CCAS + '/' + userID, {
    method: 'GET',
  })
    .then((resp) => resp.json())
    .then((data) => {
      dispatch({ type: PROFILE_ACTIONS.SET_USER_CCAS, ccas: data })
    })
}

export const fetchUserFriends = (userID: string) => async (dispatch: Dispatch<ActionTypes>) => {
  // const selectedUser = userProfileStub
  // dispatch({ type: PROFILE_ACTIONS.SET_USER_DETAILS, user: selectedUser })
  await fetch(DOMAIN_URL.SOCIAL + ENDPOINTS.FRIEND + '/' + userID, {
    method: 'GET',
  })
    .then((resp) => resp.json())
    .then((data) => {
      dispatch({ type: PROFILE_ACTIONS.SET_USER_FRIENDS, friends: data })
    })
}

export const populateProfileEdits = () => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { user, ccas } = getState().profile

  dispatch({
    type: PROFILE_ACTIONS.EDIT_USER_DETAILS,
    newDisplayName: user.displayName,
    newTelegramHandle: user.telegramHandle,
    newBio: user.bio,
    newCCAs: ccas,
    newModules: user.modules,
  })
}

export const handleEditProfileDetails = (bio: string, displayName: string, telegramHandle: string) => async (
  dispatch: Dispatch<ActionTypes>,
  getState: GetState,
) => {
  const { user, newCCAs, newModules } = getState().profile
  const newUser: User = {
    ...user,
    displayName: displayName,
    telegramHandle: telegramHandle,
    bio: bio,
    modules: newModules,
  }
  dispatch({
    type: PROFILE_ACTIONS.UPDATE_CURRENT_USER,
    user: newUser,
    ccas: newCCAs,
  })
  dispatch(updateCurrentUser(newUser))
  // const newUser = {
  //   userID: 'A1234567B',
  //   block: 6,
  //   displayName: 'abby',
  //   telegramHandle: 'teleabbyy',
  //   bio: 'hur hur',
  //   profilePictureUrl: 'as',
  //   modules: ['aa'],
  // }

  // Update state
  // dispatch(updateCurrentUser(newUser))
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

export const updateCurrentUser = (newUser: User) => () => {
  // const { user } = getState().profile
  put(ENDPOINTS.EDIT_PROFILE, DOMAINS.SOCIAL, newUser)
    .then((resp) => {
      if (resp.status >= 400) {
        console.log('FAILURE')
      } else {
        console.log('SUCCESS!!!')
      }
    })
    .catch(() => {
      console.log('catch block')
    })
  // dispatch({
  //   type: PROFILE_ACTIONS.UPDATE_CURRENT_USER,
  //   user: {
  //     ...user,
  //     displayName: newUser.displayName,
  //     telegramHandle: newUser.telegramHandle,
  //     bio: newUser.bio,
  //     ccas: newUser.ccas,
  //     modules: newUser.modules,
  //   },
  // })
}

export const handleCCADetails = (actionType: 'Delete' | 'Add', newCcaName: string) => (
  dispatch: Dispatch<ActionTypes>,
  getState: GetState,
) => {
  const { user, ccas } = getState().profile
  const newCca = {
    // TODO userId string or number?
    userID: user.userID.toString(),
    //TODO CCA ID
    ccaID: 1,
    ccaName: newCcaName,
  }
  const newUserCcas = ccas
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
  dispatch({ type: PROFILE_ACTIONS.UPDATE_USER_CCAS, newCCAs: newUserCcas })
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
