import React from 'react'

import styled from 'styled-components'
import { V1_RED } from '../../common/colours'
import { SupperGroupStatus } from '../../store/supper/types'

const MainContainer = styled.div<{
  backgroundColor?: string
  borderRadius?: string
  margin?: string
  borderColor: string
}>`
  border: ${(props) => `3px solid ${props.borderColor}`};
  border-radius: ${(props) => props.borderRadius ?? '10px'};
  width: fit-content;
  padding: 2px 5px;
  height: fit-content;
  min-width: 3rem;
  margin: ${(props) => props.margin ?? '5px'};
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  background-color: ${(props) => props.backgroundColor ?? ''};
`

const TextContainer = styled.text<{ roundversion?: boolean }>`
  margin: 0 4px;
  font-size: ${(props) => (props.roundversion ? '12px' : '14px')};
  font-weight: bold;
  ${(props) => !props.roundversion && `font-family: 'Inter';`}
  text-transform: uppercase;
`

type Props = {
  text: SupperGroupStatus | string
  borderRadius?: string
  backgroundColor?: string
  margin?: string
  roundversion?: boolean
}

export const SGStatusBubble = (props: Props) => {
  const BACKGROUND_COLOR = props.backgroundColor ?? 'rgba(222, 95, 76, 0.35);'

  return (
    <MainContainer
      borderColor={V1_RED}
      backgroundColor={BACKGROUND_COLOR}
      borderRadius={props.borderRadius}
      margin={props.margin}
    >
      <TextContainer roundversion={props.roundversion}>{props.text}</TextContainer>
    </MainContainer>
  )
}
