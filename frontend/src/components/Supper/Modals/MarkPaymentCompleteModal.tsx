import React from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { updateOrderDetails } from '../../../store/supper/action/level1/putRequests'
import { PaymentMethod } from '../../../store/supper/types'
import { SupperModal } from './SupperModal'

type Props = {
  modalSetter: React.Dispatch<React.SetStateAction<boolean>>
  orderId: string
  paymentMethod: PaymentMethod[]
  phoneNumber: number
}

export const MarkPaymentCompleteModal = (props: Props) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const onLeftClick = () => {
    dispatch(
      updateOrderDetails(props.orderId, {
        hasPaid: true,
        paymentMethod: props.paymentMethod,
        userContact: props.phoneNumber,
      }),
    )
    history.goBack()
  }
  return (
    <SupperModal
      title="Mark payment complete?"
      description="Marking payment complete would notify supper group owner that you have paid. Note that you cannot edit payment information once you have marked payment as complete."
      leftButtonText="Confirm"
      modalSetter={props.modalSetter}
      onLeftButtonClick={onLeftClick}
    />
  )
}
