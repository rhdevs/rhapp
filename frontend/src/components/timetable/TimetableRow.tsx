import React from 'react'
import styled from 'styled-components'
import EventCell from './EventCell'
import { RHEvent } from '../../store/scheduling/types'

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
  width: 0.7rem;
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
  flex: 0 1 auto;
`

const ChildrenContainer = styled.div`
  display: flex;
`

type Props = {
  events: RHEvent[][]
  timetableStartTime: number
  timetableEndTime: number
  day: string
  width?: number
}

type day = { [day: string]: number }
export const DAY_TO_NUMBER: day = {
  mon: 0,
  tue: 1,
  wed: 2,
  thu: 3,
  fri: 4,
  sat: 5,
  sun: 6,
}

function TimetableRow(props: Props) {
  return (
    <TimetableRowContainer>
      <DayContainer>
        <DaySpanContainer>{props.day}</DaySpanContainer>
      </DayContainer>
      <TimetableDayContainer style={{ minWidth: props.width + 'rem' }}>
        {props.events?.map((eventRow, index) => {
          return (
            <ChildrenContainer key={index}>
              {eventRow.map((individualEvent, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      marginLeft: `calc((${Number(individualEvent.startTime)} - ${
                        index === 0 ? props.timetableStartTime : Number(eventRow[index - 1].endTime)
                      }) / 100 * 8rem + 0.0625rem)`,
                    }}
                  >
                    <EventCell
                      eventStartTime={individualEvent.startTime}
                      eventEndTime={individualEvent.endTime}
                      eventTitle={individualEvent.eventName}
                      eventLocation={individualEvent.location}
                    />
                  </div>
                )
              })}
            </ChildrenContainer>
          )
        })}
      </TimetableDayContainer>
    </TimetableRowContainer>
  )
}

export default TimetableRow
