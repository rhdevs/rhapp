import { Dispatch, GetState } from '../../types'
import { getReadableSupperGroupId } from '../../../common/getReadableSupperGroupId'
import {
  ActionTypes,
  Filter,
  Food,
  PaymentMethod,
  Restaurants,
  SupperGroup,
  SupperGroupStatus,
  SUPPER_ACTIONS,
} from '../types'
import { unixTo12HourTime } from '../../../common/unixTo12HourTime'

export const setFilteredSupperGroups = () => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
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
  if (amountLeftFilter == Filter.ASCENDING) {
    filteredSearchSupperGroups.sort(
      (x, y) => (x.costLimit ?? Infinity - x.currentFoodCost) - (y.costLimit ?? Infinity - y.currentFoodCost),
    )
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
    type: SUPPER_ACTIONS.SET_SEARCHED_SUPPER_GROUPS,
    filteredSupperGroups: filteredSearchSupperGroups,
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

export const resetFoodState = () => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_FOOD_STATE,
    food: null,
  })
}

export const setOrderId = (orderId: string | undefined) => (dispatch: Dispatch<ActionTypes>) => {
  if (!orderId) return
  dispatch({
    type: SUPPER_ACTIONS.SET_ORDER_ID,
    orderId: orderId,
  })
}

export const setNewSupperGroupId = (newSupperGroupId: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_NEW_SUPPER_GROUP_ID,
    newSupperGroupId: newSupperGroupId,
  })
}

export const setIsFoodMenuModalOpen = (isFoodMenuModalOpen: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_IS_FOOD_MODAL_OPEN,
    isFoodMenuModalOpen: isFoodMenuModalOpen,
  })
}

export const setFoodModalInfo = (foodMenuModalId: string, modalMenuFoodName: string) => (
  dispatch: Dispatch<ActionTypes>,
) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_FOOD_MODAL_INFO,
    foodMenuModalId: foodMenuModalId,
    modalMenuFoodName: modalMenuFoodName,
  })
}

export const setClosingTimeFilter = (chosenFilter: Filter) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_CLOSING_TIME_FILTER,
    closingTimeFilter: chosenFilter,
  })
}

export const setAmountLeftFilter = (chosenFilter: Filter) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_AMOUNT_LEFT_FILTER,
    amountLeftFilter: chosenFilter,
  })
}

export const setRestaurantFilter = (chosenFilter: Restaurants[]) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_RESTAURANT_FILTER,
    restaurantFilter: chosenFilter,
  })
}

export const setSupperErrorMessage = (supperErrorMessage: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_SUPPER_ERROR_MESSAGE,
    supperErrorMessage: supperErrorMessage,
  })
}

export const setFoodState = (food: Food | undefined) => (dispatch: Dispatch<ActionTypes>) => {
  if (!food) return
  dispatch({
    type: SUPPER_ACTIONS.SET_FOOD_STATE,
    food: food,
  })
}
