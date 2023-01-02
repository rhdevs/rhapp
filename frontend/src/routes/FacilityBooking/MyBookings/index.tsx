import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import PullToRefresh from 'pull-to-refresh-react'

import { PATHS } from '../../Routes'
import { onRefresh } from '../../../common/reloadPage'
import {
  getMyBookings,
  setIsDeleteMyBooking,
  deleteMyBooking,
  editMyBooking,
  setIsLoading,
} from '../../../store/facilityBooking/action'
import { RootState } from '../../../store/types'

import FacilityLogo from '../../../components/FacilityBooking/FacilityLogo'
import LoadingSpin from '../../../components/LoadingSpin'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { ConfirmationModal } from '../../../components/Mobile/ConfirmationModal'

import deleteIcon from '../../../assets/deleteIcon.svg'
import editIcon from '../../../assets/editIcon.svg'
import catIcon from '../../../assets/catMagnifyGlass.svg'

const MainContainer = styled.div`
  width: 100%;
  height: 95vh;
  background-color: #fafaf4;
  position: fixed;
  top: 70px;
  overflow: scroll;
  padding-bottom: 50px;
`
const BookingCard = styled.div`
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

const NoBookingsFound = styled.div`
  text-align: center;
  font-size: 20px;
  align-self: center;
  margin-top: 40px;
`

/**
 * # ViewMyBookings
 *
 * Path: `/facility/booking/user/:userId`
 *
 * ##Page Description
 * The page that contains all of the user's bookings. The user can click on each booking to view it in detail,
 * or use the right action buttons to edit or delete the booking respectively
 *
 * @remarks
 * <any remarks>
 *
 */
export default function ViewMyBookings() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { myBookings, isDeleteMyBooking, isLoading } = useSelector((state: RootState) => state.facilityBooking)

  const userIdFromPath = location.pathname.split('/').slice(-1)[0]

  useEffect(() => {
    dispatch(setIsLoading(true))
    dispatch(getMyBookings(userIdFromPath))
  }, [dispatch])

  return (
    <>
      <PullToRefresh onRefresh={onRefresh}>
        <TopNavBar title="My Bookings" />
        <MainContainer>
          {isLoading ? (
            <LoadingSpin />
          ) : (
            <>
              {myBookings.length === 0 && <NoBookingsFound>You have not made any bookings.</NoBookingsFound>}
              {myBookings?.map((booking) => {
                if (booking.startTime > parseInt((new Date().getTime() / 1000).toFixed(0))) {
                  return (
                    <BookingCard key={booking.bookingID}>
                      <FacilityLogo key={booking.facilityID} facilityId={booking.facilityID} />
                      <BookingLabels
                        onClick={() => {
                          history.push('/facility/booking/view/' + booking.bookingID)
                        }}
                      >
                        <BookingHeader>{booking.facilityName}</BookingHeader>
                        <BookingSubHeaderCCAName>
                          {booking.ccaName ? booking.ccaName : 'Personal'}:
                        </BookingSubHeaderCCAName>
                        <BookingSubHeaderEventName>
                          {booking.eventName.length > 25 ? booking.eventName.slice(0, 25) + '...' : booking.eventName}
                        </BookingSubHeaderEventName>
                        <BookingTime>
                          {new Date(booking.startTime * 1000).toDateString().slice(0, -4)}{' '}
                          {new Date(booking.startTime * 1000).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                          to{' '}
                          {new Date(booking.endTime * 1000).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
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
                        <ActionButton
                          src={deleteIcon}
                          onClick={() => dispatch(setIsDeleteMyBooking(booking.bookingID))}
                        />
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
                    </BookingCard>
                  )
                }
              })}
              {myBookings?.length === 0 && !myBookings && (
                <div>
                  <img src={catIcon} /> <h1>You have no Bookings yet!</h1>
                </div>
              )}
            </>
          )}
        </MainContainer>
      </PullToRefresh>
    </>
  )
}
