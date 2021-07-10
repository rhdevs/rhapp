import React from 'react'
import { useDispatch } from 'react-redux'
import { deleteSupperGroup } from '../../../store/supper/action'

import { SupperModal } from './SupperModal'

type Props = {
  modalSetter: React.Dispatch<React.SetStateAction<boolean>>
  onLeftButtonClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  suppergroupId: number | string
}

export const EndSupperGroupModal = (props: Props) => {
  const dispatch = useDispatch()
  const onLeftClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    dispatch(deleteSupperGroup(props.suppergroupId))
    if (props.onLeftButtonClick) props.onLeftButtonClick(e)
  }
  return (
    <SupperModal
      title="End Supper Group?"
      description="All order and payment information will be deleted."
      leftButtonText="End"
      modalSetter={props.modalSetter}
      onLeftButtonClick={onLeftClick}
    />
  )
}
