import {
  ActionTypes,
  Filter,
  Food,
  PaymentMethod,
  Restaurants,
  SupperGroup,
  SupperGroupStatus,
  Updates,
} from '../supper/types'
import { SUPPER_ACTIONS } from './types'
import { Dispatch, GetState } from '../types'
import { get, put, post, del, ENDPOINTS, DOMAINS } from '../endpoints'
import useSnackbar from '../../hooks/useSnackbar'

const [error] = useSnackbar('error')

//------------------------ GET --------------------------
export const getSupperNotification = () => (dispatch: Dispatch<ActionTypes>) => {
  get(ENDPOINTS.GET_SUPPER_NOTIFICATIONS, DOMAINS.SUPPER, `/${localStorage.userID}/supperGroupNotification`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_SUPPER_NOTIFICATIONS,
        supperNotifications: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

export const closeSupperNotification = (supperGroupId: number) => (dispatch: Dispatch<ActionTypes>) => {
  const requestBody = { supperGroupId: supperGroupId }
  del(
    ENDPOINTS.CLOSE_SUPPER_NOTIFICATIONS,
    DOMAINS.SUPPER,
    requestBody,
    `/${localStorage.userID}/supperGroupNotification`,
  )
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getSupperNotification())
    })
    .catch((err) => {
      console.log(err)
    })
}

export const getAllSupperGroups = () => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  await get(ENDPOINTS.ALL_SUPPER_GROUPS, DOMAINS.SUPPER)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_ALL_SUPPER_GROUPS,
        allSupperGroups: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      error('Failed to get all supper groups, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const getSupperGroupById = (supperGroupId: string | number | undefined) => async (
  dispatch: Dispatch<ActionTypes>,
) => {
  if (supperGroupId === undefined) return
  dispatch(setIsLoading(true))

  await get(ENDPOINTS.GET_SUPPER_GROUP_BY_ID, DOMAINS.SUPPER, `/${supperGroupId}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_SUPPER_GROUP_BY_ID,
        supperGroup: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      error('Failed to get supper group, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const getSupperHistory = (userId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  get(ENDPOINTS.GET_SUPPER_GROUP_HISTORY, DOMAINS.SUPPER, `/${userId}/supperGroupHistory`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_SUPPER_GROUP_HISTORY,
        supperGroupHistory: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      error('Failed to retrieve supper group history, please try again.')
    })
  dispatch(setIsLoading(false))
}

export const getOrderById = (orderId: string | undefined) => (dispatch: Dispatch<ActionTypes>) => {
  if (!orderId) return
  dispatch(setIsLoading(true))
  get(ENDPOINTS.GET_ORDER_BY_ID, DOMAINS.SUPPER, `/${orderId}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_ORDER_BY_ID,
        order: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      error('Failed to get order, please try again.')
    })
  dispatch(setIsLoading(false))
}

export const getOrderHistory = (userId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  get(ENDPOINTS.GET_ORDER_HISTORY, DOMAINS.SUPPER, `/${userId}/orderHistory`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_ORDER_HISTORY,
        orderHistory: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      error('Failed to retrieve order history, please try again.')
    })
  dispatch(setIsLoading(false))
}

