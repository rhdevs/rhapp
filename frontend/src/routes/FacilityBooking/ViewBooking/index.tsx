import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { format } from 'date-fns'

import { PATHS } from '../../Routes'
import {
  setIsLoading,
  deleteMyBooking,
  fetchSelectedFacility,
  setBookingIdToDelete,
  fetchEditBookingFormDefaultValues,
} from '../../../store/facilityBooking/action'
import { DOMAIN_URL, ENDPOINTS } from '../../../store/endpoints'
import { RootState } from '../../../store/types'

import TopNavBar from '../../../components/Mobile/TopNavBar'
import LoadingSpin from '../../../components/LoadingSpin'
import { ConfirmationModal } from '../../../components/Mobile/ConfirmationModal'

import deletepic from '../../../assets/delete.svg'
import editIcon from '../../../assets/editIcon.svg'
import messageIcon from '../../../assets/messageIcon.svg'

const MainContainer = styled.div`
  width: 100%;
  height: 95vh;
  background-color: #fafaf4;
  color: #33363a;
`

const EventCard = styled.div`
  background: linear-gradient(to top, #ffffff 76%, #ef9688 24%);
  cursor: pointer;
  margin: 23px;
  padding: 15px;
  min-height: 500px;
  max-height: 600px;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  height: 100%;
  display: grid;
  grid-template-rows: 22% 63% 15%;
`

const HeaderGroup = styled.div`
  padding: 10px;
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
`

const IdText = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  color: #666666;
`

const HeaderText = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
`

const DetailsGroup = styled.div`
  padding: 10px;
`

const Icon = styled.img`
  height: 40px;
  width: 40px;
`

const ActionButtonGroup = styled.div`
  justify-content: space-around;
  display: flex;
  align-self: end;
`

const CardSubtitle = styled.p`
  font-style: normal;
  font-weight: 900;
  font-size: 14px;
  line-height: 14px;
  color: #33363a;
`

const CardDurationLabel = styled.p`
  min-width: 100px;
  font-weight: 600;
  font-size: 24px;
  line-height: 14px;
  margin-top: 25px;
  color: #666666;
`

const CardTimeLabel = styled.p`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  margin: 5px;
  text-align: right;
  color: #666666;
`

const TimeDetails = styled.div`
  display: grid;
  grid-template-columns: 15% 85%;
  margin: 15px 0px;
`

const DateTimeDetails = styled.div`
  display: grid;
  grid-template-rows: 50% 50%;
  margin: 0px;
  margin-left: 15px;
`
const EventOwnerDetails = styled.div`
  display: grid;
  grid-template-columns: 35% 65%;
  margin: 7px 0px;
  align-items: baseline;
`
const EventFacilityName = styled.div`
  display: grid;
  grid-template-columns: 35% 65%;
  margin: 7px 0px;
  align-items: baseline;
`

/**
 * # ViewBooking
 * Path: `/facility/booking/view/:bookingId'`
 *
 * ## Page Description
 * The user gets redirected to this page after clicking one of the bookings listed in the `MyBookings` page. \
 * This page displays the details of a booking, which is the RHEID (bookingId), Event name, CCA, start time, end time, facility, \
 * person who created the booking, and additional notes.
 *
 * @remarks
 * <any remarks on this component type in here>
 *
 */
