import React, { useState } from 'react'
import { Button as AntdButton } from 'antd'
import { message } from 'antd'

type Props = {
  buttonIsPressed?: boolean
  hasSuccessMessage?: boolean
  stopPropagation: boolean
  defaultButtonDescription: string
  updatedButtonDescription?: string
  defaultButtonColor?: string
  updatedButtonColor?: string
  defaultTextColor?: string
  updatedTextColor?: string
  style?: React.CSSProperties
  onButtonClick?: (arg0: boolean) => void
  isFlipButton?: boolean
}

function Button(props: Props) {
  const buttonInitialState = (buttonIsPressed: boolean) => {
    if (buttonIsPressed) {
      if (props.updatedButtonColor ?? props.isFlipButton ?? true) {
        return 'transparent'
      } else {
        return props.defaultButtonColor ?? '#DE5F4C'
      }
    } else {
      return props.defaultButtonColor ?? '#DE5F4C'
    }
  }

  const [buttonIsPressed, setButtonIsPressed] = useState(props.buttonIsPressed ?? false)
  const [buttonColour, setButtonColour] = useState(buttonInitialState(props.buttonIsPressed ?? false))
  const [textColour, setTextColour] = useState(props.buttonIsPressed ? '#ff7875' : props.defaultTextColor || 'white')

  const successfulAdd = () => {
    if (props.hasSuccessMessage) message.success('Successfully added to schedule!')
  }

  const successfulRemove = () => {
    if (props.hasSuccessMessage) message.warning('Successfully removed from schedule!')
  }

  const buttonColourChooser = (buttonIsPressed: boolean) => {
    if (buttonIsPressed) {
      return props.defaultButtonColor ?? '#DE5F4C'
    } else {
      if (props.updatedButtonColor ?? props.isFlipButton ?? true) {
        return 'transparent'
      } else {
        return props.defaultButtonColor ?? '#DE5F4C'
      }
    }
  }

  const textColourChooser = (buttonIsPressed: boolean) => {
    if (buttonIsPressed) {
      return props.defaultTextColor ?? 'white'
    } else {
      if (props.updatedTextColor ?? props.isFlipButton ?? true) {
        return '#ff7875'
      } else {
        return props.defaultTextColor ?? 'white'
      }
    }
  }

  const buttonDescriptionChooser = (buttonIsPressed: boolean) => {
    if (buttonIsPressed) {
      return props.updatedButtonDescription ?? props.defaultButtonDescription
    } else {
      return props.defaultButtonDescription
    }
  }

  return (
    <AntdButton
      danger
      style={
        props.style ?? {
          background: buttonColour,
          color: textColour,
          borderRadius: '5px',
        }
      }
      onClick={(e) => {
        {
          props.stopPropagation && e.stopPropagation()
        }
        buttonIsPressed ? successfulRemove() : successfulAdd()
        setButtonColour(buttonColourChooser(buttonIsPressed))
        setTextColour(textColourChooser(buttonIsPressed))
        setButtonIsPressed(!buttonIsPressed)
        if (props.onButtonClick) props.onButtonClick(buttonIsPressed)
      }}
    >
      {buttonDescriptionChooser(buttonIsPressed)}
    </AntdButton>
  )
}

export default Button
