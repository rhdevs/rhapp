import React, { useEffect } from 'react'
import styled from 'styled-components'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import bookingsIcon from '../../../assets/bookingsIcon.svg'
import messageIcon from '../../../assets/messageIcon.svg'
import adminIcon from '../../../assets/adminIcon.svg'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { DateRange } from 'react-date-range'
import { useHistory } from 'react-router-dom'
import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file
import Button from '../../../components/Mobile/Button'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import { Alert } from 'antd'
import 'antd/dist/antd.css'
import { PATHS } from '../../Routes'
import { RootState } from '../../../store/types'
import {
  createNewBookingFromFacility,
  fetchFacilityNameFromID,
  getAllBookingsForFacility,
  SetIsLoading,
  setViewDates,
} from '../../../store/facilityBooking/action'
import { months } from '../../../common/dates'
import LoadingSpin from '../../../components/LoadingSpin'

const MainContainer = styled.div`
  width: 100%;
  height: 100vh;
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
  background-color: #fafaf4;
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
  const history = useHistory()
  const params = useParams<{ facilityID: string }>()
  const {
    ViewStartDate,
    ViewEndDate,
    createSuccess,
    createFailure,
    isLoading,
    facilityBookings,
    selectedFacilityName,
  } = useSelector((state: RootState) => state.facilityBooking)

  useEffect(() => {
    dispatch(SetIsLoading(true))
    dispatch(fetchFacilityNameFromID(parseInt(params.facilityID)))
    dispatch(getAllBookingsForFacility())
  }, [dispatch])

  const MyBookingIcon = (
    <img
      src={bookingsIcon}
      onClick={() => {
        history.push(PATHS.VIEW_MY_BOOKINGS_USERID + '/' + localStorage.getItem('userID'))
      }}
    />
  )

  const getHumanReadableTime = (eventStartTime: number) => {
    const date = new Date(eventStartTime * 1000)
    let hour = date.getHours().toString()
    if (hour.length == 1) {
      hour = '0' + hour
    }
    let minutes = date.getMinutes().toString()
    if (minutes.length == 1) {
      minutes = '0' + minutes
    }

    return hour + minutes
  }

  const AlertSection = (
    <AlertGroup>
      {createSuccess && (
        <Alert message="Successfully Created Event" description="Yay yippe doodles" type="success" closable showIcon />
      )}
      {createFailure && <Alert message="Event not created!!!" type="error" closable showIcon />}
    </AlertGroup>
  )

  return (
    <>
      <TopNavBar title={selectedFacilityName} rightComponent={MyBookingIcon} />
      <MainContainer>
        {isLoading && <LoadingSpin />}
        {!isLoading && (
          <>
            {AlertSection}
            <DateSelectorGroup>
              <DateRange
                editableDateInputs={true}
                color="#DE5F4C"
                onChange={(item) => dispatch(setViewDates(item))}
                moveRangeOnFirstSelection={false}
                rangeColors={['#DE5F4C', '#002642']}
                ranges={[
                  {
                    startDate: ViewStartDate,
                    endDate: ViewEndDate,
                    key: 'ViewDateSelection',
                  },
                ]}
              />
            </DateSelectorGroup>

            <ActionButtonGroup>
              <StyledButton
                onButtonClick={() => {
                  dispatch(
                    createNewBookingFromFacility(ViewStartDate, ViewEndDate, selectedFacilityName, params.facilityID),
                  )
                  history.push('/facility/booking/create')
                }}
                hasSuccessMessage={false}
                stopPropagation={false}
                defaultButtonDescription={'Book Facility'}
                defaultButtonColor="#DE5F4C"
                updatedButtonColor="#DE5F4C"
                updatedTextColor="white"
              />
              {/* <div onClick={() => console.log('pressed')}>
                <StyledButton
                  onButtonClick={(buttonIsPressed) => dispatch(setViewFacilityMode(buttonIsPressed))}
                  hasSuccessMessage={false}
                  stopPropagation={false}
                  defaultButtonDescription={'👓 Bookings ⌄'}
                  defaultButtonColor="transparent"
                  updatedButtonColor="transparent"
                  updatedTextColor="#DE5F4C"
                  defaultTextColor="#DE5F4C"
                  updatedButtonDescription={'🕶 Availabilities ⌄'}
                />
              </div> */}
            </ActionButtonGroup>
            <DateDisplayText>
              {ViewStartDate.getDate() + ' ' + months[ViewStartDate.getMonth()]} to{' '}
              {ViewEndDate.getDate() + ' ' + months[ViewEndDate.getMonth()]}
            </DateDisplayText>
            <EventsGroup>
              {facilityBookings?.map((event) => (
                <EventCard
                  key={event.bookingID}
                  onClick={() => {
                    console.log('clicked on event')
                  }}
                >
                  {/* <EventAvatar src={dummyAvatar} /> */}
                  <EventLabels>
                    <EventBoldLabel>
                      📅{' '}
                      <b>
                        {getHumanReadableTime(event.startTime)} to {getHumanReadableTime(event.endTime)}
                      </b>
                    </EventBoldLabel>
                    <EventNormalLabel>
                      <b> {event?.ccaName} </b>
                      {event.eventName}
                    </EventNormalLabel>
                  </EventLabels>
                  <EventRightDisplay>
                    {event.userID === 'you' ? (
                      <Icon src={adminIcon} />
                    ) : (
                      <Icon
                        onClick={() => {
                          console.log('contact yes')
                        }}
                        src={messageIcon}
                      />
                    )}
                    <EventDateLabel>{event.startTime}</EventDateLabel>
                  </EventRightDisplay>
                </EventCard>
              ))}
              {facilityBookings.length === 0 && <p>There are no bookings in the selected range!</p>}
            </EventsGroup>
            <BottomNavBar />
          </>
        )}
      </MainContainer>
    </>
  )
}
