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
import { DOMAIN_URL, ENDPOINTS } from '../../../store/endpoints'

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
  padding: 3px 23px 3px 23px;
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
  padding: 23px;
  font-family: inter;
  display: flex;
  place-content: center;
  align-self: center;
  background-color: #fafaf4;
  border-radius: 15px !important;

  .rdrDateDisplayWrapper {
    border-radius: 9px !important;
  }
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
    dispatch(getAllBookingsForFacility(ViewStartDate, ViewEndDate, parseInt(params.facilityID)))
  }, [])

  const fetchTelegram = async (booking) => {
    try {
      fetch(DOMAIN_URL.FACILITY + ENDPOINTS.TELEGRAM_HANDLE + '/' + booking.userID, {
        method: 'GET',
        mode: 'cors',
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data.telegramHandle === '' || data.telegramHandle === undefined) {
            console.log(data.err)
          } else {
            openTelegram(data.telegramHandle)
          }
        })
    } catch (err) {
      console.log(err)
    }
  }

  const openTelegram = (userID) => {
    const site = 'https://telegram.me/' + userID
    window.open(site)
  }

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

  const getHumanReadableDate = (eventTime: number) => {
    const date = new Date(eventTime * 1000)
    const day = date.getUTCDate() + 1
    const monthInt = date.getUTCMonth()

    return day + ' ' + months[monthInt]
  }

  const AlertSection = (
    <AlertGroup>
      {createSuccess && <Alert message="Successful" description="Yay yippe doodles" type="success" closable showIcon />}
      {createFailure && <Alert message="Not Successful Boohoo :-(" type="error" closable showIcon />}
    </AlertGroup>
  )

  return (
    <div style={{ backgroundColor: '#fafaf4' }}>
      <TopNavBar title={selectedFacilityName} rightComponent={MyBookingIcon} />
      <MainContainer>
        <>
          {AlertSection}
          <DateSelectorGroup>
            <DateRange
              editableDateInputs={true}
              color="#DE5F4C"
              onChange={(item) => {
                dispatch(SetIsLoading(true))
                dispatch(setViewDates(item, parseInt(params.facilityID)))
              }}
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
          {!isLoading && (
            <EventsGroup>
              {facilityBookings?.map((event) => (
                <EventCard
                  key={event.bookingID}
                  onClick={() => {
                    history.push(PATHS.VIEW_FACILITY_BOOKING_ID + event.bookingID)
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
                    {event.userID === localStorage.getItem('userID') ? (
                      <Icon src={adminIcon} />
                    ) : (
                      <Icon
                        onClick={() => {
                          fetchTelegram(event)
                        }}
                        src={messageIcon}
                      />
                    )}
                    <EventDateLabel>{getHumanReadableDate(event.startTime)}</EventDateLabel>
                  </EventRightDisplay>
                </EventCard>
              ))}
              {facilityBookings.length === 0 && (
                <p style={{ margin: '23px' }}>There are no bookings in the selected range!</p>
              )}
            </EventsGroup>
          )}
          {isLoading && <LoadingSpin />}
          <BottomNavBar />
        </>
      </MainContainer>
    </div>
  )
}
