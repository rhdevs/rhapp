import { Reducer } from 'redux'
import { ActionTypes, Post, SOCIAL_ACTIONS, POSTS_FILTER } from './types'

const initialState = {
  isUploading: false,
  postToEdit: null,
  newPostTitle: '',
  newPostBody: '',
  newPostImages: [],
  newPostOfficial: false,
  newPostCca: '',
  warnings: [],
  posts: [],
  postsFilter: POSTS_FILTER.ALL,
  viewPost: {} as Post,
}

type State = {
  isUploading: boolean
  postToEdit: Post | null
  newPostTitle: string
  newPostBody: string
  newPostImages: string[]
  newPostOfficial: boolean
  newPostCca: string
  warnings: string[]
  posts: Post[]
  postsFilter: POSTS_FILTER
  viewPost: Post
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
        newPostCca: action.newPostCca,
      }
    }

    case SOCIAL_ACTIONS.EDIT_NEW_FIELDS: {
      return {
        ...state,
        newPostTitle: action.newPostTitle,
        newPostBody: action.newPostBody,
        newPostImages: action.newPostImages,
        newPostOfficial: action.newPostOfficial,
        newPostCca: action.newPostCca,
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

    case SOCIAL_ACTIONS.SWITCH_POSTS_FILTER: {
      return {
        ...state,
        postsFilter: action.postsFilter,
      }
    }

    case SOCIAL_ACTIONS.GET_SPECIFIC_POST: {
      return {
        ...state,
        viewPost: action.viewPost,
      }
    }

    default:
      return state
  }
}
