import React from 'react'
import styled from 'styled-components'

import StyledCarousel from './StyledCarousel'

const CarouselCard = styled.div`
  height: 160px;
  @media only screen and (min-width: 768px) {
    height: 500px;
  }
  position: relative;
  &:before {
    content: '';
    position: absolute;
    top: 0px;
    background-size: cover;
    background-position: center;
    right: 0px;
    bottom: 0px;
    left: 0px;
    opacity: 1;
  }
`

const CarouselCard1 = styled(CarouselCard)`
  &:before {
    background-image: url('http://nus.edu.sg/osa/images/default-source/raffles-hall/homepage-carousel-banner/rhockfest2019.jpg?sfvrsn=aa9c34b9_2');
  }
`

const CarouselCard2 = styled(CarouselCard)`
  &:before {
    background-image: url(https://nus.edu.sg/osa/images/default-source/raffles-hall/homepage-carousel-banner/rhag2018.jpg?sfvrsn=15df5fdb_2);
  }
`
const CarouselCard3 = styled(CarouselCard)`
  &:before {
    background-image: url(https://nus.edu.sg/osa/images/default-source/raffles-hall/homepage-carousel-banner/rhbash2018.jpg?sfvrsn=a3a67915_2);
  }
`
export default function AnnouncementCarousel() {
  return (
    <StyledCarousel autoplay>
      <CarouselCard1 />
      <CarouselCard2 />
      <CarouselCard3 />
    </StyledCarousel>
  )
}
