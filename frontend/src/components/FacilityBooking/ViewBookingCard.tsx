import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import styled from 'styled-components'

import ViewBookingCardButton from '../../assets/viewBookingCardButton.svg'
import ViewBookingCardUserIcon from '../../assets/viewBookingUserIcon.svg'

import { Booking } from '../../store/facilityBooking/types'
import { unixToFullDate } from '../../common/unixToFullDate'
import { unixTo12HourTime } from '../../common/unixTo12HourTime'
import { unixToFullDay } from '../../common/unixToFullDay'
import { DOMAIN_URL, ENDPOINTS } from '../../store/endpoints'

const BackgroundOverlay = styled.div`
  position: fixed;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 202;
  cursor: pointer;
`

const BookingContainer = styled.div`
  position: absolute;
  padding-bottom: 20px;
  top: 80px;
  width: 85%;
  max-width: 400px;
  cursor: pointer;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 205;
`

const BookingHeader = styled.div`
  width: 100%;
  height: 20%;
  cursor: pointer;
  background-color: #f1f3f7;
  border-radius: 20px 20px 0px 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 2;
  text-align: center;
  padding: 20px 0px;
`

const EventName = styled.div`
  font-size: 22px;
  font-weight: 700;
  margin: 0;
`

const BookingCca = styled.div`
  font-size: 14px;
  font-weight: 400;
  margin: 0;
`
const TelegramHandle = styled.div`
  font-size: 14px;
  font-weight: 400;
  margin: 0;
`

const AdditionalNoteHeader = styled.div`
  font-size: 14px;
  font-weight: 700;
  margin: 10px 0px 0px 0px;
`

const AdditionalNote = styled.div`
  font-size: 14px;
  font-weight: 400;
  margin: 0px 50px 20px 50px;
  text-align: center;
  color: #666666;
`
const EventDetailsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 15px;
`

const EventTimingContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const EventTimings = styled.div`
  font-size: 14px;
  font-weight: 400;
  text-align: center;
  color: #666666;
  margin: 0px;
  line-height: 22px;
`

const EventTimingsTo = styled.div`
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  color: #191919;
  margin: 25px;
`

const ButtonContainer = styled.img`
  width: 50px;
  height: 50px;
  cursor: pointer;
`

type Props = {
  booking?: Booking | null
  onClickFunction: Dispatch<SetStateAction<boolean | undefined>>
}

export const ViewBookingCard = (props: Props) => {
  const [telegramHandle, setTelegramHandle] = useState<string>()

  const ExitButton = () => {
    return <ButtonContainer src={ViewBookingCardButton} onClick={() => props.onClickFunction(false)} />
  }

  const TelegramButton = () => {
    return (
      <ButtonContainer
        style={{ width: '39px', margin: '15px 0px 0px 0px' }}
        src={ViewBookingCardUserIcon}
        onClick={() => console.log('Go to telegram')}
      />
    )
  }

  let bookingStartTimeUnix
  let bookingEndTimeUnix

  if (props.booking?.startTime == undefined) {
    bookingStartTimeUnix = 0
  } else {
    bookingStartTimeUnix = props.booking?.startTime
  }

  if (props.booking?.endTime == undefined) {
    bookingEndTimeUnix = 0
  } else {
    bookingEndTimeUnix = props.booking.endTime
  }

  const fetchTelegram = (userID: string | undefined) => {
    if (userID) {
      try {
        fetch(DOMAIN_URL.FACILITY + ENDPOINTS.TELEGRAM_HANDLE + '/' + userID, {
          method: 'GET',
          mode: 'cors',
        })
          .then((resp) => resp.json())
          .then((data) => {
            if (data.data === '' || data.data === undefined) {
              throw data.err
            } else {
              setTelegramHandle(data.data)
            }
          })
      } catch (err) {
        console.log(err)
        setTelegramHandle('')
      }
    }
  }

  fetchTelegram(props.booking?.userID)

  return (
    <BackgroundOverlay>
      <BookingContainer>
        <BookingHeader>
          <EventName>{props.booking?.eventName}</EventName>
          <BookingCca>{props.booking?.ccaName}</BookingCca>
        </BookingHeader>
        <TelegramButton />
        <TelegramHandle>@{telegramHandle}</TelegramHandle>
        <EventDetailsContainer>
          <EventTimingContainer>
            <EventTimings>{unixToFullDay(bookingStartTimeUnix)}</EventTimings>
            <EventTimings>{unixToFullDate(bookingStartTimeUnix)}</EventTimings>
            <EventTimings>{unixTo12HourTime(bookingStartTimeUnix)}</EventTimings>
          </EventTimingContainer>
          <EventTimingsTo>{'TO'}</EventTimingsTo>
          <EventTimingContainer>
            <EventTimings>{unixToFullDay(bookingEndTimeUnix)}</EventTimings>
            <EventTimings>{unixToFullDate(bookingEndTimeUnix)}</EventTimings>
            <EventTimings>{unixTo12HourTime(bookingEndTimeUnix)}</EventTimings>
          </EventTimingContainer>
        </EventDetailsContainer>
        <AdditionalNoteHeader>{'Additional Note'}</AdditionalNoteHeader>
        <AdditionalNote>{props.booking?.description}</AdditionalNote>
        <ExitButton />
      </BookingContainer>
    </BackgroundOverlay>
  )
}
