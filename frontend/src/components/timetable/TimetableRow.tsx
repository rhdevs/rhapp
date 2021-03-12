import React from 'react'
import styled from 'styled-components'
import EventCell from './EventCell'
import { TimetableEvent } from '../../store/scheduling/types'

const TimetableRowContainer = styled.li`
  position: relative;
  display: flex;
  flex-direction: row;
`

const DayContainer = styled.div`
  position: sticky;
  left: 1px;
  display: flex;
  flex: 0 0 1.5rem;
  justify-content: center;
  align-items: center;
  border: 1.2px solid rgb(174, 177, 181);
  border-radius: 5px 0px 0px 5px !important;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 0.85rem;
  background-color: #fff;
  text-align: center;
  z-index: 2;
`

const DaySpanContainer = styled.span`
  width: 3rem;
`

const TimetableDayContainer = styled.div`
  border: 0.1px groove rgb(255 255 255);
  border-radius: 0px 5px 5px 0px !important;
  background: linear-gradient(to right, #f3f5f8 50%, #fff 0);
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
  width: number
}

function TimetableRow(props: Props) {
  const leftMargin = (eventRow: TimetableEvent[], individualEvent: TimetableEvent, index: number) => {
    const individualEventStartHour = individualEvent.startTime.substring(0, 2)
    const individualEventStartMinute = individualEvent.startTime.substring(2, 4)
    let leftPosition

    if (index === 0) {
      leftPosition =
        Number(individualEventStartHour) - props.timetableStartTime / 100 + Number(individualEventStartMinute) / 60
    } else {
      const prevEventEndHour = eventRow[index - 1].endTime.substring(0, 2)
      const prevEventEndMinute = eventRow[index - 1].endTime.substring(2, 4)
      leftPosition =
        ((Number(individualEventStartHour) - Number(prevEventEndHour)) * 60 +
          Number(individualEventStartMinute) -
          Number(prevEventEndMinute)) /
        60
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
        }}
      >
        {props.events?.map((eventRow, indexOne) => {
          return (
            <ChildrenContainer style={{ minHeight: `${props.oneDayMinHeight}` }} key={indexOne}>
              {eventRow.map((individualEvent, indexTwo) => {
                return (
                  <div
                    key={indexTwo}
                    style={{
                      marginLeft: `${leftMargin(eventRow, individualEvent, indexTwo)}`,
                    }}
                  >
                    <EventCell
                      // isSingleEvent={!individualEvent.hasOverlap}
                      event={individualEvent}
                      eventType={individualEvent.eventType}
                      oneHourWidth={props.oneHourWidth}
                      oneDayMinHeight={props.oneDayMinHeight}
                      eventStartTime={individualEvent.startTime}
                      eventEndTime={individualEvent.endTime}
                      eventTitle={individualEvent.eventName}
                      eventLocation={individualEvent.location}
                      isLastRow={props.events.length === indexOne + 1}
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
