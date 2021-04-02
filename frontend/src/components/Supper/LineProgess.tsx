import React from 'react'

import styled from 'styled-components'

const MainContainer = styled.div`
  margin: 2px;
`

const TextContainer = styled.text`
  display: flex;
  justify-content: center;
  padding-bottom: 5px;
`

const ProgressBar = styled.div<{ isColored: boolean; borderRadius: string }>`
  background-color: ${(props) => `${props.isColored ? '#002642' : '#C4C4C4'}`};
  width: 2rem;
  height: 10px;
  border-radius: ${(props) => `${props.borderRadius}`};
`

const ProgressSection = styled.div`
  display: flex;
  flex-direction: row;
  width: 26vw;
  justify-content: space-evenly;
  margin: auto;
`

type Props = {
  currentStep: number
  numberOfSteps: number
}

export const LineProgress = (props: Props) => {
  return (
    <MainContainer>
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
