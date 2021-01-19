import axios from 'axios'
import { Dispatch, GetState } from '../types'
import { ActionTypes, Post, SOCIAL_ACTIONS, User, POSTS_FILTER } from './types'
import { DOMAIN_URL, ENDPOINTS, DOMAINS, post, del } from '../endpoints'
import { cloneDeep } from 'lodash'

export const GetPostDetailsToEdit = (postId: string) => (dispatch: Dispatch<ActionTypes>) => {
  const postToEdit: Post = {
    postId: postId,
    title: 'Whats up Losers',
    ownerId: '1',
    date: new Date(),
    isOfficial: true,
    ccaId: '2',
    description:
      'Hi I’m a RHapper! I like to eat cheese and fish. My favourite colour is black and blue. Please be my friend thank you!!!',
    postPics: [
      'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
    ],
  }

  dispatch({
    type: SOCIAL_ACTIONS.GET_POST_DETAILS_TO_EDIT,
    postToEdit: postToEdit,
    newPostTitle: postToEdit.title,
    newPostBody: postToEdit.description,
    newPostImages: postToEdit.postPics,
    newPostOfficial: postToEdit.isOfficial,
  })
}

export const ResetPostDetails = () => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SOCIAL_ACTIONS.EDIT_NEW_FIELDS,
    newPostTitle: '',
    newPostBody: '',
    newPostImages: [],
    newPostOfficial: false,
  })
}

export const handleEditPost = () => () => {
  // TODO: push a snackbar @ homepage. (HOME Reducer)
}

export const handleCreatePost = () => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  // TODO: push a snackbar @ homepage. (HOME Reducer)
  console.log('Creating post')
  const { newPostTitle, newPostBody, newPostOfficial } = getState().social
  const requestBody = {
    title: newPostTitle,
    description: newPostBody,
    userID: 'A1234567B',
    isOfficial: newPostOfficial,
    // postPics: [],
    // ccaID: 1,
    // createdAt: 1500000001,
  }
  console.log('Creating post')
  post(ENDPOINTS.ALL_POSTS, DOMAINS.SOCIAL, requestBody).then((res) => console.log(res))
}

export const DeleteImage = (urlToDelete: string) => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { newPostTitle, newPostBody, newPostOfficial } = getState().social
  let { newPostImages } = getState().social
  newPostImages = newPostImages?.filter((url) => {
    return url !== urlToDelete
  })

  dispatch({
    type: SOCIAL_ACTIONS.EDIT_NEW_FIELDS,
    newPostTitle: newPostTitle,
    newPostBody: newPostBody,
    newPostImages: newPostImages,
    newPostOfficial: newPostOfficial,
  })
}

export const AddImage = (e: React.ChangeEvent<HTMLInputElement>) => (
  dispatch: Dispatch<ActionTypes>,
  getState: GetState,
) => {
  dispatch({ type: SOCIAL_ACTIONS.SET_IS_UPLOADING, isUploading: true })
  const { warnings, newPostImages } = getState().social
  e.preventDefault()

  const reader = new FileReader()
  const files = e.target.files ?? []
  const file = files.length > 0 ? files[0] : null
  if (!file) {
    warnings.push('No file selected!')
  } else if (!file.type.match('image.*')) {
    warnings.push('File is not a photo!')
  } else {
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      if (newPostImages.length > 2) {
        warnings.push('The limit is 3 photos!')
      }
      // TODO: Upload images to cloud, and delete
      const newUrl =
        reader.result && !(reader.result instanceof ArrayBuffer) && newPostImages.length < 3
          ? [...newPostImages, reader.result]
          : newPostImages

      dispatch({
        type: SOCIAL_ACTIONS.ADD_IMAGE,
        newPostImages: newUrl,
      })
    }
  }
  dispatch({ type: SOCIAL_ACTIONS.SET_IS_UPLOADING, isUploading: false })
  dispatch({
    type: SOCIAL_ACTIONS.SET_WARNINGS,
    warnings: warnings,
  })
}

