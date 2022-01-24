import React from 'react'
import { Button } from 'antd'
import {
  OverlayContainer,
  MainContainer,
  ButtonContainer,
  StyledButton,
  TitleContainer,
  TitleText,
  DescriptionText,
} from './styles/ConfirmationModal.styled'

import 'antd/dist/antd.css'

type Props = {
  title: string
  description?: string | JSX.Element
  hasLeftButton?: boolean
  leftButtonText: string
  leftButtonTextColor?: string
  leftButtonColor?: string
  onLeftButtonClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  rightButtonText: string
  rightButtonTextColor?: string
  rightButtonColor?: string
  onRightButtonClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onOverlayClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  overlayBackground?: string
  top?: number | string
  bottom?: number | string
  right?: number
  left?: number
  flex?: boolean
  style?: React.CSSProperties
  rightButtonHtmlType?: 'button' | 'submit' | 'reset' | undefined
  isModalOpen?: boolean
}

export function ConfirmationModal(props: Props) {
  const defaultLeftButtonColor = props.leftButtonColor ?? '#DE5F4C'
  const defaultLeftButtonTextColor = props.leftButtonTextColor ?? '#FFFFFF'
  const defaultRightButtonColor = props.rightButtonColor ?? '#FAFAF4'
  const defaultRightButtonTextColor = props.rightButtonTextColor ?? '#000000'
  const defaultOverlayBackground = props.overlayBackground ?? 'rgba(0, 0, 0, 0.3)'

  return (
    <>
      <OverlayContainer
        onClick={props.onOverlayClick}
        overlayBackground={defaultOverlayBackground}
        isModalOpen={props.isModalOpen ?? true}
      />
      <MainContainer
        style={{
          ...props.style,
          bottom: props.bottom ?? '50%',
          right: props.right ?? 0,
          left: props.left ?? 0,
          top: props.top,
        }}
      >
        <TitleContainer flex={props.flex}>
          <TitleText>{props.title}</TitleText>
        </TitleContainer>
        <DescriptionText>{props.description}</DescriptionText>
        <ButtonContainer>
          {props.hasLeftButton && (
            <Button
              style={{
                background: defaultLeftButtonColor,
                color: defaultLeftButtonTextColor,
                borderRadius: '5px',
                border: defaultLeftButtonColor,
              }}
              onClick={props.onLeftButtonClick}
            >
              {props.leftButtonText}
            </Button>
          )}
          <StyledButton
            defaultRightButtonColor={defaultRightButtonColor}
            defaultRightButtonTextColor={defaultRightButtonTextColor}
            onClick={props.onRightButtonClick}
            htmlType={props.rightButtonHtmlType}
          >
            {props.rightButtonText}
          </StyledButton>
        </ButtonContainer>
      </MainContainer>
    </>
  )
}
