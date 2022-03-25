import React, { useEffect } from 'react'
import styled from 'styled-components'

import ViewBookingCardButton from '../../assets/viewBookingCardButton.svg'
import ViewBookingCardUserIcon from '../../assets/viewBookingUserIcon.svg'

import { Booking } from '../../store/facilityBooking/types'

export const ViewBookingCard = (props: { Booking: Booking }) => {
  const BookingContainer = styled.div`
    position: absolute;
    bottom: 80px;
    top: 80px;
    width: 90%;
    max-width: 400px;
    cursor: pointer;
    background-color: #ffffff;
    margin: 20px;
    border-radius: 20px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    z-index: 2;
    align-items: center;
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

  const EventName = styled.p`
    font-size: 22px;
    font-weight: 700;
    margin: 0;
  `

  const BookingCca = styled.p`
    font-size: 14px;
    font-weight: 400;
    margin: 0;
  `
  const TelegramHandle = styled.p`
    font-size: 14px;
    font-weight: 400;
    margin: 0;
  `

  const AdditionalNoteHeader = styled.p`
    font-size: 14px;
    font-weight: 700;
    margin: 10px 0px 0px 0px;
  `

  const AdditionalNote = styled.p`
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

  const EventTimings = styled.p`
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    color: #666666;
    margin: 0px;
    line-height: 22px;
  `

  const EventTimingsTo = styled.p`
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

  const ExitButton = () => {
    return <ButtonContainer src={ViewBookingCardButton} onClick={() => console.log('Close')} />
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
  )
}
