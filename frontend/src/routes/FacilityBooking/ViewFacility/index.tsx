import React, { useEffect } from 'react'
import styled from 'styled-components'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import bookingsIcon from '../../../assets/bookingsIcon.svg'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { DateRange } from 'react-date-range'
import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file
import Button from 'antd-mobile/lib/button'
import { redirect } from '../../../store/route/action'
import { PATHS } from '../../Routes'

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fafaf4;
`

const ActionButtonGroup = styled.div``
const EventsGroup = styled.div``
const EventCard = styled.div`
  cursor: pointer;
  background-color: #ffffff;
  margin: 23px;
  max-width: 337px;a
  min-height: 70px;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
`

const EventHeader = styled.p`
  font-style: normal;
  font-weight: 600;
  font-size: 17px;
  line-height: 5px;
  color: #000000;
`

const EventSubHeader = styled.p`
  font-style: normal;
  font-weight: 200;
  font-size: 14px;
  line-height: 0px;
  color: #000000;
`

const EventLabels = styled.div`
  align-self: center;
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
        <DateRange
          editableDateInputs={true}
          color="#DE5F4C"
          // onChange={(item) => setState([item.selection])}
          moveRangeOnFirstSelection={false}
          // ranges={state}
        />
        <ActionButtonGroup>
          <Button
            onClick={() => {
              dispatch(redirect(PATHS.CREATE_FACILITY_BOOKING))
            }}
          >
            Book Facility
          </Button>
          <Button>Booking/Availability</Button>
        </ActionButtonGroup>
        <p>Date Range:16 Dec to 18 Dec</p>
        <EventsGroup>
          {dummyEvents.map((event) => (
            <EventCard key={event.id}>
              <EventLabels>
                <EventHeader>{event.eventName}</EventHeader>
                <EventSubHeader>{event.eventCCA}</EventSubHeader>
              </EventLabels>
            </EventCard>
          ))}
        </EventsGroup>
      </MainContainer>
    </>
  )
}
