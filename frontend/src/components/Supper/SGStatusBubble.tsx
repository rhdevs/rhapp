import React from 'react'

import styled from 'styled-components'
import { V1_RED } from '../../common/colours'
import { SupperGroupStatus } from '../../store/supper/types'

const MainContainer = styled.div<{
  backgroundColor?: string
  roundVersion?: boolean
  borderColor: string
}>`
  border: ${(props) => `3px solid ${props.borderColor}`};
  border-radius: ${(props) => (props.roundVersion ? '30px' : '10px')};
  width: fit-content;
  padding: 2px 5px;
  height: fit-content;
  min-width: 3rem;
  margin: ${(props) => (props.roundVersion ? '5px 0' : '5px')};
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  background-color: ${(props) => props.backgroundColor ?? ''};
`

const TextContainer = styled.text<{ roundVersion?: boolean }>`
  margin: 0 4px;
  font-size: ${(props) => (props.roundVersion ? '12px' : '14px')};
  font-weight: bold;
  ${(props) => !props.roundVersion && `font-family: 'Inter';`}
  text-transform: uppercase;
`

type Props = {
  text: SupperGroupStatus | string
  backgroundColor?: string
  roundVersion?: boolean
}

export const SGStatusBubble = (props: Props) => {
  const BACKGROUND_COLOR = props.backgroundColor ?? 'rgba(222, 95, 76, 0.35);'
  const showRoundVersion = props.roundVersion ?? false
  return (
    <MainContainer borderColor={V1_RED} backgroundColor={BACKGROUND_COLOR} roundVersion={showRoundVersion}>
      <TextContainer roundVersion={showRoundVersion}>{props.text}</TextContainer>
    </MainContainer>
  )
}
