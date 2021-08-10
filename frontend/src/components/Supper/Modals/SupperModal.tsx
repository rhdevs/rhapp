import React from 'react'
import { ConfirmationModal } from '../../Mobile/ConfirmationModal'

type Props = {
  flex?: boolean
  title: string
  description?: string | JSX.Element
  leftButtonText: string
  leftButtonTextColor?: string
  leftButtonColor?: string
  rightButtonText?: string
  rightButtonTextColor?: string
  rightButtonColor?: string
  onRightButtonClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onLeftButtonClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  modalSetter?: React.Dispatch<React.SetStateAction<boolean>>
  rightButtonHtmlType?: 'button' | 'submit' | 'reset' | undefined
}

export const SupperModal = (props: Props) => {
  const onLeftClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (props.modalSetter) {
      props.modalSetter(false)
    }
    if (props.onLeftButtonClick) props.onLeftButtonClick(e)
  }
  const onCancelClick = () => {
    if (props.modalSetter) {
      props.modalSetter(false)
    }
  }

  return (
    <ConfirmationModal
      title={props.title}
      description={props.description}
      hasLeftButton
      leftButtonText={props.leftButtonText}
      leftButtonTextColor={props.leftButtonTextColor}
      leftButtonColor={props.leftButtonColor}
      onLeftButtonClick={onLeftClick}
      rightButtonText={props.rightButtonText ?? 'Cancel'}
      rightButtonTextColor={props.rightButtonTextColor}
      rightButtonColor={props.rightButtonColor}
      onRightButtonClick={props.onRightButtonClick ?? onCancelClick}
      flex={props.flex}
      bottom="auto"
      top="25%"
      rightButtonHtmlType={props.rightButtonHtmlType}
    />
  )
}
