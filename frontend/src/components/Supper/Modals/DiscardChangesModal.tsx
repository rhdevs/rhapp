import React from 'react'

import { SupperModal } from './SupperModal'

type Props = {
  modalSetter: React.Dispatch<React.SetStateAction<boolean>>
  onLeftButtonClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const DiscardChangesModal = (props: Props) => {
  return (
    <SupperModal
      title="Discard Changes?"
      description="You have made changes to your cart. Changes will be unsaved if you exit this page."
      leftButtonText="Confirm"
      modalSetter={props.modalSetter}
      onLeftButtonClick={props.onLeftButtonClick}
    />
  )
}
