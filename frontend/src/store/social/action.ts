import axios from 'axios'
import { Dispatch, GetState } from '../types'
import { ActionTypes, SOCIAL_ACTIONS, POSTS_FILTER } from './types'
import { DOMAIN_URL, ENDPOINTS, DOMAINS, post, put, del, get } from '../endpoints'
import { cloneDeep, intersection } from 'lodash'
import useSnackbar from '../../hooks/useSnackbar'

const [success] = useSnackbar('success')

export const getUserDetail = () => (dispatch: Dispatch<ActionTypes>) => {
  const userID = localStorage.getItem('userID')
  get(ENDPOINTS.USER_DETAILS, DOMAINS.SOCIAL, '/' + userID).then((response) => {
    if (response === '' || response === undefined) {
      console.log(response.err)
    } else {
      dispatch({
        type: SOCIAL_ACTIONS.GET_USER_DETAIL,
        userId: response.userID,
        avatar: response.profilePictureUrl,
        name: response.displayName,
        position: response.position,
      })
    }
  })
}

export const GetPostDetailsToEdit = () => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { postId } = getState().social
  dispatch(GetSpecificPost(postId)).then(() => {
    const { viewPost } = getState().social
    const { title, description, postPics, isOfficial, userId } = viewPost
    dispatch({
      type: SOCIAL_ACTIONS.GET_POST_DETAILS_TO_EDIT,
      postToEdit: viewPost,
      newPostTitle: title,
      newPostBody: description,
      newPostImages: postPics ?? [],
      newPostOfficial: isOfficial,
      newPostCca: '',
      userId: userId,
    })
  })
}

export const ResetPostDetails = () => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { position } = getState().social

  dispatch({
    type: SOCIAL_ACTIONS.EDIT_NEW_FIELDS,
    newPostTitle: '',
    newPostBody: '',
    newPostImages: [],
    newPostOfficial: false,
    newPostCca: position[0]?.name,
  })
}

export const handleEditPost = () => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { newPostTitle, newPostBody, newPostOfficial, viewPost, newPostImages, newPostCca } = getState().social
  const requestBody = {
    postID: viewPost.postId,
    ccaID: newPostCca,
    title: newPostTitle,
    description: newPostBody,
    isOfficial: newPostOfficial,
    postPics: newPostImages,
  }
  put(ENDPOINTS.EDIT_POST, DOMAINS.SOCIAL, requestBody).then((res) => {
    dispatch(GetPosts(POSTS_FILTER.ALL))
    success('Post edited!')
  })
}

export const handleCreatePost = () => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { newPostTitle, newPostBody, newPostOfficial, newPostImages, newPostCca } = getState().social

  const requestBody = {
    title: newPostTitle,
    description: newPostBody,
    userID: localStorage.getItem('userID'),
    isOfficial: newPostOfficial,
    postPics: newPostImages ?? [],
    ccaID: newPostCca,
  }

  post(ENDPOINTS.CREATE_POSTS, DOMAINS.SOCIAL, requestBody).then((res) => {
    dispatch(GetPosts(POSTS_FILTER.ALL))
    success('Post created!')
  })
}

export const DeleteImage = (urlToDelete: string) => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { newPostTitle, newPostBody, newPostOfficial, newPostCca } = getState().social
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
    newPostCca: newPostCca,
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
  let { newPostTitle, newPostBody, newPostOfficial, newPostCca } = getState().social
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
    case 'cca':
      if (fieldData) {
        newPostCca = fieldData
      }
      break
  }

  dispatch({
    type: SOCIAL_ACTIONS.EDIT_NEW_FIELDS,
    newPostTitle: newPostTitle,
    newPostBody: newPostBody,
    newPostImages: newPostImages,
    newPostOfficial: newPostOfficial,
    newPostCca: newPostCca,
  })
}

