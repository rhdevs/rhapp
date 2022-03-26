import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react'

import { TimeBlock, TimeBlockType, Booking } from '../../store/facilityBooking/types'
import { myBookingsStub } from '../../store/stubs'
import { StyledViewBooking } from './BlockStyles'
import { scrollToView } from './CurrentTimeLine'

type Props = {
  entry: TimeBlock
  scrollTo?: boolean
  onClickFunction: Dispatch<SetStateAction<boolean>>
  setViewBooking: Dispatch<SetStateAction<Booking>>
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
      {props.entry.type === TimeBlockType.OCCUPIED ? (
        <StyledViewBooking
          ref={ref}
          isOccupied={props.entry.type === TimeBlockType.OCCUPIED}
          blockId={props.entry.id}
          onClick={() => (props.onClickFunction(true), props.setViewBooking(props.entry.booking ?? myBookingsStub[0]))}
        >
          {props.entry.type === TimeBlockType.OCCUPIED && (
            <>
              {props.entry.ccaName}
              <br />
              {props.entry.eventName}
            </>
          )}
        </StyledViewBooking>
      ) : (
        <StyledViewBooking ref={ref} isOccupied={false} blockId={props.entry.id}></StyledViewBooking>
      )}
    </>
  )
}

export default ViewBlock
