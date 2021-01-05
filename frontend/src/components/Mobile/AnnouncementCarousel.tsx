import React from 'react'
import { Carousel } from 'antd'
import styled from 'styled-components'

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

const StyledCarousel = styled(Carousel)`
  &.slick-slider {
    position: relative;
    top: -10px;
  }
  .slick-dots li.slick-active button {
    background: #000 !important;
    opacity: 0.8 !important;
    z-index: 1 !important;
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
