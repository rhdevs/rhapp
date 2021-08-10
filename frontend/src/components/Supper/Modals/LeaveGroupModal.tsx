import React from 'react'
import { useDispatch } from 'react-redux'
import { leaveSupperGroup } from '../../../store/supper/action/level1/deleteRequests'

import { SupperModal } from './SupperModal'

type Props = {
  modalSetter: React.Dispatch<React.SetStateAction<boolean>>
  onLeftButtonClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  supperGroupId: number | string | undefined
}

export const LeaveGroupModal = (props: Props) => {
  const dispatch = useDispatch()
  const onLeftClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (props.supperGroupId) {
      dispatch(leaveSupperGroup(props.supperGroupId))
      if (props.onLeftButtonClick) props.onLeftButtonClick(e)
    }
  }
  return (
    <SupperModal
      title="Leave group?"
      description="You will be removed from the supper group."
      leftButtonText="Confirm"
      modalSetter={props.modalSetter}
      onLeftButtonClick={onLeftClick}
    />
  )
}
