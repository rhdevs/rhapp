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
  // Left Button Props
  hasLeftButton?: boolean
  leftButtonText: string
  leftButtonTextColor?: string
  leftButtonColor?: string
  onLeftButtonClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  // Right Button Props
  rightButtonText: string
  rightButtonTextColor?: string
  rightButtonColor?: string
  onRightButtonClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  // Overlay Props
  // Pass function to do something when the overlay around the modal is clicked
  onOverlayClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  // Pass a style for custom overlay
  overlayBackground?: string
  // Custom styles
  top?: number | string
  bottom?: number | string
  right?: number
  left?: number
  flex?: boolean
  style?: React.CSSProperties
  rightButtonHtmlType?: 'button' | 'submit' | 'reset' | undefined
  // Pass this into Modal to render/unrender the modal
  isModalOpen?: boolean
  // Use this to toggle overlay
  setModalOpen?: () => void
}

export function ConfirmationModal(props: Props) {
  // Checks for custom buttom styles, otherwise uses default
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
        isModalOpen={props.isModalOpen ?? true}
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
