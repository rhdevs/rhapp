import React from 'react'
import { useDispatch } from 'react-redux'

import { updateSupperGroup } from '../../../store/supper/action/level1/putRequests'
import { SupperGroupStatus } from '../../../store/supper/types'
import { SupperModal } from './SupperModal'

type Props = {
  modalSetter: React.Dispatch<React.SetStateAction<boolean>>
  onLeftButtonClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  suppergroupId: number | string | undefined
}

export const EndSupperGroupModal = (props: Props) => {
  const dispatch = useDispatch()
  const onLeftClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    dispatch(updateSupperGroup(props.suppergroupId, { status: SupperGroupStatus.COMPLETED }))
    if (props.onLeftButtonClick) props.onLeftButtonClick(e)
  }
  return (
    <SupperModal
      title="End Supper Group?"
      description="Ending supper group will update the group’s status as completed. You can revisit this supper group anytime within the next 5 days from the history page. Thereafter it will be deleted."
      leftButtonText="Confirm"
      modalSetter={props.modalSetter}
      onLeftButtonClick={onLeftClick}
    />
  )
}
