import React from 'react'
import styled from 'styled-components'

const Button = styled.button<{ state: 'primary' | 'secondary'; width?: string; size: 'small' | 'regular' }>`
  min-height: 35px;
  height: auto;
  width: ${(props) => props.width ?? `max-content`};
  border-radius: 25px;
  font-size: 12px;
  border: solid 0.1rem transparent;
  background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
    linear-gradient(to left, #72ba75, #58b994);
  box-shadow: ${(props) => (props.state === 'primary' ? `0px` : `2px 1000px 1px #fff inset`)};
  color: ${(props) => (props.state === 'primary' ? `white` : `#58B994`)};
  padding: ${(props) => (props.size === 'small' ? `7px 14px` : `16px 30px`)};
  line-height: 1px;
  white-space: nowrap;

  &:active {
    background: ${(props) => (props.state === 'primary' ? '#D8E6DF' : '#8B8B8B')};
    color: #8b8b8b;
    transform: scale(0.95);
  }

  &:disabled {
    color: #bfbfbf;
    border-color: #bfbfbf;
    background: white;
  }
`

type Props = {
  state: 'primary' | 'secondary'
  text: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset' | undefined
  onClick: () => void
  setWidth?: string | undefined
  size?: 'small' | 'regular' | undefined
}

function ButtonComponent(prop: Props) {
  return (
    <Button
      onClick={() => prop.onClick()}
      state={prop.state}
      disabled={prop.disabled}
      type={prop.type ?? 'button'}
      width={prop.setWidth}
      size={prop.size ?? 'regular'}
    >
      {prop.text}
    </Button>
  )
}

export default ButtonComponent
