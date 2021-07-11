import React from 'react'

import Button from '../Mobile/Button'

type Props = {
  defaultButtonDescription: string
  center?: boolean
  containerPadding?: string
  buttonIsPressed?: boolean
  hasSuccessMessage?: boolean
  updatedButtonDescription?: string
  defaultButtonColor?: string
  updatedButtonColor?: string
  defaultTextColor?: string
  updatedTextColor?: string
  buttonWidth?: string
  buttonHeight?: string
  style?: React.CSSProperties
  descriptionStyle?: React.CSSProperties
  onButtonClick?: ((arg0: boolean) => void) | undefined
  isFlipButton?: boolean
  border?: string
  htmlType?: 'button' | 'submit' | 'reset' | undefined
}

export const SupperButton = (props: Props) => {
  return (
    <Button
      center={props.center}
      containerPadding={props.containerPadding}
      buttonIsPressed={props.buttonIsPressed}
      hasSuccessMessage={props.hasSuccessMessage}
      stopPropagation
      defaultButtonDescription={props.defaultButtonDescription}
      updatedButtonDescription={props.updatedButtonDescription}
      defaultButtonColor={props.defaultButtonColor}
      updatedButtonColor={props.updatedButtonColor}
      defaultTextColor={props.defaultTextColor}
      updatedTextColor={props.updatedTextColor}
      buttonWidth={props.buttonWidth}
      buttonHeight={props.buttonHeight}
      style={{ width: 'fit-content', padding: 0 }}
      descriptionStyle={{
        fontWeight: 200,
        fontSize: '15px',
        padding: '5px 16px',
      }}
      onButtonClick={props.onButtonClick}
      isFlipButton={props.isFlipButton ?? false}
      border={props.border}
      htmlType={props.htmlType}
    />
  )
}
