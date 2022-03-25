import React, { useEffect } from 'react'
import styled from 'styled-components'

// this component takes in an array of events or an array of dates that has events
export const ViewBookingCard = (props: { selectedFacilityId: number }) => {
  const BookingContainer = styled.div`
    position: absolute;
    bottom: 30px;
    top: 100px;
    width: 90%;
    max-width: 400px;
    cursor: pointer;
    background-color: #ffffff;
    margin: 20px;
    border-radius: 20px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    display: flex;
    padding: 30px;
    z-index: 2;
  `

  return <BookingContainer>{'test'}</BookingContainer>
}