export const getAllRestaurants = () => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  get(ENDPOINTS.ALL_RESTAURANTS, DOMAINS.SUPPER)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_ALL_RESTAURANTS,
        allRestaurants: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      error('Failed to get all restaurants, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const getRestaurant = (restaurantId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  get(ENDPOINTS.GET_RESTAURANT, DOMAINS.SUPPER, `/${restaurantId}/menu`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      console.log(resp.data)
      dispatch({
        type: SUPPER_ACTIONS.GET_RESTAURANT_BY_ID,
        restaurant: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      error('Failed to get restaurant, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const getRestaurantMenu = (restaurantId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  get(ENDPOINTS.GET_RESTAURANT_MENU, DOMAINS.SUPPER, `/${restaurantId}/menu`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_RESTAURANT_MENU,
        menu: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      error('Failed to get restaurant menu, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const getMenuFood = (foodMenuId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  get(ENDPOINTS.GET_MENU_FOOD, DOMAINS.SUPPER, `/${foodMenuId}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_MENU_FOOD,
        foodMenu: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      error('Failed to get food from menu, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const getFoodInOrder = (orderId?: string, foodId?: string) => (dispatch: Dispatch<ActionTypes>) => {
  console.log(orderId, foodId)
  if (!(orderId && foodId)) return
  dispatch(setIsLoading(true))
  get(ENDPOINTS.GET_FOOD, DOMAINS.SUPPER, `/${orderId}/food/${foodId}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_FOOD_BY_ID,
        food: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      error('Failed to get food, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const getCollatedOrder = (supperGroupId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  get(ENDPOINTS.GET_COLLATED_ORDER, DOMAINS.SUPPER, `/${supperGroupId}/collated`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_COLLATED_ORDER,
        collatedOrder: { ...resp.data, price: 0.0 },
      })
    })
    .catch((err) => {
      console.log(err)
      error('Failed to get collated order, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const getUserOrder = (supperGroupId: string | number | undefined, userId: string) => (
  dispatch: Dispatch<ActionTypes>,
) => {
  if (!supperGroupId) return
  dispatch(setIsLoading(true))
  get(ENDPOINTS.GET_USER_ORDER, DOMAINS.SUPPER, `/${supperGroupId}/user/${userId}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      console.log('THIS IS ORDER!!!!!!!!: ', resp.data)
      dispatch({
        type: SUPPER_ACTIONS.GET_ORDER_BY_USER,
        order: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      error("Failed to get user's order, please try again later.")
    })
  dispatch(setIsLoading(false))
}

export const getFilteredSupperGroups = () => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  dispatch(setIsLoading(true))
  const { allSupperGroups, searchValue, closingTimeFilter, amountLeftFilter, restaurantFilter } = getState().supper
  let filteredSearchSupperGroups = allSupperGroups
  if (searchValue) {
    const query = searchValue.toLowerCase()
    filteredSearchSupperGroups = allSupperGroups.filter((supperGroup) => {
      if (supperGroup.ownerName.toLowerCase().includes(query)) return supperGroup
      if (String(supperGroup.supperGroupId)?.toLowerCase().includes(query)) return supperGroup
      if (getReadableSupperGroupId(supperGroup.supperGroupId)?.toLowerCase().includes(query)) return supperGroup
      if (('rhso#' + supperGroup.supperGroupId).includes(query)) return supperGroup
      if (supperGroup.supperGroupName.toLowerCase().includes(query)) return supperGroup
    })
  }
  if (closingTimeFilter == Filter.ASCENDING) {
    filteredSearchSupperGroups.sort((x, y) => (x.closingTime ?? 0) - (y.closingTime ?? 0))
  } else if (closingTimeFilter == Filter.DESCENDING) {
    filteredSearchSupperGroups.sort((x, y) => (y.closingTime ?? 0) - (x.closingTime ?? 0))
  }
  console.log('before sort ', filteredSearchSupperGroups)
  if (amountLeftFilter == Filter.ASCENDING) {
    filteredSearchSupperGroups.sort(
      (x, y) => (x.costLimit ?? Infinity - x.currentFoodCost) - (y.costLimit ?? Infinity - y.currentFoodCost),
    )
    console.log('after sort ', filteredSearchSupperGroups)
  } else if (amountLeftFilter == Filter.DESCENDING) {
    filteredSearchSupperGroups.sort(
      (x, y) => (y.costLimit ?? Infinity - y.currentFoodCost) - (x.costLimit ?? Infinity - x.currentFoodCost),
    )
  }
  if (restaurantFilter.length) {
    filteredSearchSupperGroups = filteredSearchSupperGroups.filter((sg) =>
      restaurantFilter.includes(sg.restaurantName as Restaurants),
    )
  }

  dispatch({
    type: SUPPER_ACTIONS.GET_SEARCHED_SUPPER_GROUPS,
    filteredSupperGroups: filteredSearchSupperGroups,
  })
  dispatch(setIsLoading(false))
}

export const getAllUserJoinedSupperGroup = (userId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  get(ENDPOINTS.GET_JOINED_SUPPER_GROUP_HISTORY, DOMAINS.SUPPER, `/${userId}/joinGroupHistory`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_JOINED_SUPPER_GROUP_HISTORY,
        joinedSupperGroupHistory: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      error('Failed to get joined supper groups, please try again later.')
    })
  dispatch(setIsLoading(false))
}

//------------------------ POST / PUT -------------------------

export const createSupperGroup = (newSupperGroup: SupperGroup) => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))

  let requestBody
  if (newSupperGroup.costLimit === undefined) {
    requestBody = { ...newSupperGroup, costLimit: null }
  } else {
    requestBody = newSupperGroup
  }
  console.log(requestBody)
  await post(ENDPOINTS.ADD_SUPPER_GROUP, DOMAINS.SUPPER, requestBody)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      console.log(resp.data)
      dispatch(setSupperGroup(resp.data.supperGroup))
      dispatch(setNewSupperGroupId(resp.data.supperGroup.supperGroupId))
      dispatch(setIsLoading(false))
    })
    .catch((err) => {
      console.log(err)
      error('Failed to get all supper groups, please try again later.')
      dispatch(setIsLoading(false))
    })
}

