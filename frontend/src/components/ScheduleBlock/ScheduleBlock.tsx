import React from 'react'
import styled from 'styled-components'
import generateCalendar from 'antd/es/calendar/generateCalendar'

export const DailyContainer = styled.div`
  margin: 15px 2%;
  border-radius: 5px;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.25);
  padding: 2px;
`

export const Bookings_container = styled.div`
  margin: 0;
  height: 100%;
  width: 100%;
  color: black;
  padding: 7vh 0;
  border-radius: 5px;
  white-space: nowrap;
`
export const IndividualBookings = styled.div<{ background?: string }>`
  margin: 15px 2%;
  border-radius: 5px;
  padding: 15px 15px;
  color: #ffffff;
  display: flex;
  align-items: center;
  ${(props) =>
    props.background && props.background === 'occupied'
      ? colours.occupied
      : props.background === 'empty'
      ? colours.empty
      : colours.others}
  white-space: nowrap;
  min-height: 100px;
`
const colours = {
  occupied: `background: #fd0000;`,
  empty: `background: #22ff00;`,
  others: `background: #CE5C08;`,
}

export const TextContainer = styled.div`
  margin-left: 15px;
`
export const Availability = styled.h3<{ fontSize?: string }>`
  color: inherit;
  ${(props) => props.fontSize && `font-size: ${props.fontSize}`}
  font-weight: 350;
`

export const TimeText = styled.h3<{ fontSize?: string }>`
  color: inherit;
  ${(props) => props.fontSize && `font-size: ${props.fontSize}`}
  font-weight: 350;
`
export const EventCard = styled.div`
  position: absolute;
  min-width: 8em;
  left: -1px;
  width: 100%;
  overflow: hidden;
  white-space: initial;
  text-overflow: ellipsis;
  z-index: 100;
  border-radius: 20px;
  box-shadow: 10px 10px 10px 10px rgba(0, 0, 0, 0.25);
`
export const Timing_container = styled.div`
  height: 100%;
  width: 100%;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  flex-basis: min-content;
`

export const Time_container = styled.div`
  height: 10em;
`

const mockValues = [
  { id: 1, event: 'Empty', location: 'UL', type: 'empty', time: { start: '0800', end: '0900' } },
  { id: 2, event: 'Empty', location: 'UL', type: 'empty', time: { start: '0900', end: '1000' } },
  { id: 3, event: 'Empty', location: 'UL', type: 'empty', time: { start: '1000', end: '1100' } },
  { id: 4, event: 'Empty', location: 'UL', type: 'empty', time: { start: '1100', end: '1200' } },
  { id: 5, event: 'Empty', location: 'UL', type: 'empty', time: { start: '1200', end: '1300' } },
  { id: 6, event: 'Empty', location: 'UL', type: 'empty', time: { start: '1300', end: '1400' } },
  { id: 7, event: 'Empty', location: 'UL', type: 'empty', time: { start: '1400', end: '1500' } },
  { id: 8, event: 'Empty', location: 'UL', type: 'empty', time: { start: '1500', end: '1600' } },
  { id: 9, event: 'Empty', location: 'UL', type: 'empty', time: { start: '1600', end: '1700' } },
  { id: 10, event: 'Empty', location: 'UL', type: 'empty', time: { start: '1700', end: '1800' } },
  { id: 11, event: 'Empty', location: 'UL', type: 'empty', time: { start: '1800', end: '1900' } },
  { id: 12, event: 'Empty', location: 'UL', type: 'empty', time: { start: '1900', end: '2000' } },
  { id: 13, event: 'Empty', location: 'UL', type: 'empty', time: { start: '2000', end: '2100' } },
  { id: 14, event: 'Empty', location: 'UL', type: 'empty', time: { start: '2100', end: '2200' } },
  { id: 15, event: 'Empty', location: 'UL', type: 'empty', time: { start: '2200', end: '2300' } },
  { id: 16, event: 'Empty', location: 'UL', type: 'empty', time: { start: '2300', end: '0000' } },
]

const renderDailySchedule = () => (
  <DailyContainer>
    {mockValues.map((e) => (
      <IndividualBookings background={e.type} key={e.id}>
        <TextContainer>
          <Availability>{e.type}</Availability>
          <TimeText>{`${e.time.start} - ${e.time.end}`}</TimeText>
        </TextContainer>
      </IndividualBookings>
    ))}
  </DailyContainer>
)

const ScheduleBlock = () => {
  return (
    <>
      <Bookings_container>{renderDailySchedule()}</Bookings_container>
    </>
  )
}

export default ScheduleBlock
