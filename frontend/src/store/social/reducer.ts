import { Reducer } from 'redux'
import { ActionTypes, Post, SOCIAL_ACTIONS } from './types'

const initialState = {
  postToEdit: null,
}

type State = {
  postToEdit: Post | null
}

export const social: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case SOCIAL_ACTIONS.GET_POST_DETAILS_TO_EDIT: {
      return {
        ...state,
        PostToEdit: action.postToEdit,
      }
    }

    default:
      return state
  }
}
