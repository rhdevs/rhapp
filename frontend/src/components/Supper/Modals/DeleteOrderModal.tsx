import React from 'react'
import { useDispatch } from 'react-redux'
import { deleteOrder } from '../../../store/supper/action/level1/deleteRequests'

import { SupperModal } from './SupperModal'

type Props = {
  modalSetter: React.Dispatch<React.SetStateAction<boolean>>
  onLeftButtonClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  isOwner: boolean
  supperGroupId: string | number
  orderId: string | undefined
}

export const DeleteOrderModal = (props: Props) => {
  const dispatch = useDispatch()
  const descriptionText = props.isOwner
    ? 'Deleting order will remove items from your cart but leave everyone else’s carts unchanged. Supper group will not be deleted. '
    : 'Deleting order will remove all items from your cart.'

  const onLeftClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    dispatch(deleteOrder(props.supperGroupId, props.orderId))
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
