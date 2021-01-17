export type Post = {
  postId: string
  title: string
  ownerId: string
  date: Date
  isOfficial: boolean
  ccaId?: string
  description: string
  postPics: string[]
}

export type User = {
  userId: string
  avatar?: string
  name: string
  initials: string
  block: string
}

export enum POSTS_FILTER {
  ALL = 'ALL',
  OFFICIAL = 'OFFICIAL',
  FRIENDS = 'FRIENDS',
  USER = 'USER',
}

export enum SOCIAL_ACTIONS {
  GET_POST_DETAILS_TO_EDIT = 'SOCIAL_ACTIONS.GET_POST_DETAILS_TO_EDIT',
  EDIT_NEW_FIELDS = 'SOCIAL_ACTIONS.EDIT_NEW_FIELDS',
  SET_WARNINGS = 'SOCIAL_ACTIONS.SET_WARNINGS',
  ADD_IMAGE = 'SOCIAL_ACTIONS.ADD_IMAGE',
  SET_IS_UPLOADING = 'SOCIAL_ACTIONS.SET_IS_UPLOADING',
  GET_POSTS = 'SOCIAL_ACTIONS.GET_POSTS',
  DELETE_POST = 'SOCIAL_ACTIONS.DELETE_POST',
  SET_POST_USER = 'SOCIAL_ACTIONS.SET_POST_USER',
  SWITCH_POSTS_FILTER = 'SOCIAL_ACTIONS.SWITCH_POSTS_FILTER',
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

type EditNewFields = {
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

type SwitchPostsFilter = {
  type: typeof SOCIAL_ACTIONS.SWITCH_POSTS_FILTER
  postsFilter: POSTS_FILTER
}

export type ActionTypes =
  | GetPostDetailsToEdit
  | EditNewFields
  | SetWarnings
  | AddImage
  | SetIsUploading
  | GetPosts
  | DeletePost
  | SetPostUser
  | SwitchPostsFilter
