import React, { useEffect, useRef } from 'react'

import { TimeBlock } from '../../store/facilityBooking/types'
import { scrollToView } from './CurrentTimeLine'

import { StyledViewBooking } from './BlockStyles.styled'

/**
 *
 * @param entry (type `number`)
 * @param scrollTo (type `boolean`, optional)
 * @param openViewBookingModal: (type `function`)
 * @param setViewBookingEntryId (type `function`)
 *
 * @returns An event block that contains the component displaying the:
 *          1: Facility
 *          2: CCA that made the booking
 *          3: Event name
 *          4: Date/Time of booking
 *
 * @example
 * ```
 * This component is displayed after the user clicks on a <BookingCard /> component and it contains a <StyledViewBooking /> with all the details of the booking.
 * ```
 *
 * @remarks
 * <any remarks on this component type in here>
 *
 */

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

  return props.entry.booking ? (
    <StyledViewBooking
      ref={ref}
      isOccupied
      blockId={props.entry.id}
      onClick={() => {
        props.openViewBookingModal()
        props.setViewBookingEntryId()
      }}
    >
      {props.entry.ccaName}
      <br />
      {props.entry.eventName}
    </StyledViewBooking>
  ) : (
    <StyledViewBooking ref={ref} isOccupied={false} blockId={props.entry.id} />
  )
}

export default ViewBlock
