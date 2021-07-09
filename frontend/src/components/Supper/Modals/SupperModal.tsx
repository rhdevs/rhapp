import React from 'react'
import { useDispatch } from 'react-redux'
import { setModalIsOpen } from '../../../store/supper/action'

import ConfirmationModal from '../../Mobile/ConfirmationModal'

type Props = {
  title: string
  description?: string
  leftButtonText: string
  onLeftButtonClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onRightButtonClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const SupperModal = (props: Props) => {
  const dispatch = useDispatch()

  const onLeftClick = (e) => {
    dispatch(setModalIsOpen(false))
    if (props.onLeftButtonClick) props.onLeftButtonClick(e)
  }
  const onCancelClick = () => {
    dispatch(setModalIsOpen(false))
  }

  return (
    <ConfirmationModal
      title={props.title}
      description={props.description}
      hasLeftButton
      leftButtonText={props.leftButtonText}
      onLeftButtonClick={props.onLeftButtonClick}
      rightButtonText="Cancel"
      onRightButtonClick={onCancelClick}
    />
  )
}
