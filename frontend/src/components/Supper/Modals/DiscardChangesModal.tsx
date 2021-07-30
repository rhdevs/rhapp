import React from 'react'
import { useHistory } from 'react-router-dom'

import { SupperModal } from './SupperModal'

type Props = {
  modalSetter: React.Dispatch<React.SetStateAction<boolean>>
}

export const DiscardChangesModal = (props: Props) => {
  const history = useHistory()
  return (
    <SupperModal
      title="Discard Changes?"
      description="You have made changes to your cart. Changes will be unsaved if you exit this page."
      leftButtonText="Confirm"
      modalSetter={props.modalSetter}
      onLeftButtonClick={() => history.goBack()}
    />
  )
}
