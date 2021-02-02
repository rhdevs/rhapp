import axios from 'axios'
import { Dispatch, GetState } from '../types'
import { ActionTypes, SOCIAL_ACTIONS, POSTS_FILTER } from './types'
import { DOMAIN_URL, ENDPOINTS, DOMAINS, post, put, del, get } from '../endpoints'
import { cloneDeep } from 'lodash'
import useSnackbar from '../../hooks/useSnackbar'
import { userProfileStub } from '../../store/stubs'

const [success] = useSnackbar()

export const GetPostDetailsToEdit = () => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { postId } = getState().social
  dispatch(GetSpecificPost(postId)).then(() => {
    const { viewPost } = getState().social
    const { title, description, postPics, isOfficial, userId, tag } = viewPost
    dispatch({
      type: SOCIAL_ACTIONS.GET_POST_DETAILS_TO_EDIT,
      postToEdit: viewPost,
      newPostTitle: title,
      newPostBody: description,
      newPostImages: postPics ?? [],
      newPostOfficial: isOfficial,
      newPostTag: tag,
      userId: userId,
    })
  })
}

export const ResetPostDetails = () => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  // TODO: Get roles from user

  const { position } = getState().profile.user

  dispatch({
    type: SOCIAL_ACTIONS.EDIT_NEW_FIELDS,
    newPostTitle: '',
    newPostBody: '',
    newPostImages: [],
    newPostOfficial: false,
    newPostTag: position[0] ?? null,
  })
}

export const handleEditPost = () => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  console.log('Editing post')
  const { newPostTitle, newPostBody, newPostOfficial, viewPost, newPostImages, newPostTag } = getState().social
  console.log(viewPost)
  const requestBody = {
    postID: viewPost.postId,
    ccaID: 5, // TODO: Change to tags
    title: newPostTitle,
    description: newPostBody,
    isOfficial: newPostOfficial,
    postPics: newPostImages,
    tags: newPostTag,
  }
  put(ENDPOINTS.EDIT_POST, DOMAINS.SOCIAL, requestBody).then((res) => {
    dispatch(GetPosts(POSTS_FILTER.ALL))
    success('Post edited!')
    console.log(res)
  })
}

export const handleCreatePost = () => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  console.log('Creating post')
  const { newPostTitle, newPostBody, newPostOfficial, newPostImages, newPostTag } = getState().social
  const requestBody = {
    title: newPostTitle,
    description: newPostBody,
    userID: userProfileStub.userID,
    isOfficial: newPostOfficial,
    postPics: newPostImages ?? [],
    ccaID: 1, // TODO: Remove if ccaId not given
    tags: newPostTag,
  }
  post(ENDPOINTS.ALL_POSTS, DOMAINS.SOCIAL, requestBody).then((res) => {
    dispatch(GetPosts(POSTS_FILTER.ALL))
    success('Post created!')
    console.log(res)
  })
}

export const DeleteImage = (urlToDelete: string) => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { newPostTitle, newPostBody, newPostOfficial, newPostTag } = getState().social
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
    newPostTag: newPostTag,
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
  let { newPostTitle, newPostBody, newPostOfficial, newPostTag } = getState().social
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
        newPostTag = fieldData
      }
      break
  }

  dispatch({
    type: SOCIAL_ACTIONS.EDIT_NEW_FIELDS,
    newPostTitle: newPostTitle,
    newPostBody: newPostBody,
    newPostImages: newPostImages,
    newPostOfficial: newPostOfficial,
    newPostTag: newPostTag,
  })
}

export const GetPosts = (postFilter: POSTS_FILTER, limit?: number, userId?: string) => async (
  dispatch: Dispatch<ActionTypes>,
) => {
  let endpoint: ENDPOINTS
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

  const subroute: string = postFilter === POSTS_FILTER.FRIENDS ? `?N=${limit}&userID=${userId}` : ''

  get(endpoint, DOMAINS.SOCIAL, subroute).then((response) => {
    console.log(response)
    const transformedPost = cloneDeep(response)
      .reverse()
      .map((post) => {
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
  })
}

export const DeletePost = (postIdToDelete: string) => async (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { posts } = getState().social
  const newPosts = posts.filter((post) => {
    return post.postId !== postIdToDelete
  })

  console.log(postIdToDelete)
  const response = await del(ENDPOINTS.DELETE_POST, DOMAINS.SOCIAL, {}, `?postID=${postIdToDelete}`)
  console.log('DELETE RESPONSE: ', response)
  dispatch({
    type: SOCIAL_ACTIONS.DELETE_POST,
    posts: newPosts,
  })
}

export const SwitchPostsFilter = (postsFilter: POSTS_FILTER) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SOCIAL_ACTIONS.SWITCH_POSTS_FILTER,
    postsFilter,
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
  console.log('Specific post', specificPost)

  const { postID, title, createdAt, ccaID, isOfficial, description, postPics, name, userID, tags } = specificPost
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
    tag: tags[0],
  }
  dispatch({
    type: SOCIAL_ACTIONS.GET_SPECIFIC_POST,
    viewPost: newPost,
  })
}
