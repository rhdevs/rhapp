import React, { ReactElement } from 'react'

import styled from 'styled-components'

const MainContainer = styled.a<{ alignItems?: string | undefined }>`
  margin: 2px;
  display: flex;
  flex-direction: row;
  align-items: ${(props) => props.alignItems ?? ''};
`

const ButtonText = styled.text<{
  color: string
  buttonFontSize?: string | undefined
  buttonFontWeight?: number | string | undefined
}>`
  color: ${(props) => props.color};
  font-size: ${(props) => props.buttonFontSize ?? '17px'};
  font-weight: ${(props) => props.buttonFontWeight ?? 'normal'};
  text-decoration: underline;
  margin: 0 5px;
`

const StyledRightIcon = styled.div<{ color: string; fontSize?: string | undefined }>`
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
  fontWeight?: number | string
  rightIcon?: ReactElement
  alignItems?: string
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
    <MainContainer alignItems={props.alignItems} onClick={props.onClick as React.MouseEventHandler<HTMLAnchorElement>}>
      <ButtonText buttonFontSize={props.fontSize} color={COLOR} buttonFontWeight={props.fontWeight}>
        {props.text}
      </ButtonText>
      {props.rightIcon && (
        <StyledRightIcon fontSize={props.fontSize} color={COLOR}>
          {props.rightIcon}
        </StyledRightIcon>
      )}
    </MainContainer>
  )
}
