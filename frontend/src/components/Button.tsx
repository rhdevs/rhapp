import React from 'react'
import styled from 'styled-components'

const Border = styled.button<{ state: 'primary' | 'secondary' }>`
  height: 2.2rem;
  width: 10rem;
  margin: 1rem;
  border: transparent;
  border-radius: 2rem;
  padding: 0;
  background: linear-gradient(to left, #72ba75, #58b994);

  &:active {
    background: ${(props) => (props.state === 'primary' ? '#D8E6DF' : '#8B8B8B')};
    transform: scale(0.95);
  }
`

const Inner = styled.button<{ state: 'primary' | 'secondary' }>`
  height: 98%;
  width: 98%;
  border-radius: 2rem;
  border: transparent;
  background: ${(props) => (props.state === 'primary' ? `linear-gradient(to left, #72BA75, #58B994)` : 'white')};
  color: ${(props) => (props.state === 'primary' ? `white` : `#58B994`)};

  &:active {
    background: #d8e6df;
    color: #8b8b8b;
  }
`

type Props = {
  state: 'primary' | 'secondary'
  text: string
  onClick: React.MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
}

function ButtonComponent(prop: Props) {
  return (
    <Border onClick={prop.onClick} state={prop.state} disabled={prop.disabled}>
      <Inner state={prop.state}>{prop.text}</Inner>
    </Border>
  )
}

export default ButtonComponent
