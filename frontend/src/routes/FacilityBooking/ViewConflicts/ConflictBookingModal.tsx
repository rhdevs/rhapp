import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store/types'
import { ConfirmationModal } from '../../../components/ConfirmationModal'
import { useHistory } from 'react-router-dom'
import { PATHS } from '../../Routes'
import { handleCreateNewBooking, setBookingStatus } from '../../../store/facilityBooking/action'
import { BookingStatus } from '../../../store/facilityBooking/types'

type Props = {
  modalOpen: boolean
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export default function ConflictBookingModal(props: Props) {
  const dispatch = useDispatch()
  const history = useHistory()
  const { booking } = useSelector((state: RootState) => state.facilityBooking)

  function toggleStatus() {
    props.setModalOpen(!open)
    dispatch(setBookingStatus(BookingStatus.INITIAL))
  }
  function onRightClick() {
    // TODO doesn't work as intended (investigate)
    dispatch(
      handleCreateNewBooking(
        booking?.facilityID,
        booking?.eventName,
        booking?.startTime ?? null,
        booking?.endTime ?? null,
        booking?.endDate,
        booking?.ccaID,
        booking?.description,
        true,
      ),
    )
    toggleStatus()
  }
  function toLink() {
    history.push(PATHS.VIEW_FACILITY_CONFLICT)
  }

  return (
    <ConfirmationModal
      isModalOpen={props.modalOpen}
      rightButtonText="Confirm"
      title="Conflict in your bookings!"
      onLeftButtonClick={toggleStatus}
      onRightButtonClick={onRightClick}
      leftButtonText="Cancel"
      hasLeftButton
      description="Do you still want to continue with the non-conflicting bookings?"
      onLinkClick={toLink}
      link="View Conflicts"
    />
  )
}
