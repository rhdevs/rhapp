import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { V1_BLUE, V1_RED } from '../../common/colours'

const MainContainer = styled.div<{
  hasCustomMargin: boolean
  backgroundColor?: string | undefined
  borderColor: string
  borderWidth: string
  shadow?: boolean | undefined
  minWidth?: string | undefined
  isDisabled?: boolean | undefined
  minHeight?: string | undefined
  padding?: string
  isFaded?: boolean
}>`
  cursor: ${(props) => (props.isDisabled || props.isFaded ? 'not-allowed' : 'pointer')};
  border: ${(props) => `${props.borderWidth} solid ${props.borderColor}`};
  border-radius: 20px;
  width: fit-content;
  padding: ${(props) => props.padding ?? '2px 5px'};
  height: fit-content;
  min-height: ${(props) => props.minHeight ?? '30px'};
  min-width: ${(props) => `${props.minWidth}` ?? '3rem'};
  margin: ${(props) => `${props.hasCustomMargin ? '5px 5px 5px 0' : '5px'}`};
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.backgroundColor ?? ''};
  box-shadow: ${(props) => (props.shadow ? '0px 4px 4px 0px rgba(0, 0, 0, 0.24)' : '')};
  ${(props) => props.isFaded && 'opacity: 0.4;'}
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
  shadow?: boolean
  border?: string
  borderWidth?: string
  color?: string
  iconColor?: string
  fontWeight?: number
  fontSize?: string
  minWidth?: string
  minHeight?: string
  isDisabled?: boolean
  padding?: string
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  isFaded?: boolean
}

export const StatusSymbol = (props: Props) => {
  const BLUE_GREY = 'rgba(0, 38, 66, 0.7)'

  const hasCustomMargin = props.hasNoLeftMargin ?? false

  let BACKGROUND_COLOR = props.backgroundColor ?? ''
  if (props.backgroundColor === 'bluegrey') {
    BACKGROUND_COLOR = BLUE_GREY
  }
  const BORDER_COLOR = props.border ?? (BACKGROUND_COLOR === BLUE_GREY ? V1_BLUE : V1_RED)
  const BORDER_WIDTH = props.borderWidth ?? (BACKGROUND_COLOR === BLUE_GREY ? '1px' : '3px')
  const TEXT_COLOR = props.color ?? 'black'
  const ICON_COLOR = props.iconColor ?? BLUE_GREY
  const RIGHT_ICON = props.rightIcon ?? <></>
  const FONT_WEIGHT = props.fontWeight ?? 600
  const FONT_SIZE = props.fontSize ?? '12px'

  return (
    <MainContainer
      hasCustomMargin={hasCustomMargin}
      borderWidth={BORDER_WIDTH}
      borderColor={BORDER_COLOR}
      backgroundColor={BACKGROUND_COLOR}
      shadow={props.shadow}
      onClick={
        props.isDisabled || props.isFaded ? undefined : (props.onClick as React.MouseEventHandler<HTMLDivElement>)
      }
      minWidth={props.minWidth}
      isDisabled={props.isDisabled}
      minHeight={props.minHeight}
      padding={props.padding}
      isFaded={props.isFaded}
    >
      {props.leftIcon && <IconContainer color={ICON_COLOR}>{props.leftIcon}</IconContainer>}
      {props.preText && <PreTextContainer textColor={TEXT_COLOR}>{props.preText}</PreTextContainer>}
      <TextContainer fontWeight={FONT_WEIGHT} fontSize={FONT_SIZE} textColor={TEXT_COLOR}>
        {props.text}
      </TextContainer>
      {<IconContainer color={ICON_COLOR}>{RIGHT_ICON}</IconContainer>}
    </MainContainer>
  )
}
