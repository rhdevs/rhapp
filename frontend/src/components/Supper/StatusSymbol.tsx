import React, { ReactElement } from 'react'
import styled from 'styled-components'

import Friends from '../../assets/Friends.svg'
import { CarOutlined } from '@ant-design/icons'

const MainContainer = styled.div<{
  hasCustomMargin: boolean
  backgroundColor?: string | undefined
  borderColor: string
  borderWidth: string
  shadow?: string | undefined
  minWidth?: string | undefined
  isDisabled?: boolean | undefined
}>`
  border: ${(props) => `${props.borderWidth} solid ${props.borderColor}`};
  border-radius: 20px;
  width: fit-content;
  padding: 2px 7px;
  height: fit-content;
  min-height: 33px;
  min-width: ${(props) => `${props.minWidth}` ?? '3rem'};
  margin: ${(props) => `${props.hasCustomMargin ? '5px 5px 5px 0' : '5px'}`};
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.backgroundColor ?? ''};
  box-shadow: ${(props) => props.shadow ?? ''};
  ${(props) => props.isDisabled && 'cursor: not-allowed;'}
`

const IconContainer = styled.div<{ color: string }>`
  color: ${(props) => props.color};
  max-height: 28px;
`

const PreTextContainer = styled.text<{ textColor: string }>`
  margin: 0 0 0 5px;
  font-size: 12px;
  color: ${(props) => props.textColor};
  font-family: 'Inter';
`

const TextContainer = styled.text<{ textColor: string; fontWeight: number; fontSize: string }>`
  margin: 0 4px;
  font-size: ${(props) => props.fontSize};
  font-weight: ${(props) => props.fontWeight};
  color: ${(props) => props.textColor};
  font-family: 'Inter';
`

type Props = {
  leftIcon?: ReactElement
  preText?: string
  text: string
  rightIcon?: ReactElement
  backgroundColor?: string
  hasNoLeftMargin?: boolean
  type?: string
  shadow?: string
  border?: string
  borderWidth?: string
  color?: string
  iconColor?: string
  fontWeight?: number
  fontSize?: string
  minWidth?: string
  isDisabled?: boolean
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const StatusSymbol = (props: Props) => {
  const BLUE_GREY = 'rgba(0, 38, 66, 0.7)'
  const DARK_BLUE = '#002642'
  const RED = '#de5f4c'

  const hasCustomMargin = props.hasNoLeftMargin ?? false
  const PEOPLE_ICON = <img src={Friends} alt="Friends Icon" />

  let leftIcon = props.leftIcon
  let preText = props.preText
  let text = props.text
  if (props.type === 'numberOfUsers') {
    leftIcon = PEOPLE_ICON
  } else if (props.type === 'estDeliveryFee') {
    leftIcon = <CarOutlined />
    preText = 'est.'
  } else if (props.type === 'deliveryFee') {
    leftIcon = <CarOutlined />
    text = `${props.text}*`
  }

  let BACKGROUND_COLOR = props.backgroundColor ?? ''
  if (props.backgroundColor === 'bluegrey') {
    BACKGROUND_COLOR = BLUE_GREY
  }
  const BORDER_COLOR = props.border ?? (BACKGROUND_COLOR === BLUE_GREY ? DARK_BLUE : RED)
  const BORDER_WIDTH = props.borderWidth ?? (BACKGROUND_COLOR === BLUE_GREY ? '1px' : '3px')
  const TEXT_COLOR = props.color ?? 'black'
  const ICON_COLOR = props.iconColor ?? BLUE_GREY
  const RIGHT_ICON = props.rightIcon ?? <></>
  const FONT_WEIGHT = props.fontWeight ?? 600
  const FONT_SIZE = props.fontSize ?? '13px'

  return (
    <MainContainer
      hasCustomMargin={hasCustomMargin}
      borderWidth={BORDER_WIDTH}
      borderColor={BORDER_COLOR}
      backgroundColor={BACKGROUND_COLOR}
      shadow={props.shadow}
      onClick={props.onClick as React.MouseEventHandler<HTMLDivElement>}
      minWidth={props.minWidth}
      isDisabled={props.isDisabled}
    >
      {leftIcon && <IconContainer color={ICON_COLOR}>{leftIcon}</IconContainer>}
      {preText && <PreTextContainer textColor={TEXT_COLOR}>{preText}</PreTextContainer>}
      <TextContainer fontWeight={FONT_WEIGHT} fontSize={FONT_SIZE} textColor={TEXT_COLOR}>
        {text}
      </TextContainer>
      {<IconContainer color={ICON_COLOR}>{RIGHT_ICON}</IconContainer>}
    </MainContainer>
  )
}
