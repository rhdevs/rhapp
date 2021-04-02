import React from 'react'

import styled from 'styled-components'

const MainContainer = styled.a`
  margin: 2px;
`

const ButtonText = styled.text<{ color: string }>`
  color: ${(props) => props.color};
  font-size: 17px;
  text-decoration: underline;
`

type Props = {
  text: string
  color: string
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}
export const UnderlinedButton = (props: Props) => {
  const BLUE = '#002642'
  const RED = '#DE5F4C'
  let COLOR = props.color
  if (props.color === 'blue') {
    COLOR = BLUE
  } else if (props.color === 'red') {
    COLOR = RED
  }

  return (
    <MainContainer onClick={props.onClick}>
      <ButtonText color={COLOR}>{props.text}</ButtonText>
    </MainContainer>
  )
}
