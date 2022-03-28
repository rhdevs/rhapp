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

const BookingHeader = styled.p`
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

const EventDetailsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 15px;
`

const EventTimingContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const ExitButtonContainer = styled.img`
  width: 50px;
  height: 50px;
  cursor: pointer;
`

const TelegramButtonContainer = styled.img`
  width: 39px;
  height: 39px;
  cursor: pointer;
`

const StyledText = styled.text<{ fontSize?: string; fontWeight?: string; color?: string }>`
  font-size: ${(props) => props.fontSize ?? `14px`};
  color: ${(props) => props.color ?? `#191919`};
  font-weight: ${(props) => props.fontWeight ?? `400`};
  text-align: center;
  line-height: 22px;
`

type Props = {
  booking?: Booking | null
  onClickFunction: Dispatch<SetStateAction<boolean | undefined>>
}

export const ViewBookingCard = (props: Props) => {
  const [telegramHandle, setTelegramHandle] = useState<string>()
  const [bookingStartTimeUnix, setBookingStartTimeUnix] = useState<number>(0)
  const [bookingEndTimeUnix, setBookingEndTimeUnix] = useState<number>(0)

  useEffect(() => {
    fetchTelegram(props.booking?.userID)
    setBookingStartTimeUnix(props.booking?.startTime == undefined ? 0 : props.booking?.startTime)
    setBookingEndTimeUnix(props.booking?.endTime == undefined ? 0 : props.booking?.endTime)
  })

  const ExitButton = () => {
    return <ExitButtonContainer src={ViewBookingCardButton} onClick={() => props.onClickFunction(false)} />
  }

  const TelegramButton = () => {
    return <TelegramButtonContainer src={ViewBookingCardUserIcon} onClick={() => console.log('Go to telegram')} />
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

  return (
    <BackgroundOverlay>
      <BookingContainer>
        <BookingHeader>
          <StyledText fontSize="27px" fontWeight="700">
            {props.booking?.eventName}
          </StyledText>
          <StyledText fontSize="14px" fontWeight="400">
            {props.booking?.ccaName}
          </StyledText>
        </BookingHeader>
        <TelegramButton />
        <StyledText fontSize="14px" fontWeight="400">
          @{telegramHandle}
        </StyledText>
        <EventDetailsContainer>
          <EventTimingContainer>
            <StyledText color="#666666">{unixToFullDay(bookingStartTimeUnix)}</StyledText>
            <StyledText color="#666666">{unixToFullDate(bookingStartTimeUnix)}</StyledText>
            <StyledText color="#666666">{unixTo12HourTime(bookingStartTimeUnix)}</StyledText>
          </EventTimingContainer>
          <StyledText fontWeight="700">{'TO'}</StyledText>
          <EventTimingContainer>
            <StyledText color="#666666">{unixToFullDay(bookingEndTimeUnix)}</StyledText>
            <StyledText color="#666666">{unixToFullDate(bookingEndTimeUnix)}</StyledText>
            <StyledText color="#666666">{unixTo12HourTime(bookingEndTimeUnix)}</StyledText>
          </EventTimingContainer>
        </EventDetailsContainer>
        <StyledText fontSize="14px" fontWeight="700">
          {'Additional Note'}
        </StyledText>
        <StyledText color="#666666">{props.booking?.description}</StyledText>
        <ExitButton />
      </BookingContainer>
    </BackgroundOverlay>
  )
}
