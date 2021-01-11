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

export enum SOCIAL_ACTIONS {
  GET_POST_DETAILS_TO_EDIT = 'SOCIAL_ACTIONS.GET_POST_DETAILS_TO_EDIT',
}

type GetPostDetailsToEdit = {
  type: typeof SOCIAL_ACTIONS.GET_POST_DETAILS_TO_EDIT
  postToEdit: Post
}

export type ActionTypes = GetPostDetailsToEdit
