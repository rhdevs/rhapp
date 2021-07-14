import React from 'react'
import { ConfirmationModal } from '../../Mobile/ConfirmationModal'

type Props = {
  flex?: boolean
  title: string
  description?: string
  leftButtonText: string
  onLeftButtonClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  modalSetter: React.Dispatch<React.SetStateAction<boolean>>
}

export const SupperModal = (props: Props) => {
  const onLeftClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    props.modalSetter(false)
    if (props.onLeftButtonClick) props.onLeftButtonClick(e)
  }
  const onCancelClick = () => {
    props.modalSetter(false)
  }

  return (
    <ConfirmationModal
      title={props.title}
      description={props.description}
      hasLeftButton
      leftButtonText={props.leftButtonText}
      onLeftButtonClick={onLeftClick}
      rightButtonText="Cancel"
      onRightButtonClick={onCancelClick}
      flex={props.flex}
    />
  )
}
