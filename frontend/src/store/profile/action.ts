import { DOMAIN_URL, ENDPOINTS } from '../endpoints'
import { Dispatch, GetState } from '../types'
import { ActionTypes, PROFILE_ACTIONS, User, UserCCA } from './types'

// export const checkIsLoggedIn = () => (dispatch: Dispatch<ActionTypes>) => {
//   const token = localStorage.token
//   console.log(token)
//   if (token) {
//     fetch(DOMAIN_URL.SOCIAL + ENDPOINTS.IS_LOGGEDIN + '?token=' + token, {
//       method: 'GET',
//       mode: 'no-cors',
//     }).then((resp) => {
//       console.log(resp)
//       if (resp.status !== 200) {
//         dispatch({ type: PROFILE_ACTIONS.SET_IS_LOGGED_IN, isLoggedIn: true })
//       } else {
//         dispatch({ type: PROFILE_ACTIONS.SET_IS_LOGGED_IN, isLoggedIn: false })
//       }
//     })
//   } else {
//     console.log('notoken sob')
//     dispatch({ type: PROFILE_ACTIONS.SET_IS_LOGGED_IN, isLoggedIn: false })
//   }
// }

export const fetchUserDetails = (userID: string | null) => (dispatch: Dispatch<ActionTypes>) => {
  if (userID !== null) {
    dispatch(setIsLoading(true))
    fetch('https://rhappsocial.rhdevs.repl.co/profile/' + userID, {
      method: 'GET',
    })
      .then((resp) => resp.json())
      .then((data) => {
        dispatch({ type: PROFILE_ACTIONS.SET_USER_DETAILS, user: data[0] })
      })
      .catch((err) => console.log(err))
  }
  dispatch(setIsLoading(false))
}

export const fetchUserCCAs = (userID: string | null) => (dispatch: Dispatch<ActionTypes>) => {
  if (userID !== null) {
    dispatch(setIsLoading(true))
    fetch(DOMAIN_URL.EVENT + ENDPOINTS.USER_CCAS + '/' + userID, {
      method: 'GET',
    })
      .then((resp) => resp.json())
      .then((data) => {
        dispatch({ type: PROFILE_ACTIONS.SET_USER_CCAS, ccas: data })
      })
      .catch((err) => console.log(err))
  }
  dispatch(setIsLoading(false))
}

export const fetchAllCCAs = () => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  fetch(DOMAIN_URL.EVENT + ENDPOINTS.ALL_CCAS, {
    method: 'GET',
  })
    .then((resp) => resp.json())
    .then((data) => {
      dispatch({ type: PROFILE_ACTIONS.SET_ALL_CCAS, allCcas: data })
    })
  dispatch(setIsLoading(false))
}

export const fetchUserFriends = (userID: string | null) => async (dispatch: Dispatch<ActionTypes>) => {
  if (userID != null) {
    dispatch(setIsLoading(true))
    await fetch(DOMAIN_URL.SOCIAL + ENDPOINTS.FRIEND + '/' + userID, {
      method: 'GET',
    })
      .then((resp) => resp.json())
      .then((data) => {
        dispatch({ type: PROFILE_ACTIONS.SET_USER_FRIENDS, friends: data })
      })
      .catch((err) => console.log(err))
  }
  dispatch(setIsLoading(false))
}

export const fetchUserPosts = (userID: string | null) => async (dispatch: Dispatch<ActionTypes>) => {
  if (userID != null) {
    dispatch(setIsLoading(true))
    await fetch('https://rhappsocial.rhdevs.repl.co/post/' + userID, {
      method: 'GET',
    })
      .then((resp) => resp.json())
      .then((data) => {
        dispatch({ type: PROFILE_ACTIONS.SET_USER_POSTS, posts: data })
      })
      .catch((err) => console.log(err))
  }
  dispatch(setIsLoading(false))
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

export const handleEditProfileDetails = (bio: string, displayName: string, telegramHandle: string) => (
  dispatch: Dispatch<ActionTypes>,
  getState: GetState,
) => {
  const { user, newCCAs, newModules, userProfilePictureBase64 } = getState().profile
  const newUser: User = {
    ...user,
    displayName: displayName,
    telegramHandle: telegramHandle,
    bio: bio,
    modules: newModules,
    profilePictureUrl: userProfilePictureBase64,
  }

  // 1. Update local state
  dispatch({
    type: PROFILE_ACTIONS.UPDATE_CURRENT_USER,
    user: newUser,
    ccas: newCCAs,
  })

  // 2. Update database
  dispatch(updateCurrentUser(newUser))
}

// One shot update database with all changes
export const updateCurrentUser = (newUser: User) => async (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { user, ccas } = getState().profile

  dispatch(setIsLoading(true))

  // 1. Update CCAs
  const newUserCcasDatabase: number[] = []
  ccas?.map((cca) => {
    newUserCcasDatabase.push(cca.ccaID)
  })

  const updateUserJson = {
    userID: user.userID,
    ccaID: newUserCcasDatabase,
  }

  // 2. Update user profile
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
        // console.log('update current user success')
        // 1b. Update CCAs here
        dispatch(addUserCca(updateUserJson))
      } else {
        dispatch(setCanPush('error'))
      }
    })
    .catch(() => {
      dispatch(setCanPush('error'))
    })
  dispatch(setIsLoading(false))
}

export const addUserCca = (cca: { userID: string; ccaID: number[] }) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  console.log(cca)
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
        // console.log('add CCA success!')
        // If all updates are done, set canPush to true
        dispatch(setCanPush('true'))
      } else {
        dispatch(setCanPush('error'))
      }
    })
    .catch(() => {
      dispatch(setCanPush('error'))
    })
  dispatch(setIsLoading(false))
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

export const setHasChanged = (hasChanged: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: PROFILE_ACTIONS.SET_HAS_CHANGED,
    hasChanged: hasChanged,
  })
}

export const handleNewProfilePicture = (base64TextString: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: PROFILE_ACTIONS.UPDATE_USER_PROFILE_PICTURE, userProfilePictureBase64: base64TextString })
}

export const setIsLoading = (isLoading: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: PROFILE_ACTIONS.SET_IS_LOADING,
    isLoading: isLoading,
  })
}

export const setCanPush = (canPush: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: PROFILE_ACTIONS.SET_CAN_PUSH,
    canPush: canPush,
  })
}
