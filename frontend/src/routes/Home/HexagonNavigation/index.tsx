import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { HexGrid, Layout, Hexagon, Text } from 'react-hexgrid'
import { PATHS } from '../../Routes'
// import calendarIcon from '../../../assets/hexagonIcons/calendarIcon.svg'
// import facilitiesIcon from '../../../assets/hexagonIcons/facilitiesIcon.svg'
// import laundryIcon from '../../../assets/hexagonIcons/laundryIcon.svg'
// import moreIcon from '../../../assets/hexagonIcons/moreIcon.svg'
// import socialIcon from '../../../assets/hexagonIcons/socialIcon.svg'

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
      // fill: 'calendar',
      text: 'Calendar',
      onClick: () => {
        history.push(PATHS.SCHEDULE_PAGE)
      },
    },
    {
      q: 1,
      r: -1,
      s: 0,
      // fill: 'laundry',
      text: 'Laundry',
      onClick: () => {
        history.push(PATHS.LAUNDRY_MAIN)
      },
    },
    {
      q: 1,
      r: 0,
      s: -1,
      // fill: 'more',
      text: 'More',
      onClick: () => {
        // history.push(PATHS.SCHEDULE_PAGE)
      },
    },
    {
      q: -1,
      r: 1,
      s: 0,
      // fill: 'social',
      text: 'Social',
      onClick: () => {
        history.push(PATHS.FRIEND_LIST_PAGE)
      },
    },
    {
      q: -1,
      r: 0,
      s: 0,
      // fill: 'facilities',
      text: 'Facilities',
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
            <StyledHexagon
              key={i}
              q={hex.q}
              r={hex.r}
              s={hex.s}
              onClick={hex.onClick}
              // fill={hex.fill}
            >
              <Text>{hex.text}</Text>
            </StyledHexagon>
          ))}
        </Layout>
        {/* <Pattern id="calendar" link="../../../assets/hexagonIcons/calendarIcon.png" size={hexagonSize} />
        <Pattern id="facilities" src={facilitiesIcon} size={hexagonSize} />
        <Pattern id="laundry" link="http://lorempixel.com/400/400/cats/2/" size={hexagonSize} />
        <Pattern id="more" link="http://lorempixel.com/400/400/cats/2/" size={hexagonSize} />
        <Pattern id="social" link="http://lorempixel.com/400/400/cats/2/" size={hexagonSize} /> */}
      </HexGrid>
    </Container>
  )
}
