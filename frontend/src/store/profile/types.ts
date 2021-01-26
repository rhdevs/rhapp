import { Post } from '../social/types'

export type User = {
  userID: string
  profilePictureUrl: string
  displayName: string
  telegramHandle: string
  block: number
  bio: string
  modules: string[]
  posts: Post[]
}

export type Friend = {
  friendId: number
  name: string
  telegram: string
  avatar?: string
}

export type UserCCA = {
  userID: string
  ccaID: number
  ccaName: string
}

export enum PROFILE_ACTIONS {
  SET_USER_DETAILS = 'PROFILE_ACTIONS.SET_USER_DETAILS',
  SET_USER_CCAS = 'PROFILE_ACTIONS.SET_USER_CCAS',
  SET_ALL_CCAS = 'PROFILE_ACTIONS.SET_ALL_CCAS',
  SET_USER_FRIENDS = 'PROFILE_ACTIONS.SET_USER_FRIENDS',
  EDIT_USER_DETAILS = 'PROFILE_ACTIONS.EDIT_USER_DETAILS',
  UPDATE_CURRENT_USER = 'PROFILE_ACTIONS.UPDATE_CURRENT_USER',
  UPDATE_USER_MODULES = 'PROFILE_ACTIONS.UPDATE_USER_MODULES',
  UPDATE_USER_CCAS = 'PROFILE_ACTIONS.UPDATE_USER_CCAS',
}

type SetUserDetails = {
  type: typeof PROFILE_ACTIONS.SET_USER_DETAILS
  user: User
}

type SetUserCcas = {
  type: typeof PROFILE_ACTIONS.SET_USER_CCAS
  ccas: UserCCA[]
}

type SetAllCcas = {
  type: typeof PROFILE_ACTIONS.SET_ALL_CCAS
  allCcas: UserCCA[]
}

type SetUserFriends = {
  type: typeof PROFILE_ACTIONS.SET_USER_FRIENDS
  friends: User[]
}

type EditUserDetails = {
  type: typeof PROFILE_ACTIONS.EDIT_USER_DETAILS
  newDisplayName: string
  newTelegramHandle: string
  newBio: string
  newCCAs: UserCCA[]
  newModules: string[]
}

type UpdateCurrentUser = {
  type: typeof PROFILE_ACTIONS.UPDATE_CURRENT_USER
  user: User
  ccas: UserCCA[]
}

type UpdateUserModules = {
  type: typeof PROFILE_ACTIONS.UPDATE_USER_MODULES
  newModules: string[]
}

type UpdateUserCcas = {
  type: typeof PROFILE_ACTIONS.UPDATE_USER_CCAS
  newCCAs: UserCCA[]
}

export type ActionTypes =
  | SetUserDetails
  | EditUserDetails
  | UpdateCurrentUser
  | UpdateUserModules
  | UpdateUserCcas
  | SetUserCcas
  | SetUserFriends
  | SetAllCcas
