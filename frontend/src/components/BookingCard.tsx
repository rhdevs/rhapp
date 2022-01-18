import React, { useEffect } from 'react'
import styled from 'styled-components'
import messageIcon from '../assets/messageIcon.svg'
import adminIcon from '../assets/adminIcon.svg'

import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { RootState } from '../store/types'
import { PATHS } from '../routes/Routes'
import { DOMAIN_URL, ENDPOINTS } from '../store/endpoints'
import { months, days } from '../common/dates'

const BookingGroup = styled.div``
const BookingContainer = styled.div`
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
const BookingLeftDisplay = styled.div`
  align-self: center;
  width: 80%;
`

const DateLabel = styled.div`
  margin-bottom: 0em;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  overflow: hidden;
  color: #ff705c;
`

const TimeLabel = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 14px;
`
const BookingCCAName = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 14px;
`

const BookingRightDisplay = styled.div`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translate(-17%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
`
const Icon = styled.img`
  padding: 20px;
`
export default function BookingCard() {
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
    selectedFacilityId,
  } = useSelector((state: RootState) => state.facilityBooking)
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
    const date = new Date((eventTime + 28800) * 1000)
    const numday = date.getUTCDate()
    const monthInt = date.getUTCMonth() + 1
    const day = date.getUTCDay()

    return numday + '/' + monthInt
  }

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

  return (
    <BookingGroup>
      {facilityBookings?.map((event) => (
        <BookingContainer
          key={event.bookingID}
          onClick={() => {
            history.push(PATHS.VIEW_FACILITY_BOOKING_ID + event.bookingID)
          }}
        >
          {/* <EventAvatar src={dummyAvatar} /> */}
          <BookingLeftDisplay>
            <DateLabel>
              <b>
                {days[ViewStartDate.getDay()]}{' '}
                {ViewStartDate.getDate() + ' ' + months[ViewStartDate.getMonth()] + ' ' + ViewStartDate.getFullYear()}
              </b>
            </DateLabel>
            <TimeLabel>
              <b>
                {getHumanReadableTime(event.startTime)} to {getHumanReadableTime(event.endTime)}
              </b>
            </TimeLabel>
            <BookingCCAName>
              <b>{event.ccaName ? event.ccaName : 'Personal'}</b>
            </BookingCCAName>
          </BookingLeftDisplay>
          <BookingRightDisplay>
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
          </BookingRightDisplay>
        </BookingContainer>
      ))}
      {facilityBookings.length === 0 && <p style={{ padding: '23px' }}>There are no bookings on this day!</p>}
    </BookingGroup>
  )
}
