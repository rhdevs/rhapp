import React from 'react'
import { useDispatch } from 'react-redux'

import { SupperModal } from './SupperModal'
import { deleteOrder, emptyOrderFoodList } from '../../../store/supper/action'
import { Order } from '../../../store/supper/types'

type Props = {
  modalSetter: React.Dispatch<React.SetStateAction<boolean>>
  onLeftButtonClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  isOwner: boolean
  supperGroupId: string | number
  orderId: string | undefined
  // order: Order | null
}

export const DeleteOrderModal = (props: Props) => {
  const dispatch = useDispatch()
  // const newOrder = props.order != null ? { ...props.order, foodList: [], totalCost: 0 } : null
  const descriptionText = props.isOwner
    ? 'Deleting order will remove items from your cart but leave everyone else’s carts unchanged. Supper group will not be deleted. '
    : 'Deleting order will remove all items from your cart.'

  const onLeftClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    // console.log(newOrder)
    dispatch(deleteOrder(props.supperGroupId, props.orderId))
    // dispatch(emptyOrderFoodList(props.orderId, newOrder))
    if (props.onLeftButtonClick) props.onLeftButtonClick(e)
  }
  return (
    <SupperModal
      title="Delete Order?"
      description={descriptionText}
      leftButtonText="Confirm"
      modalSetter={props.modalSetter}
      onLeftButtonClick={onLeftClick}
    />
  )
}
