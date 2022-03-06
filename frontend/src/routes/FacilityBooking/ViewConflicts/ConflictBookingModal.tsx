import React, { useState } from 'react'
import { ConfirmationModal } from '../../../components/ConfirmationModal'
import { handleCreateBooking } from '../../../store/facilityBooking/action'
import { Booking } from '../../../store/facilityBooking/types'
import { useHistory } from 'react-router-dom'
import { PATHS } from '../../Routes'

export default function ConflictBookingModal(props: { booking: Booking | undefined }) {
  const history = useHistory()
  const [modalIsOpen, setmodalIsOpen] = useState<boolean>(true)
  /* TODO implement function to toggle state to true */
  function toggleStatus() {
    setmodalIsOpen(!open)
  }
  function onRightClick() {
    /*TODO to update createbooking function in store instead*/
    toggleStatus()
    handleCreateBooking(props.booking?.bookingID ? true : false)
  }
  function toLink() {
    history.push(PATHS.VIEW_FACILITY_CONFLICT)
  }

  return (
    <ConfirmationModal
      isModalOpen={modalIsOpen}
      rightButtonText="Confirm"
      title="Conflict in your bookings!"
      onLeftButtonClick={toggleStatus}
      onRightButtonClick={onRightClick}
      leftButtonText="Cancel"
      hasLeftButton
      description="Do you still want to continue with the conflicting bookings?"
      onlinkClick={toLink}
      link="View Conflicts"
    />
  )
}
