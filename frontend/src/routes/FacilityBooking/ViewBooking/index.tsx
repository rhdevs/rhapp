import React, { useEffect } from 'react'
import styled from 'styled-components'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import editIcon from '../../../assets/editIcon.svg'
import messageIcon from '../../../assets/messageIcon.svg'
import { RootState } from '../../../store/types'
import {
  deleteMyBooking,
  editMyBooking,
  fetchSelectedFacility,
  setIsDeleteMyBooking,
} from '../../../store/facilityBooking/action'
import ConfirmationModal from '../../../components/Mobile/ConfirmationModal'
import LoadingSpin from '../../../components/LoadingSpin'
import { format } from 'date-fns'
import deletepic from '../../../assets/delete.svg'
import { DOMAIN_URL, ENDPOINTS } from '../../../store/endpoints'
import { PATHS } from '../../Routes'

const MainContainer = styled.div`
  width: 100%;
  height: 95vh;
  background-color: #fafaf4;
  color: #33363a;
`

const EventCard = styled.div`
  background: linear-gradient(to top, #ffffff 75%, #ef9688 25%);
  cursor: pointer;
  margin: 23px;
  padding: 15px;
  min-height: 500px;
  max-height: 600px;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  height: 100%;
  display: grid;
  grid-template-rows: 25% 50% 25%;
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
  height: 28px;
  width: 28px;
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
  font-weight: 600;
  font-size: 24px;
  line-height: 14px;
  margin-top: 25px;
  color: #666666;
`

const CardTimeLabel = styled.p`
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  margin: 5px;
  text-align: left;
  color: #666666;
`

const TimeDetails = styled.div`
  display: grid;
  grid-template-columns: 35% 65%;
  margin: 0px;
`

const DateTimeDetails = styled.div`
  display: grid;
  grid-template-rows: 50% 50%;
  margin: 0px;
  margin-left: 15px;
`
const EventOwnerDetails = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
`

export default function ViewBooking() {
  const params = useParams<{ bookingId: string }>()
  const dispatch = useDispatch()
  const history = useHistory()
  const { selectedBooking, isDeleteMyBooking, isLoading } = useSelector((state: RootState) => state.facilityBooking)

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
  useEffect(() => {
    // dispatch(SetIsLoading(false))
    dispatch(fetchSelectedFacility(parseInt(params.bookingId)))
  }, [dispatch])

  const formatDate = (eventStartTime: number) => {
    const date = new Date(eventStartTime * 1000)
    return format(date, 'MM/dd/yy hh:mm a')
  }

  const timeDuration = (eventStartTime: number, eventEndTime: number) => {
    const startDate = new Date(eventStartTime * 1000)
    const endDate = new Date(eventEndTime * 1000)
    const timeDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 3600)

    return Math.floor(timeDiff)
  }

  return (
    <>
      <TopNavBar title={'View Booking'} />
      <MainContainer>
        {isLoading && <LoadingSpin />}
        {!isLoading && selectedBooking && (
          <>
            <EventCard key={selectedBooking?.bookingID}>
              <HeaderGroup>
                <HeaderText>{selectedBooking?.eventName}</HeaderText>
                <HeaderText>{selectedBooking?.ccaName}</HeaderText>
                <IdText>RHEID-{params.bookingId}</IdText>
              </HeaderGroup>
              <DetailsGroup>
                <TimeDetails>
                  <CardDurationLabel>
                    {timeDuration(selectedBooking.startTime, selectedBooking.endTime)} Hrs
                  </CardDurationLabel>
                  <DateTimeDetails>
                    {selectedBooking && (
                      <>
                        <CardTimeLabel>{formatDate(selectedBooking.startTime)}</CardTimeLabel>
                        <CardTimeLabel>{formatDate(selectedBooking.endTime)}</CardTimeLabel>
                      </>
                    )}
                  </DateTimeDetails>
                </TimeDetails>
                <EventOwnerDetails>
                  <CardSubtitle>Created by</CardSubtitle>
                  <p style={{ textAlign: 'right' }}>{selectedBooking?.userID}</p>
                </EventOwnerDetails>
                <>
                  <CardSubtitle>Additional Note</CardSubtitle>
                  <p>{selectedBooking?.description}</p>
                </>
              </DetailsGroup>
              {selectedBooking?.userID !== localStorage.getItem('userID') ? (
                <ActionButtonGroup>
                  <Icon onClick={() => fetchTelegram(selectedBooking)} src={messageIcon} />
                </ActionButtonGroup>
              ) : (
                <ActionButtonGroup>
                  <Icon
                    src={editIcon}
                    onClick={() => {
                      dispatch(editMyBooking(selectedBooking))
                      history.push(PATHS.CREATE_FACILITY_BOOKING)
                    }}
                  />
                  <Icon src={deletepic} onClick={() => dispatch(setIsDeleteMyBooking(selectedBooking.bookingID))} />
                </ActionButtonGroup>
              )}
            </EventCard>
            {isDeleteMyBooking !== -1 && isDeleteMyBooking === selectedBooking?.bookingID && (
              <ConfirmationModal
                title={'Delete Booking?'}
                hasLeftButton={true}
                leftButtonText={'Delete'}
                onLeftButtonClick={() => {
                  dispatch(deleteMyBooking(selectedBooking?.bookingID))
                  history.replace(PATHS.FACILITY_BOOKING_MAIN)
                  history.push(PATHS.VIEW_MY_BOOKINGS_USERID + '/' + localStorage.getItem('userID'))
                }}
                rightButtonText={'Cancel'}
                onRightButtonClick={() => dispatch(setIsDeleteMyBooking(-1))}
              />
            )}
          </>
        )}
      </MainContainer>
    </>
  )
}
