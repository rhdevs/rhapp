import React, { RefObject, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import styled from 'styled-components'
import { RootState } from '../../store/types'
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

export function isToday(inputDate: number) {
  const today = new Date()
  return today.setHours(0, 0, 0, 0) == new Date(inputDate).setHours(0, 0, 0, 0)
}

export function scrollToView(ref: RefObject<HTMLHRElement> | React.RefObject<HTMLElement>, offset?: number) {
  if (ref.current) {
    window.scrollTo({
      top: ref.current.offsetTop + (offset ?? -180), // adjust distance between object and top of window
      behavior: 'smooth',
    })
  }
}

const CurrentTimeLine = (props: Props) => {
  const lineRef = useRef<HTMLHRElement>(null)
  const { timeBlocks } = useSelector((state: RootState) => state.facilityBooking)

  useEffect(() => {
    scrollToView(lineRef)
  }, [lineRef.current])

  return isToday(timeBlocks[0].timestamp) ? (
    <StyledHr
      ref={lineRef}
      width={props.width}
      top={props.top}
      left={props.left}
      right={props.right}
      bottom={props.bottom}
    />
  ) : (
    <></>
  )
}

export default CurrentTimeLine
