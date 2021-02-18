import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import dummyAvatar from '../../../assets/dummyAvatar.svg'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import deleteIcon from '../../../assets/deleteIcon.svg'
import editIcon from '../../../assets/editIcon.svg'
import catIcon from '../../../assets/catMagnifyGlass.svg'
import {
  getMyBookings,
  setIsDeleteMyBooking,
  deleteMyBooking,
  editMyBooking,
  SetIsLoading,
} from '../../../store/facilityBooking/action'
import { RootState } from '../../../store/types'
import ConfirmationModal from '../../../components/Mobile/ConfirmationModal'
import { PATHS } from '../../Routes'
import LoadingSpin from '../../../components/LoadingSpin'

const MainContainer = styled.div`
  width: 100%;
  height: 95vh;
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
// TODO: fix styling when backend is up
const BookingTime = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 12px;
  color: #de5f4c;
`

const BookingLabels = styled.div`
  align-self: center;
  margin-top: 20px;
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
  const history = useHistory()
  const { myBookings, isDeleteMyBooking, isLoading } = useSelector((state: RootState) => state.facilityBooking)

  const userIdFromPath = location.pathname.split('/').slice(-1)[0]

  useEffect(() => {
    dispatch(SetIsLoading(false))
    if (myBookings.length === 0) dispatch(getMyBookings(userIdFromPath))
  }, [dispatch])

  return (
    <>
      <TopNavBar title={'My Bookings'} />
      <MainContainer>
        {isLoading && <LoadingSpin />}
        {!isLoading && (
          <>
            {myBookings?.map((booking) => (
              <BookingCard key={booking.bookingID}>
                <BookingAvatar src={dummyAvatar} />
                <BookingLabels
                  onClick={() => {
                    history.push('/facility/booking/view/' + booking.bookingID)
                  }}
                >
                  <BookingHeader>{booking.facilityName}</BookingHeader>
                  <BookingSubHeader>
                    {booking.ccaName}: {booking.eventName}
                  </BookingSubHeader>
                  <BookingTime>
                    <b>{new Date(booking.startTime * 1000).toDateString()}</b> <br />
                    {new Date(booking.startTime * 1000).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    to {new Date(booking.endTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </BookingTime>
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
                    title={'Delete Booking?'}
                    hasLeftButton={true}
                    leftButtonText={'Delete'}
                    onLeftButtonClick={() => dispatch(deleteMyBooking(booking.bookingID))}
                    rightButtonText={'Cancel'}
                    onRightButtonClick={() => dispatch(setIsDeleteMyBooking(-1))}
                  />
                )}
              </BookingCard>
            ))}
            {myBookings?.length === 0 && !myBookings && (
              <div>
                <img src={catIcon} /> <h1>You have no Bookings yet!</h1>
              </div>
            )}
          </>
        )}
      </MainContainer>
    </>
  )
}
