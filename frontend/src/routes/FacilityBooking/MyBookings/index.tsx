import React, { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import dummyAvatar from '../../../assets/dummyAvatar.svg'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import deleteIcon from '../../../assets/deleteIcon.svg'
import editIcon from '../../../assets/editIcon.svg'

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fafaf4;
`
const BookingCard = styled.div`
  position: relative;
  cursor: pointer;
  background-color: #ffffff;
  margin: 23px;
  min-height: 70px;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
`

const BookingAvatar = styled.img`
  padding: 20px;
`

const BookingHeader = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 0px;

  color: rgba(0, 0, 0, 0.65);
`

const BookingSubHeader = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  line-height: 0px;

  color: rgba(0, 0, 0, 0.65);
`

const BookingTime = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 0px;

  color: #de5f4c;
`

const BookingLabels = styled.div`
  align-self: center;
`

const RightActionGroups = styled.div`
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translate(-17%, -50%);
`

const ActionButton = styled.img`
  padding: 15px;
`

export default function ViewMyBookings() {
  const dispatch = useDispatch()
  // const { sampleStateText } = useSelector((state: RootState) => state.home)

  useEffect(() => {
    // fetch all default facilities
  }, [dispatch])

  interface eventType {
    id: number
    date: string
    startTime: string
    endTime: string
    eventName: string
    eventCCA: string
    facility: string
    eventOwner: string
  }

  const dummyEvents: Array<eventType> = [
    {
      id: 1,
      date: '17 Dec',
      startTime: '1530',
      endTime: '1720',
      eventName: 'Bonding Camp',
      eventCCA: 'RHMP',
      facility: 'Band Room',
      eventOwner: 'not you',
    },
    {
      id: 2,
      date: '18 Dec',
      startTime: '1530',
      endTime: '1720',
      eventName: 'Training',
      eventCCA: 'Voices',
      facility: 'Alumni Room',
      eventOwner: 'you',
    },
  ]

  return (
    <>
      <TopNavBar title={'My Bookings'} />
      <MainContainer>
        {dummyEvents.map((event) => (
          <BookingCard
            key={event.eventName}
            onClick={() => {
              // view booking
            }}
          >
            <BookingAvatar src={dummyAvatar} />
            <BookingLabels>
              <BookingHeader>{event.facility}</BookingHeader>
              <BookingSubHeader>{event.eventCCA}</BookingSubHeader>
              <BookingTime>
                <b>{event.date}</b> {event.startTime} to {event.endTime}
              </BookingTime>
            </BookingLabels>
            <RightActionGroups>
              <ActionButton src={editIcon} />
              <ActionButton src={deleteIcon} />
            </RightActionGroups>
          </BookingCard>
        ))}
      </MainContainer>
    </>
  )
}
