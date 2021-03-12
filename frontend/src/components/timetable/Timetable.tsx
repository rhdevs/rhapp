import React from 'react'
import styled from 'styled-components'
import { TimetableEvent } from '../../store/scheduling/types'
import TimetableRow from './TimetableRow'

const TimetableContainer = styled.div`
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
`

const TimetableRowsContainer = styled.ol`
  padding: 0;
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
  font-weight: 600;
`

type Props = {
  eventsStartTime: number
  eventsEndTime: number
  events: TimetableEvent[][][]
}

function Timetable(props: Props) {
  const ONE_HOUR_WIDTH = '7rem'
  const ONE_DAY_MIN_HEIGHT = '4.5rem'

  const DEFAULT_START_TIME = 1000
  const DEFAULT_END_TIME = 1800
  const timeArray: Array<string> = []

  const eventsStartTime = Math.floor(props.eventsStartTime / 100) * 100
  let timetableStartTime = DEFAULT_START_TIME < eventsStartTime ? DEFAULT_START_TIME : eventsStartTime
  const eventsEndTime = Math.ceil(props.eventsEndTime / 100) * 100
  let timetableEndTime = DEFAULT_END_TIME < eventsEndTime ? eventsEndTime : DEFAULT_END_TIME
  if (timetableStartTime < 0) {
    timetableStartTime = 0
  }
  if (timetableEndTime > 2400) {
    timetableEndTime = 2400
  }

  for (let i = timetableStartTime; i < timetableEndTime; i += 100) {
    if (i === 0) {
      timeArray.push('000' + i)
    } else if (i < 1000) {
      timeArray.push('0' + i)
    } else {
      timeArray.push(i.toString())
    }
  }

  const daysArray = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

  return (
    <TimetableContainer>
      <TimetableWithTimeContainer>
        <TimeContainer>
          {timeArray.map((time, index) => {
            return (
              <IndividualTimeContainer style={{ width: `${ONE_HOUR_WIDTH}`, paddingLeft: '25px' }} key={index}>
                {time}
              </IndividualTimeContainer>
            )
          })}
        </TimeContainer>
        <TimetableRowsContainer>
          {daysArray.map((day, index) => {
            return (
              <TimetableRow
                oneHourWidth={ONE_HOUR_WIDTH}
                oneDayMinHeight={ONE_DAY_MIN_HEIGHT}
                events={props.events[index]}
                key={index}
                day={day}
                width={((timetableEndTime - timetableStartTime) / 100) * Number(ONE_HOUR_WIDTH.replace('rem', ''))}
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
