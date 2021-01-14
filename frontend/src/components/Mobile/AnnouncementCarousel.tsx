import React from 'react'
import styled from 'styled-components'

import StyledCarousel from './StyledCarousel'

const CarouselCard = styled.div`
  height: 160px;
  position: relative;
  &:before {
    content: '';
    background-image: url('http://nus.edu.sg/osa/images/default-source/raffles-hall/homepage-carousel-banner/rhockfest2019.jpg?sfvrsn=aa9c34b9_2');
    position: absolute;
    top: 0px;
    background-size: contain;
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
