import { Reducer } from 'redux'
import { ActionTypes, Post, PROFILE_ACTIONS, User, UserCCA } from './types'

export const initialState = {
  user: {
    _id: '0',
    userID: localStorage.username,
    profilePictureUrl:
      'https://ichef.bbci.co.uk/news/1024/cpsprodpb/151AB/production/_111434468_gettyimages-1143489763.jpg',
    displayName: 'Your Profile is Loading',
    telegramHandle: 'zhoumm',
    block: 8,
    bio: 'This is my bio hur hur',
    modules: [],
  },
  posts: [],
  ccas: [],
  newDisplayName: '',
  newTelegramHandle: '',
  newBio: '',
  newCCAs: [],
  newModules: [],
  friends: [],
  allCcas: [],
  token: localStorage.getItem('token'),
  isLoggedIn: null,
  isLoading: false,
  hasChanged: false,
}

type State = {
  user: User
  posts: Post[]
  ccas: UserCCA[]
  newDisplayName: string
  newTelegramHandle: string
  newBio: string
  newCCAs: UserCCA[]
  newModules: string[]
  friends: User[]
  allCcas: UserCCA[]
  token: string | null
  isLoggedIn: boolean | null
  isLoading: boolean
  hasChanged: boolean
}

export const profile: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case PROFILE_ACTIONS.SET_USER_DETAILS: {
      return {
        ...state,
        user: action.user,
      }
    }
    case PROFILE_ACTIONS.SET_USER_CCAS: {
      return {
        ...state,
        ccas: action.ccas,
      }
    }
    case PROFILE_ACTIONS.SET_ALL_CCAS: {
      return {
        ...state,
        allCcas: action.allCcas,
      }
    }
    case PROFILE_ACTIONS.SET_USER_FRIENDS: {
      return {
        ...state,
        friends: action.friends,
      }
    }
    case PROFILE_ACTIONS.EDIT_USER_DETAILS: {
      return {
        ...state,
        newDisplayName: action.newDisplayName,
        newTelegramHandle: action.newTelegramHandle,
        newBio: action.newBio,
        newCCAs: action.newCCAs,
        newModules: action.newModules,
      }
    }
    case PROFILE_ACTIONS.UPDATE_USER_CCAS: {
      return {
        ...state,
        newCCAs: action.newCCAs,
      }
    }
    case PROFILE_ACTIONS.UPDATE_USER_MODULES: {
      return {
        ...state,
        newModules: action.newModules,
      }
    }
    case PROFILE_ACTIONS.UPDATE_CURRENT_USER: {
      return {
        ...state,
        user: action.user,
        ccas: action.ccas,
      }
    }
    case PROFILE_ACTIONS.SET_IS_LOGGED_IN: {
      return {
        ...state,
        isLoggedIn: action.isLoggedIn,
      }
    }
    case PROFILE_ACTIONS.SET_USER_POSTS: {
      return {
        ...state,
        posts: action.posts,
      }
    }
    case PROFILE_ACTIONS.SET_IS_LOADING: {
      return {
        ...state,
        isLoading: action.isLoading,
      }
    }
    case PROFILE_ACTIONS.SET_HAS_CHANGED: {
      return {
        ...state,
        hasChanged: action.hasChanged,
      }
    }
    default:
      return state
  }
}