export const updateEditFoodItem = (newFoodItem: Food, oldFoodId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  // TODO: Call to database
  console.log(`Order Item Updated on foodId ${oldFoodId}`)
  console.log(`new Food details: ${newFoodItem}`)
}

export const updateSupperGroup = (supperGroupId: string | number, updatedInfo) => (dispatch: Dispatch<ActionTypes>) => {
  if (!(supperGroupId && updatedInfo)) return
  dispatch(setIsLoading(true))
  const requestBody = updatedInfo
  console.log(requestBody)
  put(ENDPOINTS.UPDATE_SUPPER_GROUP, DOMAINS.SUPPER, requestBody, {}, `/${supperGroupId}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getSupperGroupById(supperGroupId))
    })
    .catch((err) => {
      console.log(err)
      error('Failed to update order, please try again.')
    })
  dispatch(setIsLoading(false))
}

export const createOrder = (userId: string, supperGroupId: string | number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  const requestBody = {
    userID: userId,
    supperGroupId: Number(supperGroupId),
  }
  post(ENDPOINTS.CREATE_ORDER, DOMAINS.SUPPER, requestBody, {})
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(setOrderId(resp.data.orderId))
    })
    .catch((err) => {
      console.log(err)
      error('Failed to create order, please try again.')
    })
  dispatch(setIsLoading(false))
}

export const updateOrderDetails = (orderId?: string, newOrderDetails?) => (dispatch: Dispatch<ActionTypes>) => {
  console.log(orderId, newOrderDetails)
  if (!newOrderDetails || !orderId) return
  dispatch(setIsLoading(true))
  const requestBody = newOrderDetails
  put(ENDPOINTS.UPDATE_ORDER_DETAILS, DOMAINS.SUPPER, requestBody, {}, `/${orderId}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      // dispatch(getOrderById(orderId))
    })
    .catch((err) => {
      console.log(err)
      error('Failed to update order, please try again.')
    })
  dispatch(setIsLoading(false))
}

export const addFoodToOrder = (newFood: Food, orderId: string) => (dispatch: Dispatch<ActionTypes>) => {
  const requestBody = newFood
  dispatch(setIsLoading(true))
  post(ENDPOINTS.ADD_FOOD, DOMAINS.SUPPER, requestBody, {}, `/${orderId}/food`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getOrderById(orderId))
    })
    .catch((err) => {
      console.log(err)
      error('Failed to add food, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const updateFoodInOrder = (newFood, orderId: string, foodId: string) => (dispatch: Dispatch<ActionTypes>) => {
  const requestBody = newFood
  dispatch(setIsLoading(true))
  put(ENDPOINTS.EDIT_FOOD, DOMAINS.SUPPER, requestBody, {}, `/${orderId}/food/${foodId}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getOrderById(orderId))
    })
    .catch((err) => {
      console.log(err)
      error('Failed to update food, please try again later.')
    })
  dispatch(setIsLoading(false))
}
//------------------------ DELETE -----------------------

export const deleteSupperGroup = (supperGroupId?: string | number) => (dispatch: Dispatch<ActionTypes>) => {
  if (!supperGroupId) return
  dispatch(setIsLoading(true))
  del(ENDPOINTS.DELETE_SUPPER_GROUP, DOMAINS.SUPPER, {}, `/${supperGroupId}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getAllSupperGroups())
    })
    .catch((err) => {
      console.log(err)
      error('Failed to delete supper group, please try again.')
    })
  dispatch(setIsLoading(false))
}

export const deleteOrder = (supperGroupId: string | number, orderId?: string) => (dispatch: Dispatch<ActionTypes>) => {
  if (!orderId) return
  dispatch(setIsLoading(true))
  del(ENDPOINTS.DELETE_ORDER, DOMAINS.SUPPER, {}, `/${orderId}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getSupperGroupById(supperGroupId))
    })
    .catch((err) => {
      console.log(err)
      error('Failed to delete order, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const deleteFoodInOrder = (orderId: string | undefined, foodId: string | undefined) => (
  dispatch: Dispatch<ActionTypes>,
) => {
  if (!(orderId || foodId)) return
  dispatch(setIsLoading(true))
  del(ENDPOINTS.DELETE_FOOD, DOMAINS.SUPPER, {}, `/${orderId}/food/${foodId}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getOrderById(orderId))
    })
    .catch((err) => {
      console.log(err)
      error('Failed to delete food, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const setIsLoading = (isLoading: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_IS_LOADING,
    isLoading: isLoading,
  })
}

