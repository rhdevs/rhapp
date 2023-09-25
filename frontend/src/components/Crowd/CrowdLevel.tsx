import React from 'react'
import styled from 'styled-components'

// MAGIC NUMBERS
const HIGH = 45
const MEDIUM = 20
const LOW = 0

const LevelContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 5px;
  border: 1px solid;
  min-height: 70px;
  border-radius: 20px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
`

const LevelHeader = styled.h2`
  font-weight: 600;
  font-size: 17px;
  margin: 8.5px 0;
`

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const LevelText = styled.p<LevelProps>`
  font-size: 25px;
  font-weight: 500;
  color: ${(props) => {
    if (props.level == null) {
      return 'default'
    }

    if (props.level > HIGH) {
      return 'red'
    }

    if (props.level > MEDIUM) {
      return 'orange'
    }

    if (props.level > LOW) {
      return 'green'
    }
    return 'default'
  }};
`

type CrowdProps = {
  name: string
  level: number | null
  icon: React.ReactNode
}

type LevelProps = {
  level: number | null
}

export const CrowdLevel = (props: CrowdProps) => {
  const getCrowdText = (level: number | null): string => {
    if (level == null) {
      return `Undefined at this moment`
    }

    const roundedLevel: number = +level.toFixed(2)

    if (roundedLevel > HIGH) {
      return `HIGH (${roundedLevel})`
    }

    if (roundedLevel > MEDIUM) {
      return `MEDIUM (${roundedLevel})`
    }

    if (roundedLevel > LOW) {
      return `LOW (${roundedLevel})`
    }
    return `Undefined at this moment`
  }

  return (
    <LevelContainer>
      {props.icon}
      <TextContainer>
        <LevelHeader>{props.name}</LevelHeader>
        <LevelText level={props.level}>{getCrowdText(props.level)}</LevelText>
      </TextContainer>
    </LevelContainer>
  )
}
