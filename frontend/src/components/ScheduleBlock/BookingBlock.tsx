import React, { useState } from 'react'
import styled from 'styled-components'
import { BookingBlock, TextContainer, Availability } from './BlockStyles'

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

const BookBlock = (props: Props) => {
  const list = props.list
  const setList = props.setList
  const index = props.index

  const changeOccupy = () => {
    const newList = [...list]
    newList[index].occupied = !newList[index].occupied
    setList(newList)
  }

  return (
    <BookingBlock onClick={() => changeOccupy()} occupied={list[index].occupied} ccaId={list[index].id}>
      <TextContainer>
        <Availability>{list[index].name}</Availability>
        <Availability>{list[index].eventName}</Availability>
      </TextContainer>
    </BookingBlock>
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

// const renderCCABooking = () => {
//   const [occupy, setOccupy] = useState(mockValues)

//   return (
//     <DailyContainer>
//       {occupy.map((value, index) => (
//         <ListItem key={index} list={occupy} setList={setOccupy} index={index} />
//       ))}
//     </DailyContainer>
//   )
// }
export default BookBlock
