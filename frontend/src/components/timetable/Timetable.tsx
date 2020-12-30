import React from 'react'
import styled from 'styled-components'
import { RHEvent } from '../../store/scheduling/types'
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
  padding-left: 10px;
`

const IndividualTimeContainer = styled.time`
  width: 8rem;
  font-weight: 600;
`

type Props = {
  eventsStartTime: number
  eventsEndTime: number
  events: RHEvent[][][]
}

function Timetable(props: Props) {
  const DEFAULT_START_TIME = 700
  const DEFAULT_END_TIME = 1900
  const timeArray = []

  const eventsStartTime = Math.round(props.eventsStartTime / 100) * 100
  const timetableStartTime = DEFAULT_START_TIME < eventsStartTime ? DEFAULT_START_TIME : eventsStartTime
  const eventsEndTime = Math.round(props.eventsEndTime / 100) * 100
  const timetableEndTime = DEFAULT_END_TIME < eventsEndTime ? eventsEndTime : DEFAULT_END_TIME
  for (let i = timetableStartTime; i < timetableEndTime; i += 100) {
    if (i === 0) {
      timeArray.push('000' + i)
    } else if (i < 1000) {
      timeArray.push('0' + i)
    } else {
      timeArray.push(i)
    }
  }

  const daysArray = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

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
            return (
              <TimetableRow
                events={props.events[index]}
                key={index}
                day={day}
                width={((timetableEndTime - timetableStartTime) / 100) * 8}
                timetableStartTime={timetableStartTime}
                timetableEndTime={timetableEndTime}
              />
            )
          })}
        </TimetableRowsContainer>
      </TimetableWithTimeContainer>
    </TimetableContainer>
  )
}

export default Timetable