export const GetPosts = (postFilter: POSTS_FILTER, limit?: number, userId?: string) => async (
  dispatch: Dispatch<ActionTypes>,
  getState: GetState,
) => {
  dispatch(SetIsLoading(true))
  let endpoint: ENDPOINTS
  const { posts } = getState().social

  switch (postFilter) {
    case POSTS_FILTER.OFFICIAL:
      endpoint = ENDPOINTS.OFFICIAL_POSTS
      break
    case POSTS_FILTER.ALL:
      endpoint = ENDPOINTS.ALL_POSTS
      break
    case POSTS_FILTER.FRIENDS:
      endpoint = ENDPOINTS.FRIENDS_OF_USER_POSTS
      break
    default:
      endpoint = ENDPOINTS.ALL_POSTS
      break
  }

  // const subroute: string = postFilter === POSTS_FILTER.FRIENDS ? `?N=${limit}&userID=${userId}` : ''

  const subroute: string = postFilter != POSTS_FILTER.OFFICIAL ? `?N=${limit}&userID=${userId}` : `?N=${limit}`

  get(endpoint, DOMAINS.SOCIAL, subroute).then((response) => {
    if (response.length > 0) {
      const transformedPost = cloneDeep(response).map((post) => {
        post.date = post.createdAt
        post.postId = post.postID
        post.ccaId = post.ccaID
        post.userId = post.userID
        post.date = new Date(post.createdAt)
        return post
      })

      //validate if caller made repeated call to the same posts
      const transformedPostID = transformedPost.map((post) => post.postId)
      const postLastID = posts.slice(posts.length - transformedPostID.length).map((post) => post.postId)
      if (intersection(transformedPostID, postLastID).length === 0) {
        dispatch({
          type: SOCIAL_ACTIONS.GET_POSTS,
          posts: posts.concat(transformedPost),
        })
      } else {
        //do nothing
        //repeated call so do not concat same posts to existing posts
      }
    } else {
      dispatch({
        type: SOCIAL_ACTIONS.SET_HAS_NO_MORE_POSTS,
        hasNoMorePosts: true,
      })
    }
    dispatch(SetIsLoading(false))
  })
}

export const DeletePost = (postIdToDelete: string) => async (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { posts } = getState().social
  const newPosts = posts.filter((post) => {
    return post.postId !== postIdToDelete
  })

  const response = await del(ENDPOINTS.DELETE_POST, DOMAINS.SOCIAL, {}, `?postID=${postIdToDelete}`)
  dispatch({
    type: SOCIAL_ACTIONS.DELETE_POST,
    posts: newPosts,
  })
}

export const SwitchPostsFilter = (postsFilter: POSTS_FILTER) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(SetHasNoMorePosts(false))
  dispatch({
    type: SOCIAL_ACTIONS.SWITCH_POSTS_FILTER,
    postsFilter,
    pageIndex: 0,
    posts: [],
  })
}

export const SetPostId = (postId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SOCIAL_ACTIONS.SET_POST_ID,
    postId,
  })
}

export const GetSpecificPost = (postId: string) => async (dispatch: Dispatch<ActionTypes>) => {
  const response = await axios.get(`${DOMAIN_URL.SOCIAL}${ENDPOINTS.SPECIFIC_POST}?postID=${postId}`)
  const specificPost = response.data

  const { postID, title, createdAt, ccaID, isOfficial, description, postPics, name, userID } = specificPost
  const newPost = {
    name: name,
    userId: userID,
    postId: postID,
    title: title,
    isOfficial: isOfficial,
    ccaId: ccaID,
    description: description,
    postPics: postPics,
    createdAt: createdAt,
  }
  dispatch({
    type: SOCIAL_ACTIONS.GET_SPECIFIC_POST,
    viewPost: newPost,
  })
}

export const IncreasePageIndex = () => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { pageIndex, postsFilter } = getState().social
  const { userID } = getState().profile.user

  const newPageIndex = pageIndex + 1

  dispatch(GetPosts(postsFilter, newPageIndex, userID))
  dispatch({
    type: SOCIAL_ACTIONS.INCREASE_PAGE_INDEX,
    pageIndex: newPageIndex,
  })
}

export const SetIsLoading = (isLoading: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SOCIAL_ACTIONS.SET_IS_LOADING,
    isLoading: isLoading,
  })
}

export const SetHasNoMorePosts = (hasNoMorePosts: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SOCIAL_ACTIONS.SET_HAS_NO_MORE_POSTS,
    hasNoMorePosts: hasNoMorePosts,
  })
}
