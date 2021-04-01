import React, { ReactElement } from 'react'
import styled from 'styled-components'

const MainContainer = styled.div`
  border: 3px #de5f4c solid;
  border-radius: 20px;
  width: fit-content;
  padding: 2px 15px;
  height: fit-content;
  min-width: 3rem;
  margin: 5px;
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: baseline;
`

const IconContainer = styled.div`
  color: #666666;
`

const PreTextContainer = styled.text`
  margin: 0 0 0 5px;
  font-size: 12px;
`

const TextContainer = styled.text`
  margin: 0 5px 0 3px;
  font-size: 13px;
  font-weight: 600;
`

type Props = {
  leftIcon?: ReactElement
  preText?: string
  text: string
  rightIcon?: ReactElement
}

export const StatusSymbol = (props: Props) => {
  return (
    <MainContainer>
      {props.leftIcon && <IconContainer>{props.leftIcon}</IconContainer>}
      {props.preText && <PreTextContainer>{props.preText}</PreTextContainer>}
      <TextContainer>{props.text}</TextContainer>
      {props.rightIcon && <IconContainer>{props.rightIcon}</IconContainer>}
    </MainContainer>
  )
}
