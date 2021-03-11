type Timestamp = string // number of milliseconds since January 1, 1970, 00:00:00 UTC

export type Post = {
  postId: string
  title: string
  isOfficial: boolean
  ccaId: number
  description: string
  postPics: string[]
  createdAt?: Timestamp
  name: string
  userId: string
}

export type User = {
  userId: string
  avatar?: string
  name: string
  initials: string
  block: string
  position: Position[]
}

export type Position = {
  ccaID: number
  name: string
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
  SWITCH_POSTS_FILTER = 'SOCIAL_ACTIONS.SWITCH_POSTS_FILTER',
  GET_SPECIFIC_POST = 'SOCIAL_ACTIONS.GET_SPECIFIC_POST',
  SET_POST_ID = 'SOCIAL_ACTIONS.SET_POST_ID',
  INCREASE_PAGE_INDEX = 'SOCIAL_ACTIONS.INCREASE_PAGE_INDEX',
  SET_IS_LOADING = 'SOCIAL_ACTIONS.SET_IS_LOADING',
  SET_HAS_NO_MORE_POSTS = 'SOCIAL_ACTIONS.HAS_NO_MORE_POSTS',
  GET_USER_DETAIL = 'SOCIAL_ACTIONS.GET_USER_DETAIL',
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
  newPostCca: number
  userId: string
}

type EditNewFields = {
  type: typeof SOCIAL_ACTIONS.EDIT_NEW_FIELDS
  newPostTitle: string
  newPostBody: string
  newPostImages: string[]
  newPostOfficial: boolean
  newPostCca: number
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

type SwitchPostsFilter = {
  type: typeof SOCIAL_ACTIONS.SWITCH_POSTS_FILTER
  postsFilter: POSTS_FILTER
  pageIndex: number
  posts: Post[]
}

type SetPostId = {
  type: typeof SOCIAL_ACTIONS.SET_POST_ID
  postId: string
}

type GetSpecificPost = {
  type: typeof SOCIAL_ACTIONS.GET_SPECIFIC_POST
  viewPost: Post
}

type IncreasePageIndex = {
  type: typeof SOCIAL_ACTIONS.INCREASE_PAGE_INDEX
  pageIndex: number
}

type SetIsLoading = {
  type: typeof SOCIAL_ACTIONS.SET_IS_LOADING
  isLoading: boolean
}

type SetHasNoMorePosts = {
  type: typeof SOCIAL_ACTIONS.SET_HAS_NO_MORE_POSTS
  hasNoMorePosts: boolean
}

type GetUserDetail = {
  type: typeof SOCIAL_ACTIONS.GET_USER_DETAIL
  userId: string
  avatar?: string
  name: string
  position: Position[]
}

export type ActionTypes =
  | GetPostDetailsToEdit
  | EditNewFields
  | SetWarnings
  | AddImage
  | SetIsUploading
  | GetPosts
  | DeletePost
  | SwitchPostsFilter
  | SetPostId
  | GetSpecificPost
  | IncreasePageIndex
  | SetIsLoading
  | SetHasNoMorePosts
  | GetUserDetail
