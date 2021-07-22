import React from 'react'
import { useDispatch } from 'react-redux'
import { emptyOrderFoodList } from '../../../store/supper/action'

import { SupperModal } from './SupperModal'

type Props = {
  modalSetter: React.Dispatch<React.SetStateAction<boolean>>
  onLeftButtonClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  supperGroupId: string
  orderId: string
}

export const EmptyCartModal = (props: Props) => {
  const dispatch = useDispatch()
  const onLeftClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    dispatch(emptyOrderFoodList(props.supperGroupId, props.orderId))
    if (props.onLeftButtonClick) props.onLeftButtonClick(e)
  }
  return (
    <SupperModal
      title="Empty Cart?"
      description="You have added items to your cart. Exiting this page will remove all items from your cart."
      leftButtonText="Confirm"
      modalSetter={props.modalSetter}
      onLeftButtonClick={onLeftClick}
    />
  )
}
