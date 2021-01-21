export type Post = {
  postId: number
  title: string
  ownerId: number
  date: number
  isOfficial: boolean
  ccaId?: number
  description: string
  postPics: string[]
}

export type User = {
  userId: number
  avatar?: string
  name: string
  initials: string
  block: string
}

export type Friend = {
  bio: string
  block: number
  displayName: string
  modules: string[]
  profilePictureUrl: string
  telegramHandle: string
  userID: string
}

export enum SOCIAL_ACTIONS {
  GET_POST_DETAILS_TO_EDIT = 'SOCIAL_ACTIONS.GET_POST_DETAILS_TO_EDIT',
  EDIT_NEW_FIELDS = 'SOCIAL_ACTIONS.EDIT_NEW_FIELDS',
  SET_WARNINGS = 'SOCIAL_ACTIONS.SET_WARNINGS',
  ADD_IMAGE = 'SOCIAL_ACTIONS.ADD_IMAGE',
  SET_IS_UPLOADING = 'SOCIAL_ACTIONS.SET_IS_UPLOADING',
  GET_POSTS = 'SOCIAL_ACTIONS.GET_POSTS',
  DELETE_POST = 'DELETE_POST',
  SET_POST_USER = 'SET_POST_USER',
}

type SetIsUploading = {
  type: typeof SOCIAL_ACTIONS.SET_IS_UPLOADING
  isUploading: boolean
}

type GetPostDetailsToEdit = {
  type: typeof SOCIAL_ACTIONS.GET_POST_DETAILS_TO_EDIT
  postToEdit: Post
  newPostTitle: string
  newPostBody: string
  newPostImages: string[]
  newPostOfficial: boolean
}

type EditNewfields = {
  type: typeof SOCIAL_ACTIONS.EDIT_NEW_FIELDS
  newPostTitle: string
  newPostBody: string
  newPostImages: string[]
  newPostOfficial: boolean
}

type SetWarnings = {
  type: typeof SOCIAL_ACTIONS.SET_WARNINGS
  warnings: string[]
}

type AddImage = {
  type: typeof SOCIAL_ACTIONS.ADD_IMAGE
  newPostImages: string[]
}

type GetPosts = {
  type: typeof SOCIAL_ACTIONS.GET_POSTS
  posts: Post[]
}

type DeletePost = {
  type: typeof SOCIAL_ACTIONS.DELETE_POST
  posts: Post[]
}

type SetPostUser = {
  type: typeof SOCIAL_ACTIONS.SET_POST_USER
  postUser: User
}

export type ActionTypes =
  | GetPostDetailsToEdit
  | EditNewfields
  | SetWarnings
  | AddImage
  | SetIsUploading
  | GetPosts
  | DeletePost
  | SetPostUser
