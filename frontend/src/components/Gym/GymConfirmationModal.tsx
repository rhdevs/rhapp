import React from 'react'
import { ConfirmationModal } from '../ConfirmationModal'
import { moveKey, returnKey, toggleGym } from '../../store/gym/action'
import { gymStates } from '../../store/gym/types'
import { useDispatch } from 'react-redux'

/**
 *
 * Modifies the modal state of the gym.
 *
 * @param gymIsOpen (type `boolean`)
 * @param userId (type `string`)
 * @param name (type `string`)
 * @param telegramHandle (type `string`)
 * @param isModalOpen (type `boolean`)
 * @param setModalOpen (type `(value: ((prevState: boolean) => boolean) | boolean) => void`)
 * @param modalState (type `gymStates | undefined`)
 *
 * @returns Popup window to be displayed when user clicks one of the 'Key With Me', 'Return Key' or 'Open Gym' buttons.
 */
function GymConfirmationModal(props: {
  gymIsOpen: boolean | null
  userId: string
  name: string
  telegramHandle: string
  isModalOpen: boolean
  setModalOpen: (value: ((prevState: boolean) => boolean) | boolean) => void
  modalState: gymStates | undefined
}) {
  const dispatch = useDispatch()
  function dispatchModalAction(): void {
    switch (props.modalState) {
      case gymStates.KEY_WITH_ME: {
        dispatch(moveKey(props.userId, props.name, props.telegramHandle))
        return
      }
      case gymStates.RETURN_KEY: {
        dispatch(returnKey(props.userId))
        return
      }
      case gymStates.OPEN_GYM: {
        dispatch(toggleGym(props.userId))
        return
      }
      case gymStates.CLOSE_GYM: {
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
      case gymStates.KEY_WITH_ME: {
        return 'Confirm Key With You?'
      }
      case gymStates.RETURN_KEY: {
        return 'Return the Key?'
      }
      case gymStates.OPEN_GYM: {
        return 'Open the Gym?'
      }
      case gymStates.CLOSE_GYM: {
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
