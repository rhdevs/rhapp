import React from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { PATHS } from '../../routes/Routes'
import { editMyBooking, setIsDeleteMyBooking, deleteMyBooking } from '../../store/facilityBooking/action'
import { Booking } from '../../store/facilityBooking/types'
import { RootState } from '../../store/types'
import { ConfirmationModal } from '../Mobile/ConfirmationModal'
import FacilityLogo from './FacilityLogo'

import deleteIcon from '../../assets/deleteIcon.svg'
import editIcon from '../../assets/editIcon.svg'
import { unixToFullDateTime } from '../../common/unixToFullDateTime'
import { days, months } from '../../common/dates'

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
// TODO: fix styling when backend is up
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

const timeString = (startTime: number, endTime: number) => {
  if (startTime === 0 || endTime === 0) return ''
  const startDateObj = new Date(startTime * 1000)
  const endDateObj = new Date(endTime * 1000)

  const startYear = startDateObj.getFullYear()
  const endYear = endDateObj.getFullYear()
  const startMonth = startDateObj.getMonth()
  const endMonth = endDateObj.getMonth()

  const startDate = startDateObj.getDate()
  const endDate = endDateObj.getDate()
  const startDay = days[startDateObj.getDay()].slice(0, 3)
  const endDay = days[endDateObj.getDay()].slice(0, 3)

  const startHour = `0${startDateObj.getHours()}`.slice(-2)
  const endHour = `0${endDateObj.getHours()}`.slice(-2)
  const startMinutes = `0${startDateObj.getMinutes()}`.slice(-2)
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
            dispatch(editMyBooking(booking))
            history.push(PATHS.CREATE_FACILITY_BOOKING)
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
