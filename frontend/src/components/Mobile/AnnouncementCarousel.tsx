import React from 'react'
import styled from 'styled-components'

import StyledCarousel from './StyledCarousel'

import banner1 from '../../assets/banners/banner1.jpeg'
import banner2 from '../../assets/banners/banner2.jpeg'
// import banner3 from '../../assets/banners/banner3.jpeg'
import banner4 from '../../assets/banners/banner4.jpeg'
// import banner5 from '../../assets/banners/banner5.jpeg'

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
    background-image: url(${banner1});
  }
`
const CarouselCard2 = styled(CarouselCard)`
  &:before {
    background-image: url(${banner2});
  }
`
// const CarouselCard3 = styled(CarouselCard)`
//   &:before {
//     background-image: url(${banner3});
//   }
// `
const CarouselCard4 = styled(CarouselCard)`
  &:before {
    background-image: url(${banner4});
  }
`
// const CarouselCard5 = styled(CarouselCard)`
//   &:before {
//     background-image: url(${banner5});
//   }
// `

export default function AnnouncementCarousel() {
  return (
    <StyledCarousel autoplay>
      <CarouselCard1 />
      <CarouselCard2 />
      {/* <CarouselCard3 /> */}
      <CarouselCard4 />
      {/* <CarouselCard5 /> */}
    </StyledCarousel>
  )
}
