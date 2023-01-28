import React from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { PATHS } from '../../Routes'
import { RootState } from '../../../store/types'
import { BookingStatus } from '../../../store/facilityBooking/types'
import { handleCreateNewBooking, resetBooking, setBookingStatus } from '../../../store/facilityBooking/action'
import { ConfirmationModal } from '../../../components/ConfirmationModal'

type Props = {
  type: 'recurring' | 'single'
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
    dispatch(resetBooking())
  }

  const bookNonConflictedBookings = () => {
    // proceed with non-conflict bookings
    dispatch(
      handleCreateNewBooking(
        booking?.facilityID,
        booking?.eventName,
        booking?.startTime ?? null,
        booking?.endTime ?? null,
        booking?.endDate !== 0,
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

  const modalTexts = {
    recurring: {
      title: 'Conflict in your recurring bookings!',
      description: 'Do you still want to continue with any non-conflicting bookings?',
      link: 'View Conflicts',
      hasLeftButton: true,
      onRightButtonClick: bookNonConflictedBookings,
    },
    single: {
      title: 'Conflict in your booking!',
      description: 'Your booking has conflicts with other bookings. Please try again.',
      link: '',
      hasLeftButton: false,
      onRightButtonClick: toggleStatus,
    },
  }

  return (
    <ConfirmationModal
      isModalOpen={props.modalOpen}
      rightButtonText="Confirm"
      title={modalTexts[props.type].title}
      onLeftButtonClick={toggleStatus}
      onRightButtonClick={modalTexts[props.type].onRightButtonClick}
      leftButtonText="Cancel"
      hasLeftButton={modalTexts[props.type].hasLeftButton}
      description={modalTexts[props.type].description}
      onLinkClick={toLink}
      link={modalTexts[props.type].link}
    />
  )
}
