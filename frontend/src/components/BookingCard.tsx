import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { PATHS } from '../routes/Routes'
import { DOMAIN_URL, ENDPOINTS } from '../store/endpoints'
import { months, days } from '../common/dates'
import { get24Hourtime } from '../common/get24HourTime'
import { openUserTelegram } from '../common/telegramMethods'

import messageIcon from '../assets/messageIcon.svg'
import adminIcon from '../assets/adminIcon.svg'
import { Booking } from '../store/facilityBooking/types'

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
  font-weight: 600;
`

const DateComponent = styled.div`
  font-style: normal;
  font-size: 14px;
  overflow: hidden;
  color: #ff705c;
`

const TimeComponent = styled.div`
  font-style: normal;
  font-size: 14px;
  line-height: 14px;
  margin: 8px 0px 8px 0px;
`

const BookingCCAName = styled.div`
  font-style: normal;
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

export default function BookingCard({ bookings }: { bookings: Booking[] }) {
  const history = useHistory()
  const fetchTelegram = async (booking) => {
    try {
      fetch(DOMAIN_URL.FACILITY + ENDPOINTS.TELEGRAM_HANDLE + '/' + booking.userID, {
        method: 'GET',
        mode: 'cors',
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data.telegramHandle === '' || data.telegramHandle === undefined) {
            throw data.err
          } else {
            openUserTelegram(data.telegramHandle)
          }
        })
    } catch (err) {
      console.log(err)
    }
  }
  // To change date month and year in <DateComponent> using unixtocalender function
  return (
    <>
      {bookings?.length ? (
        bookings.map((booking) => (
          <BookingContainer
            key={booking.bookingID}
            onClick={() => history.push(PATHS.VIEW_FACILITY_BOOKING_ID + booking.bookingID)}
          >
            <BookingLeftDisplay>
              <DateComponent>
                {days[new Date(booking.startTime * 1000).getDay()]}{' '}
                {new Date(booking.startTime * 1000).getDate() +
                  ' ' +
                  months[new Date(booking.startTime * 1000).getMonth()] +
                  ' ' +
                  new Date(booking.startTime * 1000).getFullYear()}
              </DateComponent>
              <TimeComponent>
                {get24Hourtime(booking.startTime)} to {get24Hourtime(booking.endTime)}
              </TimeComponent>
              <BookingCCAName>{booking.ccaName ? booking.ccaName : 'Personal'}</BookingCCAName>
            </BookingLeftDisplay>
            <BookingRightDisplay>
              {booking.userID === localStorage.getItem('userID') ? (
                <Icon src={adminIcon} />
              ) : (
                <Icon
                  onClick={() => {
                    fetchTelegram(booking)
                  }}
                  src={messageIcon}
                />
              )}
            </BookingRightDisplay>
          </BookingContainer>
        ))
      ) : (
        <p style={{ padding: '23px' }}>There are no bookings on this day!</p>
      )}
    </>
  )
}