export default function ViewBooking() {
  const params = useParams<{ bookingId: string }>()
  const dispatch = useDispatch()
  const history = useHistory()
  const { selectedBookingToView, bookingIdToDelete, isLoading, isJcrc } = useSelector(
    (state: RootState) => state.facilityBooking,
  )

  const fetchTelegram = async (booking) => {
    const newTab = window.open()
    try {
      fetch(DOMAIN_URL.FACILITY + ENDPOINTS.TELEGRAM_HANDLE + '/' + booking.userID, {
        method: 'GET',
        mode: 'cors',
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data.data === '' || data.data === undefined) {
            console.log(data.err)
          } else {
            openTelegram(data.data, newTab)
          }
        })
    } catch (err) {
      console.log(err)
    }
  }

  const openTelegram = (userID, tab) => {
    const site = 'https://telegram.me/' + userID
    tab && (tab.location.href = site)
  }

  useEffect(() => {
    dispatch(setIsLoading(true))
    dispatch(fetchSelectedFacility(parseInt(params.bookingId)))
  }, [dispatch])

  const formatDate = (eventStartTime: number) => {
    const date = new Date(eventStartTime * 1000)
    return format(date, 'dd MMM yyyy, HH:mm')
  }

  const getTimeDuration = (eventStartTime: number, eventEndTime: number) => {
    const startDate = new Date(eventStartTime * 1000)
    const endDate = new Date(eventEndTime * 1000)
    const timeDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 3600)

    return Math.round(timeDiff * 2) / 2
  }

  const bookingTimeDuration = selectedBookingToView
    ? getTimeDuration(selectedBookingToView.startTime, selectedBookingToView.endTime)
    : -1

  return (
    <>
      <TopNavBar title="View Booking" />
      <MainContainer>
        {isLoading ? (
          <LoadingSpin />
        ) : (
          selectedBookingToView && (
            <>
              <EventCard key={selectedBookingToView?.bookingID}>
                <HeaderGroup>
                  <HeaderText>{selectedBookingToView?.eventName}</HeaderText>
                  <HeaderText>{selectedBookingToView?.ccaName}</HeaderText>
                  <IdText>RHEID-{params.bookingId}</IdText>
                </HeaderGroup>
                <DetailsGroup>
                  <TimeDetails>
                    <CardDurationLabel>
                      {bookingTimeDuration === 1 ? '1 hr' : `${bookingTimeDuration} hrs`}
                    </CardDurationLabel>
                    <DateTimeDetails>
                      {selectedBookingToView && (
                        <>
                          <CardTimeLabel>
                            <b>Start: </b>
                            {formatDate(selectedBookingToView.startTime)}
                          </CardTimeLabel>
                          <CardTimeLabel>
                            <b>End: </b>
                            {formatDate(selectedBookingToView.endTime)}
                          </CardTimeLabel>
                        </>
                      )}
                    </DateTimeDetails>
                  </TimeDetails>
                  <EventFacilityName>
                    <CardSubtitle>Facility</CardSubtitle>
                    <p style={{ textAlign: 'right' }}>{selectedBookingToView?.facilityName}</p>
                  </EventFacilityName>
                  <EventOwnerDetails>
                    <CardSubtitle>Created by</CardSubtitle>
                    <p style={{ textAlign: 'right' }}>{selectedBookingToView?.displayName}</p>
                  </EventOwnerDetails>
                  <>
                    <CardSubtitle>Additional Note</CardSubtitle>
                    <p>{selectedBookingToView?.description}</p>
                  </>
                </DetailsGroup>
                {selectedBookingToView?.userID === localStorage.getItem('userID') || isJcrc ? (
                  <ActionButtonGroup>
                    <Icon
                      src={editIcon}
                      onClick={() => {
                        if (params.bookingId) {
                          dispatch(fetchEditBookingFormDefaultValues(Number(params.bookingId)))
                          history.push(`${PATHS.EDIT_BOOKING_FORM}${params.bookingId}`)
                        }
                      }}
                    />
                    <Icon
                      src={deletepic}
                      onClick={() => dispatch(setBookingIdToDelete(selectedBookingToView.bookingID))}
                    />
                    {selectedBookingToView?.userID !== localStorage.getItem('userID') && (
                      <Icon onClick={() => fetchTelegram(selectedBookingToView)} src={messageIcon} />
                    )}
                  </ActionButtonGroup>
                ) : (
                  <ActionButtonGroup>
                    <Icon onClick={() => fetchTelegram(selectedBookingToView)} src={messageIcon} />
                  </ActionButtonGroup>
                )}
              </EventCard>
              {bookingIdToDelete === selectedBookingToView?.bookingID && (
                <ConfirmationModal
                  title="Delete Booking?"
                  hasLeftButton
                  leftButtonText="Delete"
                  onLeftButtonClick={() => {
                    dispatch(deleteMyBooking(selectedBookingToView?.bookingID))
                    history.replace(PATHS.VIEW_ALL_FACILITIES)
                    history.push(`${PATHS.VIEW_MY_BOOKINGS}/${localStorage.getItem('userID')}`)
                  }}
                  rightButtonText="Cancel"
                  onRightButtonClick={() => dispatch(setBookingIdToDelete(-1))}
                />
              )}
            </>
          )
        )}
      </MainContainer>
    </>
  )
}
