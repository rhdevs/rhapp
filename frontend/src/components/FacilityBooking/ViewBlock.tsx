import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react'

import { TimeBlock } from '../../store/facilityBooking/types'
import { StyledViewBooking } from './BlockStyles'
import { scrollToView } from './CurrentTimeLine'

type Props = {
  entry: TimeBlock
  scrollTo?: boolean
  openViewBookingModal: () => void
  setViewBookingEntryId: () => void
}

const ViewBlock = (props: Props) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (props.scrollTo) {
      scrollToView(ref)
    }
  }, [ref.current])

  return (
    <>
      {props.entry.booking ? (
        <StyledViewBooking
          ref={ref}
          isOccupied={true}
          blockId={props.entry.id}
          onClick={() => (props.openViewBookingModal(), props.setViewBookingEntryId())}
        >
          <>
            {props.entry.ccaName}
            <br />
            {props.entry.eventName}
          </>
        </StyledViewBooking>
      ) : (
        <StyledViewBooking ref={ref} isOccupied={false} blockId={props.entry.id}></StyledViewBooking>
      )}
    </>
  )
}

export default ViewBlock
