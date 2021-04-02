import React, { ReactElement } from 'react'
import styled from 'styled-components'

import tick from '../../assets/whiteTick.svg'

// background: ${(props) => props.color};
// <{ border: string; color: string }>

const MainContainer = styled.div<{
  hasCustomMargin: boolean
  backgroundColor?: string
  borderColor: string
  borderWidth: string
}>`
  border: ${(props) => `${props.borderWidth} solid ${props.borderColor}`};
  border-radius: 20px;
  width: fit-content;
  padding: 2px 5px;
  height: fit-content;
  min-width: 3rem;
  margin: ${(props) => `${props.hasCustomMargin ? '5px 5px 5px 0' : '5px'}`};
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  background-color: ${(props) => props.backgroundColor ?? ''};
`

const IconContainer = styled.div<{ color: string }>`
  color: #666666;
  color: ${(props) => props.color};
`

const PreTextContainer = styled.text<{ textColor: string }>`
  margin: 0 0 0 5px;
  font-size: 12px;
  color: ${(props) => props.textColor};
  font-family: 'Inter';
`

const TextContainer = styled.text<{ textColor: string }>`
  margin: 0 4px;
  font-size: 13px;
  font-weight: 600;
  color: ${(props) => props.textColor};
  font-family: 'Inter';
`

const CheckIcon = styled.img`
  margin-top: -3px;
`

type Props = {
  leftIcon?: ReactElement
  preText?: string
  text: string
  rightIcon?: ReactElement
  backgroundColor?: string
  isClicked?: boolean
  hasNoLeftMargin?: boolean
}

export const StatusSymbol = (props: Props) => {
  const BLUE_GREY = 'rgba(0, 38, 66, 0.7)'
  const DARK_BLUE = '#002642'
  const RED = '#de5f4c'

  const buttonPressed = props.isClicked ?? false
  const hasCustomMargin = props.hasNoLeftMargin ?? false
  const CHECK_ICON = props.isClicked && <CheckIcon src={tick} alt="Check Icon" />

  let BACKGROUND_COLOR = props.backgroundColor ?? ''
  if (props.backgroundColor === 'bluegrey') {
    BACKGROUND_COLOR = buttonPressed ? BLUE_GREY : 'white'
  }

  const BORDER_COLOR = BACKGROUND_COLOR === BLUE_GREY ? DARK_BLUE : RED
  const BORDER_WIDTH = BACKGROUND_COLOR === BLUE_GREY ? '1px' : '3px'
  const TEXT_COLOR = BACKGROUND_COLOR === BLUE_GREY ? 'white' : 'black'
  const ICON_COLOR = BACKGROUND_COLOR === BLUE_GREY ? 'white' : BLUE_GREY
  const RIGHT_ICON = BACKGROUND_COLOR === BLUE_GREY ? CHECK_ICON : props.rightIcon ?? <></>

  return (
    <MainContainer
      hasCustomMargin={hasCustomMargin}
      borderWidth={BORDER_WIDTH}
      borderColor={BORDER_COLOR}
      backgroundColor={BACKGROUND_COLOR}
    >
      {props.leftIcon && <IconContainer color={ICON_COLOR}>{props.leftIcon}</IconContainer>}
      {props.preText && <PreTextContainer textColor={TEXT_COLOR}>{props.preText}</PreTextContainer>}
      <TextContainer textColor={TEXT_COLOR}>{props.text}</TextContainer>
      {<IconContainer color={ICON_COLOR}>{RIGHT_ICON}</IconContainer>}
    </MainContainer>
  )
}
