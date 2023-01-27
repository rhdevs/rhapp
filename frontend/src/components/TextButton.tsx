import React from 'react'
import styled from 'styled-components'

const StyledButton = styled.button<{
  state: 'primary' | 'secondary'
  size: 'small' | 'regular'
  width?: string
  height?: string
  fontSize?: string
  lineHeight?: string
}>`
  min-height: 35px;
  height: ${(props) => props.height ?? 'auto'};
  width: ${(props) => props.width ?? 'max-content'};
  border-radius: 25px;
  font-size: ${(props) => props.fontSize ?? '12px'};
  border: solid 0.1rem transparent;
  background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
    linear-gradient(to left, #72ba75, #58b994);
  box-shadow: ${(props) => (props.state === 'primary' ? '0px' : '2px 1000px 1px #fff inset')};
  color: ${(props) => (props.state === 'primary' ? 'white' : '#58B994')};
  padding: ${(props) => (props.size === 'small' ? '7px 14px' : '16px 30px')};
  line-height: ${(props) => props.lineHeight ?? '1px'};
  white-space: normal;
  cursor: pointer;

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
  onClick: React.MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset' | undefined
  width?: string | undefined
  height?: string | undefined
  fontSize?: string | undefined
  size?: 'small' | 'regular' | undefined
  lineHeight?: string | undefined
}

/**
 * A resizable button with rounded corners that can contain text \
 * Comes in two states: Primary (filled green) and Secondary (hollow white)
 *
 * @param state ('primary' | 'secondary') Primary button is filled green, secondary is white (hollow)
 * @param text (string) Text to be displayed on the button
 * @param onClick (React.MouseEventHandler<HTMLButtonElement>) Function to be called when button is clicked
 * @param disabled (optional) (boolean) If the button is disabled, it will be greyed out, and not clickable
 * @param type (optional) ('button' | 'submit' | 'reset' | undefined) Type of button, default `button`
 * @param width (optional) (string | undefined) Width of the button, default is max-content
 * @param height (optional) (string | undefined) Height of the button, default is max-content
 * @param fontSize (optional) (string | undefined) Font size of the text of the button, default is max-content
 * @param size (optional) ('small' | 'regular' | undefined) Size of the button, default is regular
 * @returns a button
 */

function TextButton(prop: Props) {
  return (
    <StyledButton
      onClick={prop.onClick}
      state={prop.state}
      disabled={prop.disabled}
      type={prop.type ?? 'button'}
      width={prop.width}
      height={prop.height}
      fontSize={prop.fontSize}
      size={prop.size ?? 'regular'}
      lineHeight={prop.lineHeight}
    >
      {prop.text}
    </StyledButton>
  )
}

export default TextButton
