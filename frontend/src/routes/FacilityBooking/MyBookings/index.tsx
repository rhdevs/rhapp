import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
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
import { PATHS } from '../../Routes'
import LoadingSpin from '../../../components/LoadingSpin'
import { onRefresh } from '../../../common/reloadPage'
import PullToRefresh from 'pull-to-refresh-react'

import AlumniRoom from '../../../assets/facilitiesLogos/AlumniRoom.svg'
import BandRoom from '../../../assets/facilitiesLogos/BandRoom.svg'
import BasketballCourt from '../../../assets/facilitiesLogos/BasketballCourt.svg'
import ConferenceRoomKFH from '../../../assets/facilitiesLogos/ConferenceRoomKFH.svg'
import ConferenceRoomUL from '../../../assets/facilitiesLogos/ConferenceRoomUL.svg'
import DanceStudio from '../../../assets/facilitiesLogos/DanceStudio.svg'
import Foyer from '../../../assets/facilitiesLogos/Foyer.svg'
import Gym from '../../../assets/facilitiesLogos/Gym.svg'
import HardCourt from '../../../assets/facilitiesLogos/HardCourt.svg'
import MainAreaCommHall from '../../../assets/facilitiesLogos/MainAreaCommHall.svg'
import MainAreaUL from '../../../assets/facilitiesLogos/MainAreaUL.svg'
import MeetingRoomLL from '../../../assets/facilitiesLogos/MeetingRoomLL.svg'
import PoolAreaLL from '../../../assets/facilitiesLogos/PoolAreaLL.svg'
import Stage from '../../../assets/facilitiesLogos/Stage.svg'
import TVRoom from '../../../assets/facilitiesLogos/TVRoom.svg'
import DummyAvatar from '../../../assets/dummyAvatar.svg'
import { ConfirmationModal } from '../../../components/Mobile/ConfirmationModal'

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

const BookingAvatar = styled.img`
  padding: 10px;
  width: 20%;
  max-height 70px;
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

function FacilityLogo(props: { facilityID: number }) {
  switch (props.facilityID) {
    case 1:
      return <BookingAvatar src={MainAreaUL} />
    case 2:
      return <BookingAvatar src={ConferenceRoomUL} />
    case 3:
      return <BookingAvatar src={AlumniRoom} />
    case 4:
      return <BookingAvatar src={Foyer} />
    case 5:
      return <BookingAvatar src={Stage} />
    case 6:
      return <BookingAvatar src={MainAreaCommHall} />
    case 7:
      return <BookingAvatar src={BandRoom} />
    case 8:
      return <BookingAvatar src={PoolAreaLL} />
    case 9:
      return <BookingAvatar src={TVRoom} />
    case 10:
      return <BookingAvatar src={MeetingRoomLL} />
    case 11:
      return <BookingAvatar src={ConferenceRoomKFH} />
    case 12:
      return <BookingAvatar src={HardCourt} />
    case 13:
      return <BookingAvatar src={BasketballCourt} />
    case 14:
      return <BookingAvatar src={Gym} />
    case 15:
      return <BookingAvatar src={DanceStudio} />
    default:
      return <BookingAvatar src={DummyAvatar} />
  }
}

export default function ViewMyBookings() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { myBookings, isDeleteMyBooking, isLoading } = useSelector((state: RootState) => state.facilityBooking)

  const userIdFromPath = location.pathname.split('/').slice(-1)[0]

  useEffect(() => {
    dispatch(SetIsLoading(true))
    dispatch(getMyBookings(userIdFromPath))
  }, [dispatch])

  return (
    <>
      <PullToRefresh onRefresh={onRefresh}>
        <TopNavBar title="My Bookings" />
        <MainContainer>
          {isLoading && <LoadingSpin />}
          {!isLoading && (
            <>
              {myBookings.length === 0 && <NoBookingsFound>You have not made any bookings.</NoBookingsFound>}
              {myBookings?.map((booking) => {
                if (booking.startTime > parseInt((new Date().getTime() / 1000).toFixed(0))) {
                  return (
                    <BookingCard key={booking.bookingID}>
                      <FacilityLogo key={booking.facilityID} facilityID={booking.facilityID} />
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
                            history.replace(PATHS.FACILITY_BOOKING_MAIN)
                            history.push(PATHS.VIEW_MY_BOOKINGS_USERID + '/' + localStorage.getItem('userID'))
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
