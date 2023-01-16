import React from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { PATHS } from '../../routes/Routes'
import {
  setIsDeleteMyBooking,
  deleteMyBooking,
  fetchEditBookingFormDefaultValues,
} from '../../store/facilityBooking/action'
import { Booking } from '../../store/facilityBooking/types'
import { RootState } from '../../store/types'
import { ConfirmationModal } from '../Mobile/ConfirmationModal'
import FacilityLogo from './FacilityLogo'
import { days, months } from '../../common/dates'

import deleteIcon from '../../assets/deleteIcon.svg'
import editIcon from '../../assets/editIcon.svg'

const BookingCardStyled = styled.div`
  position: relative;
  cursor: pointer;
  background-color: #ffffff;
  margin: 23px;
  margin-top: 0px;
  min-height: 70px;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
`

const BookingHeader = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;

  color: rgba(0, 0, 0, 0.65);
`

const BookingSubHeaderCCAName = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 12px;

  color: rgba(0, 0, 0, 0.65);
`
const BookingSubHeaderEventName = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 12px;

  color: rgba(0, 0, 0, 0.65);
`

const BookingTime = styled.p`
  font-style: normal;
  font-weight: thin;
  font-size: 12px;
  line-height: 12px;
  color: #de5f4c;
`

const BookingLabels = styled.div`
  align-self: center;
  margin-top: 10px;
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

/**
 * Returns a string of the format `Sun 1 Jan (2023) at 12:00 to (Mon 2 Jan (2023) at) 13:00` (optional) \
 * Year/month/date labels are omitted whenever redundant. Examples: (assume this year is 2023)
 * - Both times on same day, this year: `Sat 30 Dec at 12:00 to 13:00`
 * - Both times on same day, other years: `Mon 1 Jan 2024 at 12:00 to 13:00`
 * - Both times on different days, this year: `Sat 30 Dec at 12:00 to Sun 31 Dec at 13:00`
 * - Both times on different days, other year: `Mon 1 Jan 2024 at 12:00 to Tue 2 Jan 2024 13:00`
 * - Start time on this year but ends on another year: `Sun 31 Dec 2023 at 12:00 to Mon 1 Jan 2024 at 13:00`
 * - Start time on another year and ends on yet another year: `Tue 31 Dec 2024 at 12:00 to Wed 1 Jan 2025 at 13:00`
 *
 * @param startTime (number) unix timestamp
 * @param endTime (number) unix timestamp
 * @returns formatted time string
 */
const timeString = (startTime: number, endTime: number) => {
  if (startTime === 0 || endTime === 0) return ''
  const startDateObj = new Date(startTime * 1000)
  const endDateObj = new Date(endTime * 1000)

  const startYear = startDateObj.getFullYear()
  const startMonth = startDateObj.getMonth()
  const startDate = startDateObj.getDate()
  const startDay = days[startDateObj.getDay()].slice(0, 3)
  const startHour = `0${startDateObj.getHours()}`.slice(-2)
  const startMinutes = `0${startDateObj.getMinutes()}`.slice(-2)

  const endYear = endDateObj.getFullYear()
  const endMonth = endDateObj.getMonth()
  const endDate = endDateObj.getDate()
  const endDay = days[endDateObj.getDay()].slice(0, 3)
  const endHour = `0${endDateObj.getHours()}`.slice(-2)
  const endMinutes = `0${endDateObj.getMinutes()}`.slice(-2)

  const thisYear = new Date().getFullYear()
  const isStartThisYear = startYear === thisYear
  const isEndThisYear = endYear === thisYear
  const isSameYear = startYear === endYear
  const isSameDay = isSameYear && startMonth === endMonth && startDate === endDate

  const startDateDateString = `${startDay} ${startDate} ${months[startMonth].slice(0, 3)} ${
    isStartThisYear && isSameYear ? '' : startYear + ' '
  }`
  const endDateDateString = isSameDay
    ? ''
    : `${endDay} ${endDate} ${months[endMonth].slice(0, 3)} ${isEndThisYear ? '' : endYear + ' '}at `

  return `${startDateDateString} at ${startHour}:${startMinutes} to ${endDateDateString}${endHour}:${endMinutes}`
}

/**
 * A clickable rectangular card that displays an existing booking's information,
 * and allows the user to view details, edit or delete the booking.
 *
 * @param booking (Booking) booking object
 *
 * @example
 * <BookingCard booking={booking} />
 *
 * @returns BookingCard component
 */
const BookingCard = ({ booking }: { booking: Booking }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { isDeleteMyBooking } = useSelector((state: RootState) => state.facilityBooking)

  return (
    <BookingCardStyled key={booking.bookingID}>
      <FacilityLogo key={booking.facilityID} facilityId={booking.facilityID} />
      <BookingLabels
        onClick={() => {
          history.push('/facility/booking/view/' + booking.bookingID)
        }}
      >
        <BookingHeader>{booking.facilityName}</BookingHeader>
        <BookingSubHeaderCCAName>{booking.ccaName ? booking.ccaName : 'Personal'}:</BookingSubHeaderCCAName>
        <BookingSubHeaderEventName>
          {booking.eventName.length > 25 ? booking.eventName.slice(0, 25) + '...' : booking.eventName}
        </BookingSubHeaderEventName>
        <BookingTime>{timeString(booking.startTime, booking.endTime)}</BookingTime>
      </BookingLabels>
      <RightActionGroups>
        <ActionButton
          src={editIcon}
          onClick={() => {
            if (booking.bookingID) {
              dispatch(fetchEditBookingFormDefaultValues(booking.bookingID))
              history.push(`${PATHS.EDIT_FACILITY_BOOKING}${booking.bookingID}`)
            }
          }}
        />
        <ActionButton src={deleteIcon} onClick={() => dispatch(setIsDeleteMyBooking(booking.bookingID))} />
      </RightActionGroups>
      {isDeleteMyBooking !== -1 && isDeleteMyBooking === booking.bookingID && (
        <ConfirmationModal
          title="Delete Booking?"
          hasLeftButton
          leftButtonText="Delete"
          onOverlayClick={() => dispatch(setIsDeleteMyBooking(-1))}
          onLeftButtonClick={() => {
            dispatch(deleteMyBooking(booking.bookingID))
            history.replace(PATHS.VIEW_ALL_FACILITIES)
            history.push(`${PATHS.VIEW_MY_BOOKINGS}/${localStorage.getItem('userID')}`)
          }}
          rightButtonText="Cancel"
          onRightButtonClick={() => dispatch(setIsDeleteMyBooking(-1))}
        />
      )}
    </BookingCardStyled>
  )
}

export default BookingCard
