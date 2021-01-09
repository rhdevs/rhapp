import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { HexGrid, Layout, Hexagon, Pattern } from 'react-hexgrid'
import { PATHS } from '../../../Routes'

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
      r: 0,
      s: 0,
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
      q: 1,
      r: 0,
      s: -1,
      fill: 'more',
      onClick: () => {
        // history.push(PATHS.SCHEDULE_PAGE)
      },
    },
    {
      q: -1,
      r: 1,
      s: 0,
      fill: 'social',
      onClick: () => {
        // history.push(PATHS.FRIEND_LIST_PAGE)
      },
    },
    {
      q: -1,
      r: 0,
      s: 0,
      fill: 'facilities',
      onClick: () => {
        history.push(PATHS.FACILITY_BOOKING_MAIN)
      },
    },
  ]
  const hexagonSize = { x: 27, y: 27 }
  return (
    <Container>
      <HexGrid style={{ overflow: 'inherit' }} width={'100%'} height={180}>
        <Layout size={hexagonSize} flat={true} spacing={1.2}>
          {hexagons.map((hex, i) => (
            <StyledHexagon key={i} q={hex.q} r={hex.r} s={hex.s} onClick={hex.onClick} fill={hex.fill}>
              {/* <GridText>{hex.text}</GridText> */}
            </StyledHexagon>
          ))}
        </Layout>
        <Pattern id="calendar" link="https://svgshare.com/i/SwC.svg" size={hexagonSize} />
        <Pattern id="facilities" link="https://svgur.com/i/SxR.svg" size={hexagonSize} />
        <Pattern id="laundry" link="https://svgur.com/i/SvM.svg" size={hexagonSize} />
        <Pattern id="more" link="https://svgur.com/i/Sxc.svg" size={hexagonSize} />
        <Pattern id="social" link="https://svgur.com/i/SwQ.svg" size={hexagonSize} />
      </HexGrid>
    </Container>
  )
}
