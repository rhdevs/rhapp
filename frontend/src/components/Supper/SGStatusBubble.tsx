import React from 'react'

import styled from 'styled-components'
import { SupperGroupStatus } from '../../store/supper/types'

const MainContainer = styled.div<{
  backgroundColor?: string
  borderColor: string
}>`
  border: ${(props) => `3px solid ${props.borderColor}`};
  border-radius: 10px;
  width: fit-content;
  padding: 2px 5px;
  height: fit-content;
  min-width: 3rem;
  margin: 5px;
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  background-color: ${(props) => props.backgroundColor ?? ''};
`

const TextContainer = styled.text`
  margin: 0 4px;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Inter';
  text-transform: uppercase;
`

type Props = {
  text: SupperGroupStatus
  backgroundColor?: string
}

export const SGStatusBubble = (props: Props) => {
  const RED = '#de5f4c'

  const BACKGROUND_COLOR = props.backgroundColor ?? 'rgba(222, 95, 76, 0.35);'

  return (
    <MainContainer borderColor={RED} backgroundColor={BACKGROUND_COLOR}>
      <TextContainer>{props.text}</TextContainer>
    </MainContainer>
  )
}
