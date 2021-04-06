import React, { ReactElement } from 'react'

import styled from 'styled-components'

const MainContainer = styled.a`
  margin: 2px;
  display: flex;
  flex-direction: row;
`

const ButtonText = styled.text<{ color: string; fontSize?: string }>`
  color: ${(props) => props.color};
  font-size: ${(props) => props.fontSize ?? '17px'};
  text-decoration: underline;
  margin: 0 5px;
`

const StyledRightIcon = styled.div<{ color: string; fontSize?: string }>`
  color: ${(props) => props.color};
  max-height: ${(props) => props.fontSize ?? '17px'};
  max-width: ${(props) => props.fontSize ?? '17px'};
  text-decoration: underline;
  margin: 0 5px;
`

type Props = {
  text: string
  color?: string
  fontSize?: string
  rightIcon?: ReactElement
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}
export const UnderlinedButton = (props: Props) => {
  const BLUE = '#002642'
  const RED = '#DE5F4C'
  let COLOR = props.color ?? 'black'
  if (props.color === 'blue') {
    COLOR = BLUE
  } else if (props.color === 'red') {
    COLOR = RED
  }

  return (
    <MainContainer onClick={props.onClick}>
      <ButtonText fontSize={props.fontSize} color={COLOR}>
        {props.text}
      </ButtonText>
      <StyledRightIcon fontSize={props.fontSize} color={COLOR}>
        {props.rightIcon}
      </StyledRightIcon>
    </MainContainer>
  )
}
