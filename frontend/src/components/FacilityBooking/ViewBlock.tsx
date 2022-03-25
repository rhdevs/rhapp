import React, { useEffect, useRef } from 'react'

import { TimeBlock, TimeBlockType } from '../../store/facilityBooking/types'
import { StyledViewBooking } from './BlockStyles'
import { scrollToView } from './CurrentTimeLine'

type Props = {
  entry: TimeBlock
  scrollTo?: boolean
}

const ViewBlock = (props: Props) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (props.scrollTo) {
      scrollToView(ref)
    }
  }, [ref.current])

  return (
    <StyledViewBooking
      ref={ref}
      isOccupied={props.entry.type === TimeBlockType.OCCUPIED}
      blockId={props.entry.id}
      onClick={() => console.log('Onclick function')}
    >
      {props.entry.type === TimeBlockType.OCCUPIED && (
        <>
          {props.entry.ccaName}
          <br />
          {props.entry.eventName}
        </>
      )}
    </StyledViewBooking>
  )
}

export default ViewBlock
