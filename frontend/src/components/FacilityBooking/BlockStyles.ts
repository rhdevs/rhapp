import styled, { css } from 'styled-components'
import { TimeBlockType } from '../../store/facilityBooking/types'

export const blockHeight = 100

export const DailyContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 5px;
  gap: 5px;
`

const blockStyles = css`
  border-radius: 10px;
  padding: 15px;
  color: #000;
  display: flex;
  align-items: center;
  white-space: nowrap;
  height: ${`${blockHeight}px`};
`

// Styles for Booking Block (Occupied, Available, Selected and Not Available)
export const StyledBookingBlock = styled.div<{
  type: TimeBlockType
  blockId: number
}>`
  ${(props) => (props.type === TimeBlockType.AVAILABLE || props.type === TimeBlockType.SELECTED) && 'cursor: pointer;'}
  ${blockStyles}
  background: ${(props) =>
    props.type === TimeBlockType.OCCUPIED
      ? palette.occupied
      : props.type === TimeBlockType.AVAILABLE
      ? palette.available
      : props.type === TimeBlockType.SELECTED
      ? palette.selected
      : props.blockId % 2 == 0
      ? palette.unavailable1
      : palette.unavailable2};
`

// Styling for View Only Blocks (Occupied, Not Occupied)
export const StyledViewBooking = styled.div<{ isOccupied: boolean; blockId: number }>`
  ${(props) => props.isOccupied && 'cursor: pointer;'}
  ${blockStyles}
  background: ${(props) =>
    // occupied is green (same colour as available)
    props.isOccupied ? palette.available : props.blockId % 2 == 0 ? palette.unavailable1 : palette.unavailable2};
`

export const TextContainer = styled.div`
  margin-left: 15px;
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
  display: flex;
  gap: 5px;
  flex-direction: column;
  justify-content: space-between;
`

export const TimeContainer = styled.div`
  padding: 0 10px 0 0;
  font-size: 16px;
  font-family: Lato;
  line-height: 1;
`
