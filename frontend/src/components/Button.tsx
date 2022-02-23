import React from 'react'
import styled from 'styled-components'
import { colorTheme } from '../theme'

const Border = styled.button<{ state: string }>`
  height: 2.2rem;
  width: 10vw;
  border: transparent;
  border-radius: 2rem;
  padding-left: 0rem;
  padding-right: 0rem;
  background: linear-gradient(
    to left,
    ${colorTheme.button.positive.background.gradientLeft},
    ${colorTheme.button.positive.background.gradientRight}
  );

  &:active {
    background: ${(props) => (props.state === 'primary' ? '#D8E6DF' : '#8B8B8B')};
    transform: scale(0.95);
  }
`
const Inner = styled.button<{ state: string }>`
  height: 98%;
  width: 98%;
  border-radius: 2rem;
  border: transparent;
  background: ${(props) =>
    props.state === 'primary'
      ? `linear-gradient(to left, ${colorTheme.button.positive.background.gradientLeft},
    ${colorTheme.button.positive.background.gradientRight})`
      : 'white'};
  color: ${(props) => (props.state === 'primary' ? colorTheme.button.positive.font : colorTheme.button.negative.font)};

  &:active {
    background: #d8e6df;
    color: #8b8b8b;
  }
`
type Props = {
  state: 'primary' | 'secondary'
  text: string
  onClick: () => void
}

function ButtonComponent(prop: Props) {
  return (
    <Border onClick={() => prop.onClick()} state={prop.state}>
      <Inner state={prop.state}>{prop.text}</Inner>
    </Border>
  )
}

export default ButtonComponent
