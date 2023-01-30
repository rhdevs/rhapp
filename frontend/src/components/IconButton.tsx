import React from 'react'
import styled from 'styled-components'

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledText = styled.div<{
  fontSize?: string
  fontWeight?: number
  lineHeight?: string
}>`
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: -0.015em;
  margin-top: 10px;

  font-family: 'Lato';
  font-style: normal;
  font-weight: ${(props) => props.fontWeight ?? 500};
  font-size: ${(props) => props.fontSize ?? '14px'};
  line-height: ${(props) => props.lineHeight ?? '17px'};
  white-space: normal;
  color: black;
`

const StyledButton = styled.button<{
  width?: string
  height?: string
  borderRadius?: string
}>`
  min-height: 35px;
  height: ${(props) => props.height ?? 'auto'};
  width: ${(props) => props.width ?? 'max-content'};
  border-radius: ${(props) => props.borderRadius ?? '50%'};
  border: solid 0.1rem transparent;
  background: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;
`

type Props = {
  text: string
  onClick: React.MouseEventHandler<HTMLButtonElement>
  icon: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset' | undefined
  width?: string | undefined
  height?: string | undefined
  borderRadius?: string | undefined
  fontSize?: string | undefined
  fontWeight?: number | undefined
  size?: 'small' | 'regular' | undefined
  lineHeight?: string | undefined
}

/**
 * A button with an icon and text label at the bottom \
 * By default, it is round
 *
 * @param text (string) - text label
 * @param onClick (React.MouseEventHandler<HTMLButtonElement>) - function to be called when button is clicked
 * @param icon (string) - path to icon
 * @param disabled (boolean) (optional) - whether the button is disabled
 * @param type ('button' | 'submit' | 'reset' | undefined) (optional) - type of button
 * @param width (string) (optional) - width of button, default `max-content`
 * @param height (string) (optional) - height of button, default `auto`
 * @param borderRadius (string) (optional) - border radius of button, default `50%`
 * @param fontSize (string) (optional) - font size of text label, default `14px`
 * @param fontWeight (number) (optional) - font weight of text label, default `500`
 * @param size ('small' | 'regular') (optional) - size of button, default `regular`
 * @param lineHeight (string) (optional) - line height of text label, default `17px`
 *
 * @returns a button
 */

function IconButton(prop: Props) {
  return (
    <StyledDiv>
      <StyledButton
        onClick={prop.onClick}
        disabled={prop.disabled}
        type={prop.type ?? 'button'}
        width={prop.width}
        height={prop.height}
        borderRadius={prop.borderRadius}
      >
        <img src={prop.icon} />
      </StyledButton>
      <StyledText fontSize={prop.fontSize} fontWeight={prop.fontWeight} lineHeight={prop.lineHeight}>
        {prop.text}
      </StyledText>
    </StyledDiv>
  )
}

export default IconButton
