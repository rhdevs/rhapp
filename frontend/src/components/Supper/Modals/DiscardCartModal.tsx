import React from 'react'

import { SupperModal } from './SupperModal'

export const DiscartCartModal = () => {
  return (
    <SupperModal
      title="Discard Cart?"
      description="You have added items to your cart. Exiting this page will remove all items from your cart."
      leftButtonText="Confirm"
      onLeftButtonClick={() => console.log('click left')}
      onRightButtonClick={() => console.log('right clcik')}
    />
  )
}
