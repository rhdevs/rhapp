import React, { ReactElement } from 'react'
import styled from 'styled-components'

const TimetableRowContainer = styled.li`
  position: relative;
  display: flex;
  flex: 1 0 auto;
  min-height: 4.5rem;
`

const DayContainer = styled.div`
  position: sticky;
  left: 1px;
  display: flex;
  flex: 0 0 1.5rem;
  justify-content: center;
  align-items: center;
  outline: 1px solid #aeb1b5;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 0.85rem;
  text-orientation: upright;
  writing-mode: tb;
  background-color: #fff;
  text-align: center;
  min-height: 67px;
  z-index: 2;
`

const DaySpanContainer = styled.span`
  width: 0.6rem;
  font-size: 0.85rem;
  line-height: 1.1;
  word-break: break-all;
`

const TimetableDayContainer = styled.div`
  min-height: 67px;
  min-width: 64rem;
  padding-bottom: 0.3rem;
  outline: 1px solid #aeb1b5;
  background: linear-gradient(to right, #f3f5f8 50%, #fff 0);
  background-size: 16rem;
`

const ChildrenContainer = styled.div`
  margin-left: calc(50% + 1px);
`

type Props = {
  day: string
  width?: number
  children?: ReactElement
}

function TimetableRow(props: Props) {
  return (
    <TimetableRowContainer>
      <DayContainer>
        <DaySpanContainer>{props.day}</DaySpanContainer>
      </DayContainer>
      <TimetableDayContainer style={{ width: props.width + 'rem' }}>
        <ChildrenContainer>{props.children}</ChildrenContainer>
      </TimetableDayContainer>
    </TimetableRowContainer>
  )
}

export default TimetableRow
