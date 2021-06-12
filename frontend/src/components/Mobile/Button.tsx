import React, { CSSProperties, useState } from 'react'

import styled from 'styled-components'
import { Button as AntdButton } from 'antd'
import { message } from 'antd'

const MainContainer = styled.div<{ center?: boolean | undefined; containerPadding?: string | undefined }>`
  ${(props) =>
    props.center &&
    `display: flex;
    justify-content: center;
    margin: 0 auto;`}
  ${(props) => props.containerPadding && `padding: ${props.containerPadding};`}
`

type Props = {
  center?: boolean
  containerPadding?: string
  buttonIsPressed?: boolean
  hasSuccessMessage?: boolean
  stopPropagation: boolean
  defaultButtonDescription: string
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
    <MainContainer center={props.center} containerPadding={props.containerPadding}>
      <AntdButton
        htmlType={props.htmlType ?? 'button'}
        danger
        style={
          props.style ?? {
            background: buttonColour,
            color: textColour,
            borderRadius: '5px',
            border: props.border ? props.border : props.isFlipButton ?? false ? '1px solid #ff7875' : 'none',
            width: props.buttonWidth ? props.buttonWidth : '',
            height: props.buttonHeight ? props.buttonHeight : '',
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
        <text style={props.descriptionStyle as CSSProperties}>{buttonDescriptionChooser(buttonIsPressed)}</text>
      </AntdButton>
    </MainContainer>
  )
}

export default Button
