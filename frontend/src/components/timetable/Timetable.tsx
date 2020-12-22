import React, { useState } from 'react'
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
  padding-left: 0.45rem;
  padding-right: 5.225rem;
  font-weight: 600;
`

type RHEvent = {
  eventName: string
  location: string
  day: string
  endTime: string
  startTime: string
}

type Props = {
  events: RHEvent[][]
}

function Timetable(props: Props) {
  const DEFAULT_START_TIME = 700
  const DEFAULT_END_TIME = 1900
  const timeArray = []

  const dummyStartTime = 0
  const timetableStartTime = DEFAULT_START_TIME < dummyStartTime ? DEFAULT_START_TIME : dummyStartTime
  const dummyEndTime = 2400
  const timetableEndTime = DEFAULT_END_TIME < dummyEndTime ? dummyEndTime : DEFAULT_END_TIME
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

  //   const filterEventsByDay = (day: string) => {
  //     const dayEventsArray: RHEvent[] = []
  //     props.events.map((indivModule) => {
  //       indivModule.map((indivClass) => {
  //         console.log(indivClass.day)
  //         if (indivClass.day === day) {
  //           dayEventsArray.push(indivClass)
  //           console.log(indivClass)
  //         }
  //       })
  //     })
  //     return dayEventsArray
  //   }

  //   const [monEvents] = useState<RHEvent[]>(filterEventsByDay('Monday'))
  //   const [tueEvents] = useState<RHEvent[]>(filterEventsByDay('Tuesday'))
  //   const [wedEvents] = useState<RHEvent[]>(filterEventsByDay('Wednesday'))
  //   const [thuEvents] = useState<RHEvent[]>(filterEventsByDay('Thursday'))
  //   const [friEvents] = useState<RHEvent[]>(filterEventsByDay('Friday'))
  //   const [satEvents] = useState<RHEvent[]>(filterEventsByDay('Saturday'))
  //   const [sunEvents] = useState<RHEvent[]>(filterEventsByDay('Sunday'))

  //   const splitEventsByDay = (eventsArray: RHEvent[][]) => {
  //     console.log(eventsArray)
  //     eventsArray.map((indivModule) => {
  //       indivModule.map((indivClass) => {
  //         switch (indivClass.day) {
  //           case 'Monday':
  //             monEvents.push(indivClass)
  //             break
  //           case 'Tuesday':
  //             tueEvents.push(indivClass)
  //             break
  //           case 'Wednesday':
  //             wedEvents.push(indivClass)
  //             break
  //           case 'Thursday':
  //             thuEvents.push(indivClass)
  //             break
  //           case 'Friday':
  //             friEvents.push(indivClass)
  //             break
  //         }
  //       })
  //     })
  //     console.log(monEvents)
  //   }

  //   const weekEventsArray = [
  //     filterEventsByDay('Monday'),
  //     filterEventsByDay('Tuesday'),
  //     filterEventsByDay('Wednesday'),
  //     filterEventsByDay('Thursday'),
  //     filterEventsByDay('Friday'),
  //     filterEventsByDay('Saturday'),
  //     filterEventsByDay('Sunday'),
  //   ]

  const dummyEvent: RHEvent = {
    eventName: 'dummy event',
    location: 'in my room',
    day: 'Monday',
    endTime: '1200',
    startTime: '1000',
  }

  // console.log(props.events)

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
                key={index}
                day={day}
                width={((timetableEndTime - timetableStartTime) / 100) * 8}
                timetableStartTime={timetableStartTime}
                timetableEndTime={timetableEndTime}
              >
                {props.events[index]}
              </TimetableRow>
            )
          })}
        </TimetableRowsContainer>
      </TimetableWithTimeContainer>
    </TimetableContainer>
  )
}

export default Timetable
