import styled from 'styled-components'
import { Carousel } from 'antd'

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

export default StyledCarousel
