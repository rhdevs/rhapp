import { Reducer } from 'redux'
import { ActionTypes, Post, SOCIAL_ACTIONS, User, POSTS_FILTER } from './types'

const initialState = {
  isUploading: false,
  postToEdit: null,
  newPostTitle: '',
  newPostBody: '',
  newPostImages: [],
  newPostOfficial: false,
  warnings: [],
  posts: [],
  postUser: null,
  postsFilter: POSTS_FILTER.ALL,
}

type State = {
  isUploading: boolean
  postToEdit: Post | null
  newPostTitle: string
  newPostBody: string
  newPostImages: string[]
  newPostOfficial: boolean
  warnings: string[]
  posts: Post[]
  postUser: User | null
  postsFilter: POSTS_FILTER
}

export const social: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case SOCIAL_ACTIONS.GET_POST_DETAILS_TO_EDIT: {
      return {
        ...state,
        PostToEdit: action.postToEdit,
        newPostTitle: action.newPostTitle,
        newPostBody: action.newPostBody,
        newPostImages: action.newPostImages,
        newPostOfficial: action.newPostOfficial,
      }
    }

    case SOCIAL_ACTIONS.EDIT_NEW_FIELDS: {
      return {
        ...state,
        newPostTitle: action.newPostTitle,
        newPostBody: action.newPostBody,
        newPostImages: action.newPostImages,
        newPostOfficial: action.newPostOfficial,
      }
    }

    case SOCIAL_ACTIONS.SET_WARNINGS: {
      return {
        ...state,
        warnings: action.warnings,
      }
    }

    case SOCIAL_ACTIONS.ADD_IMAGE: {
      return {
        ...state,
        newPostImages: action.newPostImages,
      }
    }

    case SOCIAL_ACTIONS.SET_IS_UPLOADING: {
      return {
        ...state,
        isUploading: action.isUploading,
      }
    }

    case SOCIAL_ACTIONS.GET_POSTS: {
      return {
        ...state,
        posts: action.posts,
      }
    }

    case SOCIAL_ACTIONS.DELETE_POST: {
      return {
        ...state,
        posts: action.posts,
      }
    }

    case SOCIAL_ACTIONS.SET_POST_USER: {
      return {
        ...state,
        postUser: action.postUser,
      }
    }

    case SOCIAL_ACTIONS.SWITCH_POSTS_FILTER: {
      return {
        ...state,
        postsFilter: action.postsFilter,
      }
    }

    default:
      return state
  }
}
