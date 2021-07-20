import React from 'react'
import { useDispatch } from 'react-redux'

import styled from 'styled-components'
import { SupperModal } from './SupperModal'
import { SupperGroupStatus } from '../../../store/supper/types'
import { updateSupperGroup } from '../../../store/supper/action'
import { useHistory } from 'react-router-dom'

const DescriptionText = styled.div`
  padding-bottom: 1rem;
`

type Props = {
  modalSetter: React.Dispatch<React.SetStateAction<boolean>>
  supperGroupId: string | number
}

export const ConfirmStatusUpdateModal = (props: Props) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const onLeftClick = () => {
    dispatch(updateSupperGroup(props.supperGroupId, { status: SupperGroupStatus.ARRIVED }))
    history.goBack()
  }

  return (
    <SupperModal
      title="Confirm Status Update?"
      flex
      description={
        <DescriptionText>
          If the food has arrived you may update order status to “arrived” to notify all joiners. <br />
          <br />
          Updating status to “arrived” cannot be undone (i.e. you cannot change status back to “ordered” or change it to
          “cancelled”).
        </DescriptionText>
      }
      leftButtonText="Confirm"
      modalSetter={props.modalSetter}
      onLeftButtonClick={onLeftClick}
    />
  )
}
