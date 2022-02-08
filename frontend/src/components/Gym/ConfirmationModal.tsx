import React from 'react'
import Button from '../Button'
import styled from 'styled-components'

const OverlayContainer = styled.div<{ overlayBackgroundColor: string }>`
  position: fixed;
  min-height: 100vh;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => (props.overlayBackgroundColor ? props.overlayBackgroundColor : 'rgba(0, 0, 0, 0.3)')};
  z-index: 999;
`

const MainContainer = styled.div`
  position: fixed;
  background-color: #fff;
  width: 90vw;
  border-radius: 15px;
  margin: auto;
  padding: 15px;
  box-shadow: 0 2px 5px 1px #888888;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`

const TitleText = styled.h1`
  font-family: Lato;
  font-size: 16px;
  font-weight: 400;
  text-align: center;
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
  justify-content: space-evenly;
  width: 100%;
  margin-top: 10px;
`

type Props = {
  title: string
  description?: string | JSX.Element
  // Left Button Props
  hasLeftButton?: boolean
  leftButtonType?: 'primary' | 'secondary'
  leftButtonText?: string
  onLeftButtonClick: React.MouseEventHandler<HTMLButtonElement>
  // Right Button Props
  rightButtonType: 'primary' | 'secondary'
  rightButtonText: string
  onRightButtonClick: React.MouseEventHandler<HTMLButtonElement>
  // Overlay Props
  // Pass function to do something when the overlay around the modal is clicked
  onOverlayClick?: React.MouseEventHandler<HTMLDivElement>
  // Pass a style for custom overlay
  overlayBackgroundColor?: string
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
  const defaultOverlayBackground = props.overlayBackgroundColor ?? 'rgba(0, 0, 0, 0.3)'

  return props.isModalOpen ? (
    <>
      <OverlayContainer onClick={props.onOverlayClick} overlayBackgroundColor={defaultOverlayBackground} />
      <MainContainer
        style={{
          ...props.style,
          bottom: props.bottom ?? '50%',
          right: props.right ?? 0,
          left: props.left ?? 0,
          top: props.top,
        }}
      >
        <TitleText>{props.title}</TitleText>
        <DescriptionText>{props.description}</DescriptionText>
        <ButtonContainer>
          {props.hasLeftButton && (
            // Suppresses ts error due to it adding undefined to optional prop types
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            <Button state={props.leftButtonType} onClick={props.onLeftButtonClick} text={props.leftButtonText} />
          )}
          <Button state={props.rightButtonType} onClick={props.onRightButtonClick} text={props.rightButtonText} />
        </ButtonContainer>
      </MainContainer>
    </>
  ) : (
    <></>
  )
}

ConfirmationModal.defaultProps = {
  hasLeftButton: false,
  leftButtonType: 'secondary',
  leftButtonText: 'Cancel',
}
