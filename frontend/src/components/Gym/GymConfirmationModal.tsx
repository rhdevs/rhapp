import React from 'react'
import { useDispatch } from 'react-redux'
import { ConfirmationModal } from '../ConfirmationModal'
import { moveKey, returnKey, toggleGym } from '../../store/gym/action'
import { ButtonTypes } from '../../store/gym/types'

function GymConfirmationModal(props: {
  gymIsOpen: boolean | null
  userId: string
  name: string
  telegramHandle: string
  isModalOpen: boolean
  setModalOpen: (value: ((prevState: boolean) => boolean) | boolean) => void
  modalState: ButtonTypes | undefined
}) {
  const dispatch = useDispatch()
  function dispatchModalAction(): void {
    switch (props.modalState) {
      case 'keyWithMe': {
        dispatch(moveKey(props.userId, props.name, props.telegramHandle))
        return
      }
      case 'returnKey': {
        dispatch(returnKey(props.userId))
        return
      }
      case 'openGym': {
        dispatch(toggleGym(props.userId))
        return
      }
      case 'closeGym': {
        dispatch(toggleGym(props.userId))
        return
      }
      default:
        console.error('Invalid Action')
        return
    }
  }

  function getTitle(): string {
    switch (props.modalState) {
      case 'keyWithMe': {
        return 'Confirm Key With You?'
      }
      case 'returnKey': {
        return 'Return the Key?'
      }
      case 'openGym': {
        return 'Open the Gym?'
      }
      case 'closeGym': {
        return 'Close the Gym?'
      }
      default:
        return ''
    }
  }

  function onRightClick(): void {
    dispatchModalAction()
    props.setModalOpen(false)
  }

  return (
    <ConfirmationModal
      isModalOpen={props.isModalOpen}
      setModalOpen={props.setModalOpen}
      rightButtonType="primary"
      rightButtonText="Confirm"
      onRightButtonClick={onRightClick}
      hasLeftButton
      leftButtonType="secondary"
      onLeftButtonClick={() => props.setModalOpen(false)}
      title={getTitle()}
    />
  )
}
export default GymConfirmationModal
