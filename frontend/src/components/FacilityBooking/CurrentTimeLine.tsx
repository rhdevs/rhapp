import React, { useEffect, useRef } from 'react'

import styled from 'styled-components'
import { topDistance, blockHeight, blockGap } from './BlockStyles'

const StyledHr = styled.hr<{ width?: string; top?: string; left?: string; right?: string; bottom?: string }>`
  border: 1.5px solid #468751;
  position: absolute;
  z-index: 1;
  width: ${(props) => props.width ?? '100%'};
  ${(props) => props.top && `top: ${props.top};`}
  ${(props) => props.left && `left: ${props.left};`}
  ${(props) => props.right && `right: ${props.right};`}
  ${(props) => props.bottom && `bottom: ${props.bottom};`}
`

type Props = {
  width?: string
  top?: string
  left?: string
  right?: string
  bottom?: string
}

export function calcTop() {
  let top = topDistance
  const today = new Date()
  const hour = today.getHours()
  const minutes = today.getMinutes()

  if (hour > 0) {
    // account for block gap -- each block is blockHeight + blockGap
    top -= blockGap / 2
  }
  top += (hour + minutes / 60) * blockHeight + blockGap * hour + 1.5
  return String(top) + 'px'
}

const CurrentTimeLine = (props: Props) => {
  const lineRef = useRef<HTMLHRElement>(null)

  useEffect(() => {
    if (lineRef.current) {
      window.scrollTo({
        top: lineRef.current.offsetTop - 180, // adjust distance between hr and top of window
        behavior: 'smooth',
      })
    }
  }, [lineRef.current])

  return (
    <StyledHr
      ref={lineRef}
      width={props.width}
      top={props.top}
      left={props.left}
      right={props.right}
      bottom={props.bottom}
    />
  )
}

export default CurrentTimeLine