export const setCount = (newCount?: number) => (dispatch: Dispatch<ActionTypes>) => {
  if (newCount === undefined) return
  dispatch({
    type: SUPPER_ACTIONS.SET_COUNT,
    count: newCount,
  })
}

export const setPriceLimit = (newPriceLimit: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_PRICE_LIMIT,
    priceLimit: newPriceLimit,
  })
}

export const setDeliveryTime = (newDeliveryTime: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_DELIVERY_TIME,
    deliveryTime: newDeliveryTime,
  })
}

export const setExpandableCardStatus = (isExpanded: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_EXPANDABLE_CARD_STATUS,
    isExpanded: isExpanded,
  })
}

export const setSelectedPaymentMethod = (selectedPaymentMethod?: PaymentMethod[]) => (
  dispatch: Dispatch<ActionTypes>,
) => {
  if (!selectedPaymentMethod) return
  dispatch({
    type: SUPPER_ACTIONS.SET_SELECTED_PAYMENT_METHOD,
    selectedPaymentMethod: selectedPaymentMethod,
  })
}

export const setSelectedRestaurant = (selectedRestaurant: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_SELECTED_RESTAURANT,
    selectedRestaurant: selectedRestaurant,
  })
}

export const setSelectedSupperGroupStatus = (selectedSupperGroupStatus: SupperGroupStatus | null) => (
  dispatch: Dispatch<ActionTypes>,
) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_SELECTED_SUPPER_GROUP_STATUS,
    selectedSupperGroupStatus: selectedSupperGroupStatus,
  })
}

export const setSearchValue = (query: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_SEARCH_SUPPER_GROUP_VALUE,
    searchValue: query,
  })
}

export const unixTo12HourTime = (unixDate?: number) => {
  if (!unixDate) {
    return '-'
  }
  const date = new Date(unixDate * 1000)
  const hours = '0' + date.getHours()
  const minutes = '0' + date.getMinutes()
  let letters = 'PM'

  if (Number(hours) < 12) {
    letters = 'AM'
  }

  const formattedTime = hours.substr(-2) + ':' + minutes.substr(-2) + letters

  return formattedTime
}

export const unixToFormattedTime = (unixDate?: number) => {
  if (!unixDate) {
    return '-'
  }
  const date = new Date(unixDate * 1000)
  const hours = date.getHours()
  const minutes = '0' + date.getMinutes()
  const seconds = '0' + date.getSeconds()

  const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)

  return formattedTime
}

export const getReadableSupperGroupId = (supperGroupId?: number | string) => {
  if (!supperGroupId) {
    return 'RHSO#'
  }
  const readableSupperGroupId = '0000000000' + supperGroupId
  return String('RHSO#' + readableSupperGroupId.substr(-4))
}

export const setTabsKey = (section: string) => (dispatch: Dispatch<ActionTypes>) => {
  console.log(section === 'created')
  const key = section === 'created' ? '1' : '2'
  console.log(key)
  dispatch({
    type: SUPPER_ACTIONS.SET_TABS_KEY,
    tabsKey: key,
  })
}

export const setSupperGroup = (updatedSupperGroup: SupperGroup) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_SUPPER_GROUP,
    supperGroup: updatedSupperGroup,
  })
}

export const setMenuTabKey = (section: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_MENU_TAB_KEY,
    menuTabKey: section,
  })
}

export const setExpandAll = (isExpandAll: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_EXPAND_ALL,
    isExpandAll: isExpandAll,
  })
}

export const setPaymentExpandedCount = (expandedCount: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_PAYMENT_EXPANDED_COUNT,
    expandedCount: expandedCount,
  })
}

export const setEstimatedArrivalTime = (estArrivalTime: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_ESTIMATED_ARRIVAL_TIME,
    estArrivalTime: unixTo12HourTime(estArrivalTime),
  })
}

export const setEditOrderNumber = (editOrderNumber: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_EDIT_ORDER_NUMBER,
    editOrderNumber: editOrderNumber,
  })
}

export const setCounter = (counter: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_COUNTER,
    counter: counter,
  })
}

export const setFoodId = (foodId: string | undefined) => (dispatch: Dispatch<ActionTypes>) => {
  if (!foodId) return
  dispatch({
    type: SUPPER_ACTIONS.SET_FOOD_ID,
    foodId: foodId,
  })
}

