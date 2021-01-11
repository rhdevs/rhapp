import { Dispatch } from '../types'
import { ActionTypes, Post, SOCIAL_ACTIONS } from './types'

export const GetPostDetailsToEdit = (postId: number) => (dispatch: Dispatch<ActionTypes>) => {
  const postToEdit: Post = {
    postId: postId,
    title: 'Whats up Losers',
    ownerId: 1,
    date: 1610332956,
    isOfficial: true,
    ccaId: 2,
    description:
      'Hi I’m a RHapper! I like to eat cheese and fish. My favourite colour is black and blue. Please be my friend thank you!!!',
    postPics: [
      'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
    ],
  }
  dispatch({ type: SOCIAL_ACTIONS.GET_POST_DETAILS_TO_EDIT, postToEdit: postToEdit })
}
