import React from 'react'
import { useDispatch } from 'react-redux'

import { SupperModal } from './SupperModal'
import { SupperGroupStatus } from '../../../store/supper/types'
import { updateSupperGroup } from '../../../store/supper/action'

type Props = {
  modalSetter: React.Dispatch<React.SetStateAction<boolean>>
  onLeftButtonClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  supperGroupId: string | number
}

export const CloseGroupEarlyModal = (props: Props) => {
  const dispatch = useDispatch()
  const onLeftClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    dispatch(updateSupperGroup(props.supperGroupId, { supperGroupStatus: SupperGroupStatus.CLOSED }))
    if (props.onLeftButtonClick) props.onLeftButtonClick(e)
  }
  return (
    <SupperModal
      title="Close Group Early?"
      flex
      description="Close supper group if you are ready to order! No new changes can be made after supper group is closed."
      leftButtonText="Confirm"
      modalSetter={props.modalSetter}
      onLeftButtonClick={onLeftClick}
    />
  )
}
