import styled from 'styled-components'

export const MainContainer = styled.div`
  length: 50%;
  width: 100%;
`

export const DailyContainer = styled.div`
  margin: 15px 2%;
  border-radius: 5px;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.25);
  padding: 2px;
`

// Styles for Booking Block (Occupied, Available, Selected and Not Available)
export const StyledBookingBlock = styled.div<{
  type: 'available' | 'occupied' | 'selected' | 'unavailable'
  ccaId: number
}>`
  margin: 15px 2%;
  border-radius: 5px;
  padding: 15px 15px;
  color: #000000;
  display: flex;
  align-items: center;
  white-space: nowrap;
  min-height: 100px;
  background: ${(props) =>
    props.type === 'occupied'
      ? palette.occupied
      : props.type === 'available'
      ? palette.available
      : props.type === 'selected'
      ? palette.selected
      : props.ccaId % 2 == 0
      ? palette.unavailable1
      : palette.unavailable2};
`

// Styling for View Only Blocks (Occupied, Not Occupied)
export const StyledViewBooking = styled.div<{ isOccupied: boolean; ccaId: number }>`
  margin: 15px 2%;
  border-radius: 5px;
  padding: 15px 15px;
  color: #000000;
  display: flex;
  align-items: center;
  white-space: nowrap;
  min-height: 100px;
  background: ${(props) =>
    props.isOccupied ? palette.occupied : props.ccaId % 2 == 0 ? palette.unavailable1 : palette.unavailable2};
`

export const TextContainer = styled.div`
  margin-left: 15px;
`
export const Availability = styled.h3`
  color: inherit;
  font-weight: 350;
`
export const TimeText = styled.h3`
  color: inherit;
  font-weight: 350;
`

const palette = {
  available: '#F1F3F7',
  unavailable1: '#F1F3F7',
  unavailable2: '#F6F6F6',
  selected: '#72DA75',
  occupied: '#fd0000',
}
