export type User = {
  userId: string
  profilePictureUrl: string
  displayName: string
  telegramHandle: string
  block: number
  bio: string
  modules: string[]
}

export type Food = {
  foodName: string
  price: number
  foodId: string
  comments?: string //hopper comments
  quantity?: number //hopper order quantity
}

export type Restaurant = {
  menu: Food[]
  closingTime: number
  contactNumber: number
}

export type SubOrder = {
  foodList: Food[]
  totalCost: number
  isPaid: boolean
  hopperId: string
  orderId: string
  methodOfPayment: string
}

export type Order = {
  orderList: SubOrder[]
  additionalCost: number
  totalFoodCost: number
  costLimit: number
  status: string
  orderId: string
  ordererId: string
  comments: string
  methodOfPayment: string
}

export enum SUPPER_ACTIONS {
  SET_IS_LOADING = 'SUPPER_ACTIONS.SET_IS_LIADING',
}

type SetIsLoading = {
  type: typeof SUPPER_ACTIONS.SET_IS_LOADING
  isLoading: boolean
}

export type ActionTypes = SetIsLoading
