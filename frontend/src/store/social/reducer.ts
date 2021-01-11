import { Reducer } from 'redux'
import { ActionTypes, Post, SOCIAL_ACTIONS } from './types'

const initialState = {
  isUploading: false,
  postToEdit: null,
  newPostTitle: '',
  newPostBody: '',
  newPostImages: [],
  newPostOfficial: false,
  warnings: [],
}

type State = {
  isUploading: boolean
  postToEdit: Post | null
  newPostTitle: string
  newPostBody: string
  newPostImages: string[]
  newPostOfficial: boolean
  warnings: string[]
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

    default:
      return state
  }
}