export const resetFoodState = () => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.RESET_FOOD_STATE,
    food: null,
  })
}

export const setMenuFoodId = (foodMenuId: string | undefined) => (dispatch: Dispatch<ActionTypes>) => {
  if (!foodMenuId) return
  dispatch({
    type: SUPPER_ACTIONS.SET_MENU_FOOD_ID,
    foodMenuId: foodMenuId,
  })
}

export const setOrderId = (orderId: string | undefined) => (dispatch: Dispatch<ActionTypes>) => {
  if (!orderId) return
  dispatch({
    type: SUPPER_ACTIONS.SET_ORDER_ID,
    orderId: orderId,
  })
}

export const setPaymentUpdateArray = (orderId?: string, hasReceived?: boolean) => (
  dispatch: Dispatch<ActionTypes>,
  getState: GetState,
) => {
  console.log(orderId, hasReceived)
  if (!orderId) return
  if (hasReceived === undefined) return

  const { paymentUpdateArray } = getState().supper
  let newPaymentUpdate = paymentUpdateArray
  const index = paymentUpdateArray.findIndex((payment) => payment.orderId === orderId)
  const newPaymentUpdateInfo = {
    orderId: orderId,
    hasReceived: hasReceived,
  }

  if (index === -1) {
    newPaymentUpdate = paymentUpdateArray.concat(newPaymentUpdateInfo)
  } else {
    newPaymentUpdate = paymentUpdateArray.map((payment) => {
      if (payment.orderId === orderId) {
        return newPaymentUpdateInfo
      } else return payment
    })
  }

  dispatch({
    type: SUPPER_ACTIONS.SET_PAYMENT_UPDATE_ARRAY,
    paymentUpdateArray: newPaymentUpdate,
  })
}

export const updateSupperGroupPaymentStatus = (supperGroupId: string, paymentUpdateArray) => {
  if (!(paymentUpdateArray?.length || paymentUpdateArray)) return
  const requestBody = paymentUpdateArray
  console.log(paymentUpdateArray)
  put(ENDPOINTS.UPDATE_SUPPER_GROUP_PAYMENT_STATUS, DOMAINS.SUPPER, requestBody, {}, `/${supperGroupId}/payment`)
}

export const setCreateOrderPage = (createOrderPage: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_CREATE_ORDER_PAGE,
    createOrderPage: createOrderPage,
  })
}

export const setNewSupperGroupId = (newSupperGroupId: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_NEW_SUPPER_GROUP_ID,
    newSupperGroupId: newSupperGroupId,
  })
}

export const leaveSupperGroup = (supperGroupId: string | number | undefined) => (dispatch: Dispatch<ActionTypes>) => {
  if (!supperGroupId) return
  dispatch(setIsLoading(true))
  del(ENDPOINTS.LEAVE_SUPPER_GROUP, DOMAINS.SUPPER, {}, `/${supperGroupId}/user/${localStorage.userID}}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getAllSupperGroups())
    })
    .catch((err) => {
      console.log(err)
      error('Failed to leave supper group, please try again.')
    })
  dispatch(setIsLoading(false))
}

export const updateOwnerEdits = (orderId: string, foodId: string, updates: Updates) => (
  dispatch: Dispatch<ActionTypes>,
) => {
  dispatch(setIsLoading(true))
  const requestBody = updates

  put(ENDPOINTS.UPDATE_OWNER_EDITS, DOMAINS.SUPPER, requestBody, {}, `/${orderId}/food/${foodId}/owner`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getAllSupperGroups())
    })
    .catch((err) => {
      console.log(err)
      error("Failed to update selected user's food, please try again.")
    })
  dispatch(setIsLoading(false))
}

export const getOwnerEdits = (orderId: string, foodId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))

  get(ENDPOINTS.GET_OWNER_EDITS, DOMAINS.SUPPER, `/${orderId}/food/${foodId}/owner`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getAllSupperGroups())
    })
    .catch((err) => {
      console.log(err)
      error("Failed to get selected user's food, please try again.")
    })
  dispatch(setIsLoading(false))
}

export const getClosingTimeFilter = (chosenFilter: Filter) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.GET_CLOSING_TIME_FILTER,
    closingTimeFilter: chosenFilter,
  })
}

export const getAmountLeftFilter = (chosenFilter: Filter) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.GET_AMOUNT_LEFT_FILTER,
    amountLeftFilter: chosenFilter,
  })
}

export const getRestaurantFilter = (chosenFilter: Restaurants[]) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.GET_RESTAURANT_FILTER,
    restaurantFilter: chosenFilter,
  })
}
