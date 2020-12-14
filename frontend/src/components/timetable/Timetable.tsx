import React, { ReactElement } from 'react'
import styled from 'styled-components'
import TimetableRow from './TimetableRow'

const TimetableContainer = styled.div`
  overflow: auto;
`

const TimetableRowsContainer = styled.ol`
  padding: 0;
  margin: 0;
`

const TimetableWithTimeContainer = styled.div`
  display: inline-block;
  padding-right: 15px;
`

const TimeContainer = styled.div`
  display: flex;
`

const IndividualTimeContainer = styled.time`
  padding-left: 7px;
  padding-right: 83px;
  font-weight: 600;
`

type Props = {
  children?: ReactElement
  sunChildren?: ReactElement
  monChildren?: ReactElement
  tueChildren?: ReactElement
  wedChildren?: ReactElement
  thuChildren?: ReactElement
  friChildren?: ReactElement
  satChildren?: ReactElement
}

function Timetable(props: Props) {
  const DEFAULT_START_TIME = 1000
  const DEFAULT_END_TIME = 1800
  const timeArray = []

  const dummyStartTime = 1100
  const timetableStartTime = DEFAULT_START_TIME < dummyStartTime ? DEFAULT_START_TIME : dummyStartTime
  const dummyEndTime = 1200
  const timetableEndTime = DEFAULT_END_TIME < dummyEndTime ? dummyEndTime : DEFAULT_END_TIME
  for (let i = timetableStartTime; i < timetableEndTime; i += 100) {
    timeArray.push(i)
  }

  const daysArray = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  const eventsArray = [
    props.sunChildren,
    props.monChildren,
    props.tueChildren,
    props.wedChildren,
    props.thuChildren,
    props.friChildren,
    props.satChildren,
  ]
  console.log(eventsArray)
  return (
    <TimetableContainer>
      <TimetableWithTimeContainer>
        <TimeContainer>
          {timeArray.map((time, index) => {
            return <IndividualTimeContainer key={index}>{time}</IndividualTimeContainer>
          })}
        </TimeContainer>
        <TimetableRowsContainer>
          {daysArray.map((day, index) => {
            console.log(eventsArray[index])
            return (
              <TimetableRow key={index} day={day} width={((timetableEndTime - timetableStartTime) / 100) * 8}>
                {eventsArray[index]}
              </TimetableRow>
            )
          })}
        </TimetableRowsContainer>
      </TimetableWithTimeContainer>
    </TimetableContainer>
  )
}

export default Timetable
