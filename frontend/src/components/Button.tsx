import React from 'react'
import styled from 'styled-components'

const Border = styled.button<{ state: string }>`
  height: 2.2rem;
  width: 10vw;
  border: transparent;
  border-radius: 2rem;
  padding-left: 0.05rem;
  padding-right: 0.055rem;
  background: ${(props) =>
    props.state === 'primary' || props.state === 'secondary'
      ? `linear-gradient(to left, #72BA75, #58B994)`
      : '#BFBFBF'};
`
const Inner = styled.div<{ state: string }>`
  height: 100%;
  width: 100%;
  border-radius: 2rem;
  padding-top: 0.35rem;
  background: ${(props) => (props.state === 'primary' ? `linear-gradient(to left, #72BA75, #58B994)` : 'white')};
  color: ${(props) => (props.state === 'primary' ? `white` : props.state === 'secondary' ? `#58B994` : '#BFBFBF')};
`
type Props = {
  state: 'disabled' | 'primary' | 'secondary'
  text: string
}

function ButtonComponent(prop: Props) {
  return (
    <Border state={prop.state}>
      <Inner state={prop.state}>{prop.text}</Inner>
    </Border>
  )
}

export default ButtonComponent
