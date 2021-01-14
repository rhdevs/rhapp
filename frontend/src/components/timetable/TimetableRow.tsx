import React from 'react'
import styled from 'styled-components'
import EventCell from './EventCell'
import { TimetableEvent } from '../../store/scheduling/types'

const TimetableRowContainer = styled.li`
  position: relative;
  display: flex;
  flex: 1 0 auto;
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
  z-index: 2;
`

const DaySpanContainer = styled.span`
  width: 0.7rem;
  font-size: 0.85rem;
  line-height: 1.1;
  word-break: break-all;
`

const TimetableDayContainer = styled.div`
  min-width: 64rem;
  outline: 1px solid #aeb1b5;
  background: linear-gradient(to right, #f3f5f8 50%, #fff 0);
  flex: 0 1 auto;
`

const ChildrenContainer = styled.div`
  display: flex;
`

type Props = {
  oneHourWidth: string
  oneDayMinHeight: string
  events: TimetableEvent[][]
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
  const leftMargin = (eventRow, individualEvent, index) => {
    let leftPosition
    if (index === 0) {
      leftPosition = (Number(individualEvent.startTime) - props.timetableStartTime) / 100
    } else {
      leftPosition = (Number(individualEvent.startTime) - Number(eventRow[index - 1].endTime)) / 100
    }
    const margin = leftPosition * Number(props.oneHourWidth.replace('rem', '')) + 0.0625
    if (margin < 0) {
      return '0rem'
    } else {
      return String(margin) + 'rem'
    }
  }

  return (
    <TimetableRowContainer style={{ minHeight: `${props.oneDayMinHeight}` }}>
      <DayContainer style={{ minHeight: `${props.oneDayMinHeight}` }}>
        <DaySpanContainer>{props.day}</DaySpanContainer>
      </DayContainer>
      <TimetableDayContainer
        style={{
          minWidth: props.width + 'rem',
          backgroundSize: `calc(${props.oneHourWidth}*2)`,
          minHeight: `${props.oneDayMinHeight}`,
          maxWidth: `calc(${props.oneHourWidth}*24)`,
        }}
      >
        {props.events?.map((eventRow, index) => {
          return (
            <ChildrenContainer key={index}>
              {eventRow.map((individualEvent, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      marginLeft: `${leftMargin(eventRow, individualEvent, index)}`,
                    }}
                  >
                    <EventCell
                      // isSingleEvent={!individualEvent.hasOverlap}
                      eventType={'mods'}
                      oneHourWidth={props.oneHourWidth}
                      oneDayMinHeight={props.oneDayMinHeight}
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
