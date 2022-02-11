import styled from 'styled-components'

export const DailyContainer = styled.div`
  margin: 15px 2%;
  border-radius: 5px;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.25);
  padding: 2px;
`

// Styles for Booking Block (Occupied, Available, Selected and Not Available)
export const BookingBlock = styled.div<{ occupied?: boolean; selected?: boolean; id: number }>`
  margin: 15px 2%;
  border-radius: 5px;
  padding: 15px 15px;
  color: #000000;
  display: flex;
  align-items: center;
  white-space: nowrap;
  min-height: 100px;
  ${(props) => (props.occupied ? colours.occupied : props.selected ? colours.selected : props.id % 2 == 0 ? colours.empty : colours.altempty)}
`

// Styling for View Only Blocks (Occupied, Not Occupied)
export const ViewBookings = styled.div<{ occupied?: boolean; type: number }>`
  margin: 15px 2%;
  border-radius: 5px;
  padding: 15px 15px;
  color: #000000;
  display: flex;
  align-items: center;
  white-space: nowrap;
  min-height: 100px;
  ${(props) => (props.occupied? colours.occupied : props.type % 2 == 0 ? colours.empty : colours.altempty)}
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

const colours = {
  occupied: `background: #fd0000;`,
  empty: `background: #F1F3F7;`,
  altempty: `background: #F6F6F6;`,
  selected: `background: #72DA75;`,
  notselected: `background: #D8E6DF;`,
}