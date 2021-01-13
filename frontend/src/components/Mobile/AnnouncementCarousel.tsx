import React from 'react'
import styled from 'styled-components'

import StyledCarousel from './StyledCarousel'

const CarouselCard = styled.div`
  height: 160px;
  position: relative;
  &:before {
    content: '';
    background-image: url('https://farm3.static.flickr.com/2098/2260149771_00cb406fd6_o.jpg');
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    opacity: 1;
  }
`

export default function AnnouncementCarousel() {
  return (
    <StyledCarousel autoplay>
      <CarouselCard />
      <CarouselCard />
      <CarouselCard />
    </StyledCarousel>
  )
}
