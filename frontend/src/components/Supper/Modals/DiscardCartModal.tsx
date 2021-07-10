import React from 'react'
import { useDispatch } from 'react-redux'
import { updateOrderDetails } from '../../../store/supper/action'

import { SupperModal } from './SupperModal'

type Props = {
  modalSetter: React.Dispatch<React.SetStateAction<boolean>>
  onLeftButtonClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  orderId: string | undefined
}

export const DiscardCartModal = (props: Props) => {
  const dispatch = useDispatch()
  const onLeftClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    dispatch(updateOrderDetails(props.orderId, { foodList: [] }))
    if (props.onLeftButtonClick) props.onLeftButtonClick(e)
  }
  return (
    <SupperModal
      title="Discard Cart?"
      description="You have added items to your cart. Exiting this page will remove all items from your cart."
      leftButtonText="Confirm"
      modalSetter={props.modalSetter}
      onLeftButtonClick={onLeftClick}
    />
  )
}
