import React from 'react'

import styled from 'styled-components'
import { V1_BLUE } from '../../common/colours'

const MainContainer = styled.div<{ margin?: string }>`
  margin: ${(props) => props.margin ?? '2px'};
`

const TextContainer = styled.p`
  margin: 0;
  display: flex;
  justify-content: center;
  padding-bottom: 5px;
`

const ProgressBar = styled.div<{ isColored: boolean; borderRadius: string }>`
  background-color: ${(props) => `${props.isColored ? V1_BLUE : '#C4C4C4'}`};
  width: 2.5rem;
  height: 10px;
  border-radius: ${(props) => `${props.borderRadius}`};
  margin: 0 2px;
`

const ProgressSection = styled.div`
  display: flex;
  flex-direction: row;
  margin: auto;
  justify-content: center;
`

type Props = {
  currentStep: number
  numberOfSteps: number
  margin?: string
}

export const LineProgress = (props: Props) => {
  return (
    <MainContainer margin={props.margin}>
      <TextContainer>
        Step {props.currentStep} of {props.numberOfSteps}
      </TextContainer>
      <ProgressSection>
        {new Array(props.numberOfSteps).fill(0).map((_x, index) => {
          let BORDER_RADIUS = ''
          if (index === 0) {
            BORDER_RADIUS = '3px 0 0 3px'
          } else if (index + 1 === props.numberOfSteps) {
            BORDER_RADIUS = '0 3px 3px 0 '
          }
          return <ProgressBar key={index} isColored={index + 1 <= props.currentStep} borderRadius={BORDER_RADIUS} />
        })}
      </ProgressSection>
    </MainContainer>
  )
}
