import React, { useEffect, useRef, useState } from 'react'

import { TimeBlock, TimeBlockType } from '../../store/facilityBooking/types'
import { myBookingsStub } from '../../store/stubs'
import { StyledViewBooking } from './BlockStyles'
import { scrollToView } from './CurrentTimeLine'
import { ViewBookingCard } from './ViewBookingCard'

type Props = {
  entry: TimeBlock
  scrollTo?: boolean
}

const ViewBlock = (props: Props) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isViewBookingModalOpen, setIsViewBookingModalOpen] = useState(false)

  useEffect(() => {
    if (props.scrollTo) {
      scrollToView(ref)
    }
  }, [ref.current])

  return (
    <>
      {isViewBookingModalOpen && (
        <ViewBookingCard Booking={myBookingsStub[0]} onClickFunction={setIsViewBookingModalOpen} />
      )}
      <StyledViewBooking
        ref={ref}
        isOccupied={props.entry.type === TimeBlockType.OCCUPIED}
        blockId={props.entry.id}
        onClick={() => (setIsViewBookingModalOpen(true), console.log('click'))}
      >
        {props.entry.type === TimeBlockType.OCCUPIED && (
          <>
            {props.entry.ccaName}
            <br />
            {props.entry.eventName}
          </>
        )}
      </StyledViewBooking>
    </>
  )
}

export default ViewBlock
