import React, { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import deleteIcon from '../../../assets/deleteIcon.svg'
import editIcon from '../../../assets/editIcon.svg'
import messageIcon from '../../../assets/messageIcon.svg'
// import { RootState } from '../../store/types'

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fafaf4;
  color: #33363a;
`

const EventCard = styled.div`
  background: linear-gradient(to top, #ffffff 75%, #ef9688 25%);
  cursor: pointer;
  margin: 23px;
  padding: 15px;
  min-height: 500px;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  height: 100%;
  display: grid;
  grid-template-rows: 25% 50% 25%;
`

const HeaderGroup = styled.div`
  padding: 10px;
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
`

const IdText = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  color: #666666;
`
const DetailsGroup = styled.div`
  padding: 10px;
`

const Icon = styled.img`
  padding: 20px;
  height: 28px;
  width: 28px;
`

const ActionButtonGroup = styled.div`
  justify-content: space-around;
  display: flex;
  align-self: end;
`

const CardSubtitle = styled.p`
  font-style: normal;
  font-weight: 900;
  font-size: 14px;
  line-height: 14px;
  color: #33363a;
`

const CardDurationLabel = styled.p`
  font-weight: 600;
  font-size: 24px;
  line-height: 14px;

  color: #666666;
`

const CardTimeLabel = styled.p`
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  margin: 5px;
  text-align: left;
  color: #666666;
`

const TimeDetails = styled.div`
  display: grid;
  grid-template-columns: 35% 65%;
  margin: 0px;
`

const DateTimeDetails = styled.div`
  display: grid;
  grid-template-rows: 50% 50%;
  margin: 0px;
`
const EventOwnerDetails = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
`
export default function ViewBooking() {
  const params = useParams<{ bookingId: string }>()
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
    duration: string
    eventName: string
    eventCCA: string
    eventOwner: string
    description: string
  }

  const dummyEvents: Array<eventType> = [
    {
      id: 1,
      date: '17 Dec',
      startTime: '1530',
      endTime: '1720',
      duration: '20 mins',
      eventName: 'Bonding Camp',
      eventCCA: 'RHMP',
      eventOwner: 'not you',
      description: 'Backup location! Feel free to PM me',
    },
    {
      id: 2,
      date: '18 Dec',
      startTime: '1530',
      endTime: '1720',
      duration: '2 hrs',
      eventName: 'Training',
      eventCCA: 'Voices',
      eventOwner: 'you',
      description: 'Backup location! Feel free to PM me',
    },
  ]

  return (
    <>
      <TopNavBar title={'View Event'} />
      <MainContainer>
        {dummyEvents.map((event) => (
          <EventCard key={event.id}>
            <HeaderGroup>
              {event.eventName} <br />
              {event.eventCCA}
              <IdText>RHEID-{params.bookingId}</IdText>
            </HeaderGroup>
            <DetailsGroup>
              <TimeDetails>
                <CardDurationLabel>{event.duration}</CardDurationLabel>
                <DateTimeDetails>
                  <CardTimeLabel>
                    {event.date} {event.startTime}
                  </CardTimeLabel>
                  <CardTimeLabel>
                    {event.date} {event.endTime}
                  </CardTimeLabel>
                </DateTimeDetails>
              </TimeDetails>
              <EventOwnerDetails>
                <CardSubtitle>Created by</CardSubtitle>
                <p style={{ textAlign: 'right' }}>{event.eventOwner}</p>
              </EventOwnerDetails>
              <>
                <CardSubtitle>Additional Note</CardSubtitle>
                <p>{event.description}</p>
              </>
            </DetailsGroup>
            {event.eventOwner !== 'you' ? (
              <ActionButtonGroup>
                <Icon
                  onClick={() => {
                    console.log('contact yes')
                  }}
                  src={messageIcon}
                />
              </ActionButtonGroup>
            ) : (
              <ActionButtonGroup>
                <Icon src={editIcon} />
                <Icon src={deleteIcon} />
              </ActionButtonGroup>
            )}
          </EventCard>
        ))}
      </MainContainer>
    </>
  )
}
