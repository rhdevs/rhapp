import styled, { css } from 'styled-components'
import { TimeBlockType } from '../../store/facilityBooking/types'

export const BLOCK_HEIGHT = 90
export const TOP_DISTANCE = 10
export const BLOCK_GAP = 5

export const DailyContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${`${TOP_DISTANCE}px`} 5px;
  gap: ${`${BLOCK_GAP}px`};
`

const blockStyles = css`
  position: relative;
  border-radius: 10px;
  padding: 10px 15px;
  color: #000;
  display: flex;
  white-space: nowrap;
  height: ${`${BLOCK_HEIGHT}px`};
  gap: 10px;
`

// Styles for Booking Block (Occupied, Available, Selected and Not Available)
export const StyledBookingBlock = styled.div<{
  type: TimeBlockType
  blockId: number
  hasOverlay?: boolean
}>`
  //edited (props.type === TimeBlockType.AVAILABLE || props.type === TimeBlockType.SELECTED) && 'cursor: pointer;' to below
  ${(props) => props.onClick && 'cursor: pointer;'}
  ${blockStyles}
  background: ${(props) =>
    props.type === TimeBlockType.OCCUPIED
      ? palette.occupied
      : props.type === TimeBlockType.AVAILABLE
      ? palette.available
      : props.type === TimeBlockType.SELECTED
      ? palette.selected
      : props.blockId % 2 === 0
      ? palette.unavailable1
      : palette.unavailable2};

  ${(props) =>
    props.hasOverlay &&
    css`
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.7);
      }
    `}
`

// Styling for View Only Blocks (Occupied, Not Occupied)
export const StyledViewBooking = styled.div<{ isOccupied: boolean; blockId: number }>`
  ${(props) => props.isOccupied && 'cursor: pointer;'}
  ${blockStyles}
  background: ${(props) =>
    // occupied is green (same colour as available)
    props.isOccupied ? palette.available : props.blockId % 2 === 0 ? palette.unavailable1 : palette.unavailable2};
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
  position: relative;
  z-index: 0;
`

export const MainTimeContainer = styled.div`
  border-right: 2.5px solid #a9a9a9;
  display: flex;
  gap: ${`${BLOCK_GAP}px`};
  flex-direction: column;
  justify-content: space-between;
`

export const TimeContainer = styled.div`
  padding-right: 5px;
  font-size: 14px;
  font-family: Lato;
  line-height: 1;
`
