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
export const CCABooking = styled.div<{ background?: boolean; type: number }>`
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

const colours = {
  occupied: `background: #fd0000;`,
  empty: `background: #F1F3F7;`,
  altempty: `background: #F6F6F6;`,
}

export const TextContainer = styled.div`
  margin-left: 15px;
`
export const Availability = styled.h3`
  color: inherit;
  font-weight: 350;
`
type Props = {
  list: listEntry[]
  setList: React.Dispatch<React.SetStateAction<listEntry[]>>
  index: number
}
type listEntry = {
  id: number
  name: string
  eventName: string
  occupied: boolean
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
    <CCABooking onClick={() => changeOccupy()} background={list[index].occupied} type={list[index].id}>
      <TextContainer>
        <Availability>{list[index].name}</Availability>
        <Availability>{list[index].eventName}</Availability>
      </TextContainer>
    </CCABooking>
  )
}

const mockValues = [
  { id: 1, name: 'Devs', eventName: 'CCA Trg', occupied: true },
  { id: 2, name: 'Devs', eventName: 'CCA Trg', occupied: true },
  { id: 3, name: 'Empty', eventName: 'Nil', occupied: false },
  { id: 4, name: 'Empty', eventName: 'Nil', occupied: false },
  { id: 5, name: 'Empty', eventName: 'Nil', occupied: false },
  { id: 6, name: 'Empty', eventName: 'Nil', occupied: false },
]

const renderCCABooking = () => {
  const [occupy, setOccupy] = useState(mockValues)

  return (
    <DailyContainer>
      {occupy.map((value, index) => (
        <ListItem key={index} list={occupy} setList={setOccupy} index={index} />
      ))}
    </DailyContainer>
  )
}
export default renderCCABooking
