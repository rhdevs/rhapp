import React, { Dispatch, SetStateAction, useEffect } from 'react'
import styled from 'styled-components'

import ViewBookingCardButton from '../../assets/viewBookingCardButton.svg'
import ViewBookingCardUserIcon from '../../assets/viewBookingUserIcon.svg'

import { Booking } from '../../store/facilityBooking/types'

const BackgroundOverlay = styled.div`
  position: fixed;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.03);
  z-index: 201;
  cursor: pointer;
`

const BookingContainer = styled.div`
  position: absolute;
  bottom: 80px;
  top: 80px;
  width: 85%;
  max-width: 400px;
  cursor: pointer;
  background-color: #ffffff;
  margin: 20px;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 202;
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

export const ViewBookingCard = (props: { Booking: Booking; onClickFunction: Dispatch<SetStateAction<boolean>> }) => {
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

  return (
    <BackgroundOverlay>
      <BookingContainer>
        <BookingHeader>
          <EventName>{'Bonding Camp'}</EventName>
          <BookingCca>{'RHMP'}</BookingCca>
        </BookingHeader>
        <TelegramButton />
        <TelegramHandle>{'@Alyssa'}</TelegramHandle>
        <EventDetailsContainer>
          <EventTimingContainer>
            <EventTimings>{'Thursday'}</EventTimings>
            <EventTimings>{'17/12/21'}</EventTimings>
            <EventTimings>{'4:00 PM'}</EventTimings>
          </EventTimingContainer>
          <EventTimingsTo>{'TO'}</EventTimingsTo>
          <EventTimingContainer>
            <EventTimings>{'Thursday'}</EventTimings>
            <EventTimings>{'17/12/21'}</EventTimings>
            <EventTimings>{'4:00 PM'}</EventTimings>
          </EventTimingContainer>
        </EventDetailsContainer>
        <AdditionalNoteHeader>{'Additional Note'}</AdditionalNoteHeader>
        <AdditionalNote>
          {'Will be using this place for RHMP bonding. Contact me if you have any question.'}
        </AdditionalNote>
        <ExitButton />
      </BookingContainer>
    </BackgroundOverlay>
  )
}