export const PopWarning = () => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { warnings } = getState().social
  warnings.pop()
  dispatch({
    type: SOCIAL_ACTIONS.SET_WARNINGS,
    warnings: warnings,
  })
}

export const EditPostDetail = (fieldName: string, fieldData: string) => (
  dispatch: Dispatch<ActionTypes>,
  getState: GetState,
) => {
  let { newPostTitle, newPostBody, newPostOfficial } = getState().social
  const { newPostImages } = getState().social

  switch (fieldName) {
    case 'title':
      newPostTitle = fieldData
      break
    case 'body':
      newPostBody = fieldData
      break
    case 'official':
      newPostOfficial = !newPostOfficial
      break
    case 'postImage':
      if (fieldData) {
        newPostImages.push(fieldData)
      }
      break
  }

  dispatch({
    type: SOCIAL_ACTIONS.EDIT_NEW_FIELDS,
    newPostTitle: newPostTitle,
    newPostBody: newPostBody,
    newPostImages: newPostImages,
    newPostOfficial: newPostOfficial,
  })
}

export const GetPosts = (postFilter: POSTS_FILTER, limit?: number, userId?: string) => async (
  dispatch: Dispatch<ActionTypes>,
) => {
  let url: string = DOMAIN_URL.SOCIAL
  switch (postFilter) {
    case POSTS_FILTER.OFFICIAL:
      url += ENDPOINTS.OFFICIAL_POSTS
      break
    case POSTS_FILTER.ALL:
      url += ENDPOINTS.ALL_POSTS
      break
    case POSTS_FILTER.FRIENDS:
      url += `${ENDPOINTS.FRIENDS_OF_USER_POSTS}?N=${limit}&userID=${userId}`
      break
    default:
      url += ENDPOINTS.ALL_POSTS
      break
  }

  const response = await axios.get(url)
  const posts = response.data
  console.log(posts)
  const transformedPost = cloneDeep(posts).map((post) => {
    post.date = post.createdAt
    post.postId = post.postID
    post.ccaId = post.ccaID
    post.userId = post.userID
    post.date = new Date(post.createdAt)
    return post
  })

  dispatch({
    type: SOCIAL_ACTIONS.GET_POSTS,
    posts: transformedPost,
  })
}

export const DeletePost = (postIdToDelete: string) => async (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { posts } = getState().social
  const newPosts = posts.filter((post) => {
    return post.postId !== postIdToDelete
  })

  const requestBody = {
    postId: postIdToDelete
  }
  const response = await del(ENDPOINTS.DELETE_POST, DOMAINS.SOCIAL, requestBody)
  console.log(response)
  dispatch({
    type: SOCIAL_ACTIONS.DELETE_POST,
    posts: newPosts,
  })
}

export const SetPostUser = (userId: string) => (dispatch: Dispatch<ActionTypes>) => {
  // TODO: Fetch user's details from users table
  const userDetails: User = {
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    initials: 'ZGG',
    name: 'Zhou Gou Gou',
    userId: userId,
    block: '8',
  }

  dispatch({
    type: SOCIAL_ACTIONS.SET_POST_USER,
    postUser: userDetails,
  })
}

export const SwitchPostsFilter = (postsFilter: POSTS_FILTER) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SOCIAL_ACTIONS.SWITCH_POSTS_FILTER,
    postsFilter,
  })
}

export const GetSpecificPost = (postId: string) => async (dispatch: Dispatch<ActionTypes>) => {
  const response = await axios.get(`${DOMAIN_URL.SOCIAL}${ENDPOINTS.SPECIFIC_POST}?postID=${postId}`)
  const specificPost = response.data
  console.log('Specific post', specificPost)

  dispatch({
    type: SOCIAL_ACTIONS.GET_SPECIFIC_POST,
    viewPost: specificPost,
  })
}
