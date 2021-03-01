import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { HexGrid, Layout, Hexagon, Pattern } from 'react-hexgrid'
import { PATHS } from '../../../Routes'
import calendar_icon from '../../../../assets/hexagonIcons/calendarIcon.svg'
import facilities_icon from '../../../../assets/hexagonIcons/facilitiesIcon.svg'
import laundry_icon from '../../../../assets/hexagonIcons/laundryIcon.svg'

const StyledHexagon = styled(Hexagon)`
  fill: #de5f4c;
  fill-opacity: 0.8;
`

const Container = styled.div`
  width: 100%;
  overflow: inherit !important;
`

export default function HexagonNavigation() {
  const history = useHistory()

  const hexagons = [
    {
      q: 0,
      r: -1,
      s: 1,
      fill: 'calendar',
      onClick: () => {
        history.push(PATHS.SCHEDULE_PAGE)
      },
    },
    {
      q: 1,
      r: -1,
      s: 0,
      fill: 'laundry',
      onClick: () => {
        history.push(PATHS.LAUNDRY_MAIN)
      },
    },
    {
      q: -1,
      r: -1,
      s: 2,
      fill: 'facilities',
      onClick: () => {
        history.push(PATHS.FACILITY_BOOKING_MAIN)
      },
    },
  ]
  const hexagonSize = { x: 27, y: 27 }
  return (
    <Container>
      <HexGrid style={{ overflow: 'inherit' }} width={'100%'} height={100} viewBox="-70 -70 100 60">
        <Layout size={hexagonSize} flat={false} pointy={true} spacing={1} origin={{ x: 0, y: 0 }}>
          {hexagons.map((hex, i) => (
            <StyledHexagon key={i} q={hex.q} r={hex.r} s={hex.s} onClick={hex.onClick} fill={hex.fill}>
              {/* <GridText>{hex.text}</GridText> */}
            </StyledHexagon>
          ))}
        </Layout>
        <Pattern id="calendar" link={calendar_icon} size={hexagonSize} />
        <Pattern id="facilities" link={facilities_icon} size={hexagonSize} />
        <Pattern id="laundry" link={laundry_icon} size={hexagonSize} />
      </HexGrid>
    </Container>
  )
}
