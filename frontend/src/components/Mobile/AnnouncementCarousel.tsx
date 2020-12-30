import React from 'react'
import { Carousel } from 'antd'
import styled from 'styled-components'

const Content = styled.div`
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 20px;
  text-align: center;
  font-size: 10px;
  &:before {
    content: '';
    background-image: url('https://farm3.static.flickr.com/2098/2260149771_00cb406fd6_o.jpg');
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    opacity: 0.4;
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

const CarouselCard = () => {
  const content =
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s.'
  return <Content>{content}</Content>
}

export default function AnnouncementCarousel() {
  return (
    <StyledCarousel autoplay>
      <CarouselCard />
      <CarouselCard />
      <CarouselCard />
    </StyledCarousel>
  )
}
