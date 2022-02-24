import styled from 'styled-components'

export const DailyContainer = styled.div`
  border-radius: 5px;
  padding: 2px;
`

// Styles for Booking Block (Occupied, Available, Selected and Not Available)
export const StyledBookingBlock = styled.div<{
  type: 'available' | 'occupied' | 'selected' | 'unavailable'
  ccaId: number
}>`
  ${(props) => (props.type === 'available' || props.type === 'selected') && 'cursor: pointer;'}
  margin: 15px 2%;
  border-radius: 10px;
  padding: 15px 15px;
  color: #000000;
  display: flex;
  align-items: center;
  white-space: nowrap;
  height: 100px;
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
  ${(props) => props.isOccupied && 'cursor: pointer;'}
  margin: 15px 2%;
  border-radius: 10px;
  padding: 15px 15px;
  color: #000000;
  display: flex;
  align-items: center;
  white-space: nowrap;
  height: 100px;
  background: ${(props) =>
    // occupied is green (same colour as available)
    props.isOccupied ? palette.available : props.ccaId % 2 == 0 ? palette.unavailable1 : palette.unavailable2};
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
  available: '#D8E6DF',
  unavailable1: '#F1F3F7',
  unavailable2: '#F6F6F6',
  selected: '#72BA75',
  occupied: '#F5DBD6',
}

export const MainContainer = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-template-rows: 1fr;
  width: 100%;
  padding: 10px 10px 10px 15px;
`

export const MainTimeContainer = styled.div`
  border-right: 2.5px solid #a9a9a9;
  display: grid;
  grid-template-rows: repeat(24, 100px);
  gap: 15px;
`

export const TimeContainer = styled.div`
  padding: 0 10px 0 0;
  font-size: 16px;
  font-family: Lato;
`
