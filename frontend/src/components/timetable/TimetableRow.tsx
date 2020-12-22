import React, { useEffect } from 'react'
import styled from 'styled-components'
import EventCell from './EventCell'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/types'
import { fetchUserRhEvents } from '../../store/scheduling/actions'

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
  flex: 0 1 auto;
`

const ChildrenContainer = styled.div``
// margin-left: calc(0.0625rem);

type RHEvent = {
  eventName: string
  location: string
  day: string
  endTime: string
  startTime: string
}

type Props = {
  timetableStartTime: number
  timetableEndTime: number
  day: string
  width?: number
  children: RHEvent[]
  //   children?: RHEvent
}

function TimetableRow(props: Props) {
  // const dispatch = useDispatch()
  const { userRhEvents } = useSelector((state: RootState) => state.scheduling)

  // console.log(props.children)
  return (
    <TimetableRowContainer>
      <DayContainer>
        <DaySpanContainer>{props.day}</DaySpanContainer>
      </DayContainer>
      <TimetableDayContainer style={{ width: props.width + 'rem' }}>
        {/* <ChildrenContainer
          style={{ marginLeft: `calc((${Number(props.children?.startTime)}-${props.timetableStartTime})/100 * 8rem)` }}
        >
          {props.children ? (
            <EventCell
              eventStartTime={props.children?.startTime}
              eventEndTime={props.children?.endTime}
              eventTitle={props.children?.eventName}
              eventLocation={props.children?.location}
            />
          ) : (
            <></>
          )}
        </ChildrenContainer> */}
        {userRhEvents.map((individualEvent, index) => {
          // console.log(individualEvent)
          return (
            <ChildrenContainer
              key={index}
              style={{
                marginLeft: `calc((${Number(individualEvent.startTime)}-${
                  props.timetableStartTime
                })/100 * 8rem + 0.0625rem)`,
              }}
            >
              <EventCell
                eventStartTime={individualEvent.startTime}
                eventEndTime={individualEvent.endTime}
                eventTitle={individualEvent.eventName}
                eventLocation={individualEvent.location}
              />
            </ChildrenContainer>
          )
        })}
      </TimetableDayContainer>
    </TimetableRowContainer>
  )
}

export default TimetableRow
