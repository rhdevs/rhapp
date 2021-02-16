import { DOMAIN_URL, ENDPOINTS } from '../endpoints'
import { Dispatch, GetState } from '../types'
import { ActionTypes, PROFILE_ACTIONS, User, UserCCA } from './types'

export const checkIsLoggedIn = () => (dispatch: Dispatch<ActionTypes>) => {
  const token = localStorage.token

  if (token) {
    fetch(DOMAIN_URL.SOCIAL + ENDPOINTS.IS_LOGGEDIN + '?token=' + token, {
      method: 'GET',
      mode: 'no-cors',
    }).then((resp) => {
      console.log(resp)
      if (resp.status !== 200) {
        dispatch({ type: PROFILE_ACTIONS.SET_IS_LOGGED_IN, isLoggedIn: true })
      } else {
        dispatch({ type: PROFILE_ACTIONS.SET_IS_LOGGED_IN, isLoggedIn: false })
      }
    })
  } else {
    dispatch({ type: PROFILE_ACTIONS.SET_IS_LOGGED_IN, isLoggedIn: false })
  }
}

export const fetchUserDetails = (userID: string | null) => (dispatch: Dispatch<ActionTypes>) => {
  if (userID !== null) {
    console.log('FETCHING!!!!  ' + userID)
    fetch('https://rhappsocial.rhdevs.repl.co/profile/' + userID, {
      method: 'GET',
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data[0])
        dispatch({ type: PROFILE_ACTIONS.SET_USER_DETAILS, user: data[0] })
      })
  }
}

export const fetchUserCCAs = (userID: string | null) => (dispatch: Dispatch<ActionTypes>) => {
  if (userID !== null) {
    fetch(DOMAIN_URL.EVENT + ENDPOINTS.USER_CCAS + '/' + userID, {
      method: 'GET',
    })
      .then((resp) => resp.json())
      .then((data) => {
        dispatch({ type: PROFILE_ACTIONS.SET_USER_CCAS, ccas: data })
      })
  }
}

export const fetchAllCCAs = () => (dispatch: Dispatch<ActionTypes>) => {
  fetch(DOMAIN_URL.EVENT + ENDPOINTS.ALL_CCAS, {
    method: 'GET',
  })
    .then((resp) => resp.json())
    .then((data) => {
      dispatch({ type: PROFILE_ACTIONS.SET_ALL_CCAS, allCcas: data })
    })
}

export const fetchUserFriends = (userID: string | null) => async (dispatch: Dispatch<ActionTypes>) => {
  if (userID != null) {
    await fetch(DOMAIN_URL.SOCIAL + ENDPOINTS.FRIEND + '/' + userID, {
      method: 'GET',
    })
      .then((resp) => resp.json())
      .then((data) => {
        dispatch({ type: PROFILE_ACTIONS.SET_USER_FRIENDS, friends: data })
      })
  }
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

  // Update local state
  dispatch({
    type: PROFILE_ACTIONS.UPDATE_CURRENT_USER,
    user: newUser,
    ccas: newCCAs,
  })

  // Update database
  dispatch(updateCurrentUser(newUser))
}

// One shot update database with all changes
export const updateCurrentUser = (newUser: User) => async (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { user, ccas } = getState().profile
  // 1. Update user profile
  await fetch(DOMAIN_URL.SOCIAL + ENDPOINTS.EDIT_PROFILE, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newUser),
  })
    .then((resp) => resp)
    .then((data) => {
      if (data.ok) {
        console.log('update current user success')
      }
    })

  // 2. Update CCAs
  const newUserCcasDatabase: number[] = []
  ccas?.map((cca) => {
    newUserCcasDatabase.push(cca.ccaID)
  })
  const updateUserJson = {
    userID: user.userID,
    ccaID: newUserCcasDatabase,
  }
  dispatch(addUserCca(updateUserJson))
}

export const addUserCca = (cca: { userID: string; ccaID: number[] }) => () => {
  fetch('https://rhappevents.rhdevs.repl.co/user_CCA/add', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cca),
  })
    .then((resp) => resp)
    .then((data) => {
      if (data.ok) {
        console.log('add CCA success')
      }
    })
}

export const handleCCADetails = (actionType: 'Delete' | 'Add', newCca: UserCCA) => (
  dispatch: Dispatch<ActionTypes>,
  getState: GetState,
) => {
  const { ccas } = getState().profile
  const newUserCcas = ccas

  // user.cca = ["rhdevs", "rhmp"]
  switch (actionType) {
    case 'Delete':
      // newUserCcas.remove(newCCA)
      for (let i = 0; i < newUserCcas.length; i++)
        if (newUserCcas[i].ccaName === newCca.ccaName) {
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

  // 1. updatestate
  dispatch({ type: PROFILE_ACTIONS.UPDATE_USER_CCAS, newCCAs: newUserCcas })
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

  // 1. updatestate
  dispatch({ type: PROFILE_ACTIONS.UPDATE_USER_MODULES, newModules: newUserModules })
}
