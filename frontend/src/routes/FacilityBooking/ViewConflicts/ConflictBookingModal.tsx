import React from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { PATHS } from '../../Routes'
import { RootState } from '../../../store/types'
import { BookingStatus } from '../../../store/facilityBooking/types'
import { handleCreateNewBooking, setBookingStatus } from '../../../store/facilityBooking/action'
import { ConfirmationModal } from '../../../components/ConfirmationModal'

type Props = {
  modalOpen: boolean
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export default function ConflictBookingModal(props: Props) {
  const dispatch = useDispatch()
  const history = useHistory()
  const { booking } = useSelector((state: RootState) => state.facilityBooking)

  const toggleStatus = () => {
    props.setModalOpen(!open)
    dispatch(setBookingStatus(BookingStatus.INITIAL))
  }

  const onRightClick = () => {
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
  const toLink = () => {
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
