import React, { useEffect } from 'react'
import styled from 'styled-components'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import bookingsIcon from '../../../assets/bookingsIcon.svg'
import messageIcon from '../../../assets/messageIcon.svg'
import adminIcon from '../../../assets/adminIcon.svg'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { DateRange } from 'react-date-range'
import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file
import Button from '../../../components/Mobile/Button'
import { Alert } from 'antd'
import 'antd/dist/antd.css'

const MainContainer = styled.div`import { Alert } from 'antd';
  width: 100%;
  height: 100%;
  background-color: #fafaf4;
`

const StyledButton = styled(Button)`
  .ant-btn {
    border-radius: 25px;
  }
`

const DateDisplayText = styled.p`
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  text-align: right;
  padding: 10px 23px 0px 0px;
}
`

const Icon = styled.img`
  padding: 20px;
`

const ActionButtonGroup = styled.div`
  justify-content: space-between;
  display: flex;
  padding: 0px 23px 0px 23px;
`

const EventsGroup = styled.div``

const EventCard = styled.div`
  position: relative;
  cursor: pointer;
  background-color: #ffffff;
  margin: 23px;
  min-height: 70px;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  padding: 15px;
`

const AlertGroup = styled.div`
  margin: 23px;
`

const EventLabels = styled.div`
  align-self: center;
`

const EventBoldLabel = styled.p`
  margin-bottom: 0em;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
`

const EventNormalLabel = styled.p`
  margin-bottom: 0em;
  font-style: normal;
  font-weight: normal;
  font-size: 11px;
  line-height: 14px;
`

const EventDateLabel = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  text-align: right;

  color: #c4c4c4;
`

const DateSelectorGroup = styled.div`
  margin: 23px;
  font-family: inter;
  display: flex;
  place-content: center;
  align-self: center;
`

const EventRightDisplay = styled.div`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translate(-17%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
`

export default function ViewFacility() {
  const dispatch = useDispatch()
  // const { sampleStateText } = useSelector((state: RootState) => state.home)

  const params = useParams<{ facilityName: string }>()

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
      eventOwner: 'not you',
    },
    {
      id: 2,
      date: '18 Dec',
      startTime: '1530',
      endTime: '1720',
      eventName: 'Training',
      eventCCA: 'Voices',
      eventOwner: 'you',
    },
  ]

  const MyBookingIcon = <img src={bookingsIcon} />

  return (
    <>
      <TopNavBar title={params.facilityName} rightComponent={MyBookingIcon} />
      <MainContainer>
        <AlertGroup>
          <Alert
            message="Successfully Created Event"
            description="Yay yippe doodles"
            type="success"
            closable
            showIcon
          />
          <Alert
            message="Event not created!!!"
            description="Insert error message here"
            type="error"
            closable
            showIcon
          />
        </AlertGroup>
        <DateSelectorGroup>
          <DateRange
            editableDateInputs={true}
            color="#DE5F4C"
            // onChange={(item) => setState([item.selection])}
            moveRangeOnFirstSelection={false}
            // ranges={state}
          />
        </DateSelectorGroup>

        <ActionButtonGroup>
          <StyledButton
            hasSuccessMessage={false}
            stopPropagation={false}
            defaultButtonDescription={'Book Facility'}
            defaultButtonColor="#DE5F4C"
            updatedButtonColor="#DE5F4C"
            updatedTextColor="white"
          />
          <StyledButton
            hasSuccessMessage={false}
            stopPropagation={false}
            defaultButtonDescription={'👓 Bookings ⌄'}
            defaultButtonColor="transparent"
            updatedButtonColor="transparent"
            updatedTextColor="#DE5F4C"
            defaultTextColor="#DE5F4C"
            updatedButtonDescription={'🕶 Availabilities ⌄'}
          />
        </ActionButtonGroup>
        <DateDisplayText>16 Dec to 18 Dec</DateDisplayText>
        <EventsGroup>
          {dummyEvents.map((event) => (
            <EventCard
              key={event.id}
              onClick={() => {
                console.log('clicked on event')
              }}
            >
              {/* <EventAvatar src={dummyAvatar} /> */}
              <EventLabels>
                <EventBoldLabel>
                  📅{' '}
                  <b>
                    {event.startTime} to {event.endTime}
                  </b>
                </EventBoldLabel>
                <EventNormalLabel>
                  <b> {event.eventCCA} </b>
                  {event.eventName}
                </EventNormalLabel>
              </EventLabels>
              <EventRightDisplay>
                {event.eventOwner === 'you' ? (
                  <Icon src={adminIcon} />
                ) : (
                  <Icon
                    onClick={() => {
                      console.log('contact yes')
                    }}
                    src={messageIcon}
                  />
                )}
                <EventDateLabel>{event.date}</EventDateLabel>
              </EventRightDisplay>
            </EventCard>
          ))}
        </EventsGroup>
      </MainContainer>
    </>
  )
}
