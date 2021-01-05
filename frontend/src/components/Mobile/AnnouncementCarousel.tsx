import React from 'react'
import styled from 'styled-components'

import StyledCarousel from './StyledCarousel'

const Content = styled.div`
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
