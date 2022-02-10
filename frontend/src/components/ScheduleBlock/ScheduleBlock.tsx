import React, { useState } from 'react'
import styled from 'styled-components'

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

export const IndividualBookings = styled.div<{ background?: boolean; type: number }>`
  margin: 15px 2%;
  border-radius: 5px;
  padding: 15px 15px;
  color: #000000;
  display: flex;
  align-items: center;
  white-space: nowrap;
  min-height: 100px;
  ${(props) => (props.background ? colours.occupied : props.type % 2 == 0 ? colours.empty : colours.altempty)}
`

export const TextContainer = styled.div`
  margin-left: 15px;
`
export const Availability = styled.h3`
  color: inherit;
  font-weight: 350;
`
export const TimeText = styled.h3`
  color: inherit;
  font-weight: 350;
`

const colours = {
  occupied: `background: #fd0000;`,
  empty: `background: #F1F3F7;`,
  altempty: `background: #F6F6F6;`,
}

type Props = {
  list: listEntry[]
  setList: React.Dispatch<React.SetStateAction<listEntry[]>>
  index: number
}
type listEntry = {
  id: number
  event: string
  location: string
  occupied: boolean
  time: string
}

const ListItem = (props: Props) => {
  const list = props.list
  const setList = props.setList
  const index = props.index

  const changeOccupy = () => {
    const newList = [...list]
    newList[index].occupied = !newList[index].occupied
    setList(newList)
  }

  return (
    <IndividualBookings onClick={() => changeOccupy()} background={list[index].occupied} type={list[index].id}>
      <TextContainer>
        <Availability>{list[index].event}</Availability>
        <Availability>{list[index].location}</Availability>
        <Availability>{list[index].time}</Availability>
      </TextContainer>
    </IndividualBookings>
  )
}

const mockValues = [
  { id: 1, event: 'Empty', location: 'UL', occupied: false, time: '0800' },
  { id: 2, event: 'Empty', location: 'UL', occupied: false, time: '0900' },
  { id: 3, event: 'Empty', location: 'UL', occupied: false, time: '1000' },
  { id: 4, event: 'CCA', location: 'UL', occupied: true, time: '1100' },
  { id: 5, event: 'Empty', location: 'UL', occupied: false, time: '1200' },
  { id: 6, event: 'Empty', location: 'UL', occupied: false, time: '1300' },
  { id: 7, event: 'Empty', location: 'UL', occupied: false, time: '1400' },
  { id: 8, event: 'Empty', location: 'UL', occupied: false, time: '1500' },
  { id: 9, event: 'Empty', location: 'UL', occupied: false, time: '1600' },
  { id: 10, event: 'Empty', location: 'UL', occupied: false, time: '1700' },
  { id: 11, event: 'Empty', location: 'UL', occupied: false, time: '1800' },
  { id: 12, event: 'Empty', location: 'UL', occupied: false, time: '1900' },
  { id: 13, event: 'Empty', location: 'UL', occupied: false, time: '2000' },
  { id: 14, event: 'Empty', location: 'UL', occupied: false, time: '2100' },
  { id: 15, event: 'Empty', location: 'UL', occupied: false, time: '2200' },
  { id: 16, event: 'Empty', location: 'UL', occupied: false, time: '2300' },
]

const renderDailySchedule = () => {
  const [occupy, setOccupy] = useState(mockValues)

  return (
    <DailyContainer>
      {occupy.map((value, index) => (
        <ListItem key={index} list={occupy} setList={setOccupy} index={index} />
      ))}
    </DailyContainer>
  )
}
export default renderDailySchedule
