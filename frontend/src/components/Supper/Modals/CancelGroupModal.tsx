import React from 'react'
import { useDispatch } from 'react-redux'

import { SupperModal } from './SupperModal'
import { SupperGroupStatus } from '../../../store/supper/types'
import { updateSupperGroup } from '../../../store/supper/action/level1/putRequests'

type Props = {
  modalSetter: React.Dispatch<React.SetStateAction<boolean>>
  onLeftButtonClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  supperGroupId: string | number | undefined
  withDispatch?: boolean
}

export const CancelGroupModal = (props: Props) => {
  const dispatch = useDispatch()

  const onLeftClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (props.withDispatch && props.supperGroupId)
      dispatch(updateSupperGroup(props.supperGroupId, { status: SupperGroupStatus.CANCELLED }))
    if (props.onLeftButtonClick) props.onLeftButtonClick(e)
  }

  return (
    <SupperModal
      title="Cancel Supper Group?"
      description="Supper groups marked as cancelled cannot be edited anymore."
      leftButtonText="Confirm"
      modalSetter={props.modalSetter}
      onLeftButtonClick={onLeftClick}
    />
  )
}
