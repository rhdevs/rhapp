import React from 'react'
import { Button } from 'antd'
import styled from 'styled-components'

import 'antd/dist/antd.css'

const OverlayContainer = styled.div<{ overlayBackground: string; isModalOpen: boolean }>`
  position: fixed;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => (props.overlayBackground ? props.overlayBackground : 'rgba(0, 0, 0, 0.3)')};
  z-index: 999;
  ${(props) => !props.isModalOpen && `display: none;`}
`

const MainContainer = styled.div<{ isModalOpen: boolean }>`
  position: fixed;
  background-color: #fff;
  width: 90vw;
  border-radius: 15px;
  margin-left: auto;
  margin-right: auto;
  padding: 15px;
  box-shadow: 0 2px 5px 1px #888888;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  ${(props) => !props.isModalOpen && `display: none;`}
`

const TitleContainer = styled.div<{ flex?: boolean }>`
  ${(props) => props.flex && 'display: flex;'}
  text-align: center;
`

const TitleText = styled.h1`
  font-size: 16px;
  font-weight: 400;
`

const DescriptionText = styled.p`
  font-weight: 250;
  font-size: 14px;
  padding-top: 0.5rem;
  color: #33363a;
  text-align: justify;
`

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 10px;
`

const StyledButton = styled(Button)<{ defaultRightButtonColor: string; defaultRightButtonTextColor: string }>`
  background: ${(props) => props.defaultRightButtonColor};
  color: ${(props) => props.defaultRightButtonTextColor};
  border-radius: 5px;
  margin-left: 10px;

  &.ant-btn:hover,
  &.ant-btn:focus {
    color: ${(props) => (props.defaultRightButtonTextColor ? props.defaultRightButtonTextColor : 'black')};
    border-color: #d9d9d9;
    ${(props) => props.defaultRightButtonColor && `background: ${props.defaultRightButtonColor};`}
  }
`

type Props = {
  title: string
  description?: string | JSX.Element
  // Left Button Props
  hasLeftButton?: boolean
  leftButtonText: string
  leftButtonTextColor?: string
  leftButtonColor?: string
  onLeftButtonClick: React.MouseEventHandler<HTMLButtonElement>
  // Right Button Props
  rightButtonText: string
  rightButtonTextColor?: string
  rightButtonColor?: string
  onRightButtonClick: React.MouseEventHandler<HTMLButtonElement>
  // Overlay Props
  // Pass function to do something when the overlay around the modal is clicked
  onOverlayClick?: React.MouseEventHandler<HTMLDivElement>
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
  isModalOpen: boolean
  // Use this to toggle overlay
  setModalOpen: (boolean) => void
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
