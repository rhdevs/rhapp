import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { unixToFullDateNumeric } from '../../common/unixToFullDateNumeric'
import { unixTo12HourTime } from '../../common/unixTo12HourTime'
import { unixToFullDay } from '../../common/unixToFullDay'
import { openUserTelegram } from '../../common/telegramMethods'

import { DOMAIN_URL, ENDPOINTS } from '../../store/endpoints'
import { Booking } from '../../store/facilityBooking/types'

import ViewBookingCardButton from '../../assets/viewBookingCardButton.svg'
import ViewBookingCardUserIcon from '../../assets/viewBookingUserIcon.svg'

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
  gap: 10px;
  width: 85%;
  max-width: 400px;
  cursor: pointer;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
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

const SubContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const EventDetailsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 15px;
  align-items: center;
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

const StyledText = styled.text<{ largeFont?: boolean; boldFont?: boolean; grayed?: boolean }>`
  font-size: ${(props) => (props.largeFont ? `22px` : `14px`)};
  color: ${(props) => (props.grayed ? `#666666` : `#191919`)};
  font-weight: ${(props) => (props.boldFont ? `700` : `400`)};
  text-align: center;
  line-height: 22px;
`

type Props = {
  booking?: Booking
  exitOnClick: () => void
}

/**
 *
 * @param booking (type Booking, optional)
 * @param exitOnClick (type () => void)
 * @returns displays a pop-up card that shows the details of the booking
 *
 * @example
 * ```
 * <ViewBookingCard booking={viewBooking} exitOnClick={() => setIsViewBookingModalOpen(false)} />
 * ```
 *
 * @remarks
 */

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
    return <ExitButtonContainer src={ViewBookingCardButton} onClick={() => props.exitOnClick()} />
  }

  const TelegramButton = () => {
    return <TelegramButtonContainer src={ViewBookingCardUserIcon} />
  }

  const fetchTelegram = (userId: string | undefined) => {
    if (userId) {
      fetch(DOMAIN_URL.FACILITY + ENDPOINTS.TELEGRAM_HANDLE + '/' + userId, {
        method: 'GET',
        mode: 'cors',
      })
        .then((resp) => resp.json())
        .then((data) => {
          setTelegramHandle(data.data ?? '')
        })
    }
  }

  return (
    <BackgroundOverlay>
      <BookingContainer>
        <BookingHeader>
          <StyledText largeFont boldFont>
            {props.booking?.eventName}
          </StyledText>
          <StyledText grayed>{props.booking?.ccaName}</StyledText>
        </BookingHeader>
        <SubContainer onClick={telegramHandle ? () => openUserTelegram(telegramHandle) : undefined}>
          <TelegramButton />
          <StyledText>@{telegramHandle}</StyledText>
        </SubContainer>
        <EventDetailsContainer>
          <EventTimingContainer>
            <StyledText grayed>{unixToFullDay(bookingStartTimeUnix)}</StyledText>
            <StyledText grayed>{unixToFullDateNumeric(bookingStartTimeUnix)}</StyledText>
            <StyledText grayed>{unixTo12HourTime(bookingStartTimeUnix)}</StyledText>
          </EventTimingContainer>
          <StyledText boldFont>TO</StyledText>
          <EventTimingContainer>
            <StyledText grayed>{unixToFullDay(bookingEndTimeUnix)}</StyledText>
            <StyledText grayed>{unixToFullDateNumeric(bookingEndTimeUnix)}</StyledText>
            <StyledText grayed>{unixTo12HourTime(bookingEndTimeUnix)}</StyledText>
          </EventTimingContainer>
        </EventDetailsContainer>
        <SubContainer>
          <StyledText boldFont>Additional Note</StyledText>
          <StyledText grayed>{props.booking?.description}</StyledText>
        </SubContainer>
        <ExitButton />
      </BookingContainer>
    </BackgroundOverlay>
  )
}
