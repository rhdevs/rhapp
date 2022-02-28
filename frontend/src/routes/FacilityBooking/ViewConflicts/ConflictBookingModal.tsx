import React, { useState } from 'react'
import { ConfirmationModal } from '../../../components/ConfirmationModal'
import { handleCreateBooking } from '../../../store/facilityBooking/action'
import { Booking } from '../../../store/facilityBooking/types'

export default function ConflictBookingModal(props: { booking: Booking | undefined }) {
  const [open, setOpen] = useState(false)
  /* TODO implement function to toggle state to true */
  function changeStatus() {
    setOpen(!prevOpen)
  }
  function onRightClick() {
    /*TODO to update createbooking function in store instead*/
    changeStatus()
    handleCreateBooking(props.booking?.bookingID ? true : false)
  }

  return (
    <ConfirmationModal
      isModalOpen={open}
      rightButtonType="primary"
      rightButtonText="Confirm"
      title="Conflict in your bookings!"
      onLeftButtonClick={changeStatus}
      onRightButtonClick={onRightClick}
      leftButtonType="secondary"
      leftButtonText="Cancel"
      hasLeftButton
      description="Do you still want to continue with the conflicting bookings?"
      link="View Conflicts"
    />
  )
}
function prevOpen(prevOpen: any) {
  throw new Error('Function not implemented.')
}
