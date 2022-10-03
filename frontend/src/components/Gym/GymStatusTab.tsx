/* eslint-disable  @typescript-eslint/no-non-null-assertion */
import React, { ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import GymStatus from './GymStatus'
import GymKeyWith from './GymKeyWith'
import GymConfirmationModal from './GymConfirmationModal'
import { RootState } from '../../store/types'
import { getGymStatus, getProfilePic } from '../../store/gym/action'
import { getUserDetail } from '../../store/social/action'
import { ButtonStates, ButtonTypes, gymStates } from '../../store/gym/types'
import ButtonComponent from '../Button'

const GymContainer = styled.div`
  background: #fff;
  padding: 50px 0;
`

const ButtonContainer = styled.div`
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`
/**
 *
 * @param
 * @returns gym status page with gym status, who the key is with, and three buttons (Key With Me, Return Key, Open Gym)
 *
 * @example
 * user called Shaun and has no profile picture is holding on to the key
 * component will display the default profile picture, his name Shaun as well as his
 * telegram handle. Clicking on the telegram handle redirects the user to key holder's telegram
 * user Jonathan enters the page. He should see the above, and the 3 buttons below.
 *
 */

function GymStatusTab() {
  const dispatch = useDispatch()
  const { gymStatus } = useSelector((state: RootState) => state.gym)
  const { name, telegramHandle, userId } = useSelector((state: RootState) => state.social)
  useEffect(() => {
    dispatch(getGymStatus())
    dispatch(getUserDetail())
    dispatch(getProfilePic())
  }, [])

  const [isModalOpen, setModalOpen] = useState<boolean>(false)
  const [modalState, setModalState] = useState<gymStates>()

  const buttonMap = new Map<ButtonTypes, string>([
    ['keyWithMe', 'Key With Me'],
    ['returnKey', 'Return Key'],
    ['closeGym', 'Close Gym'],
    ['openGym', 'Open Gym'],
  ])

  const gymButtonStates = new Map<string, ButtonStates>([
    ['gymOpen', { keyWithMe: false, returnKey: false, toggleGym: true }],
    ['gymClosed', { keyWithMe: false, returnKey: true, toggleGym: true }],
    ['keyWithOthers', { keyWithMe: true, returnKey: false, toggleGym: false }],
  ])

  /**
   *
   * @param
   * @returns Map<string, ButtonStates>, containing the status of the gym and key
   *
   */

  function getButtonStates(): ButtonStates {
    if (!gymStatus.gymIsOpen) {
      if (gymStatus.keyHolder.displayName === name) {
        return gymButtonStates.get('gymClosed')!
      }
      return gymButtonStates.get('keyWithOthers')!
    }
    //Runs this if gym is open
    if (gymStatus.keyHolder.displayName === name) {
      return gymButtonStates.get('gymOpen')!
    }
    return gymButtonStates.get('keyWithOthers')!
  }

  /**
   *
   * @param key (type `string`)
   * @returns text displayed on each button
   *
   */

  function getButtonText(key: string): string {
    if (key === 'toggleGym') {
      return gymStatus.gymIsOpen ? buttonMap.get('closeGym')! : buttonMap.get('openGym')!
    }
    return buttonMap.get(key)!
  }

  /**
   *
   * Sets `isModalOpen` to `true`, and `modalState` to the current status of the gym
   *
   * @param key (type `string`)
   * @returns
   *
   */

  function handleModalState(key: string): void {
    setModalOpen(true)
    if (key === 'toggleGym') {
      if (gymStatus.gymIsOpen) {
        setModalState(gymStates.CLOSE_GYM)
        return
      }
      setModalState(gymStates.OPEN_GYM)
      return
    }
    setModalState(getGymStatesFromKey(key))
  }

  /**
   *
   * @param key (type `string`)
   * @returns gym state from enum list `gymStates`
   *
   */

  function getGymStatesFromKey(key: string): gymStates {
    if (key == 'keyWithMe') {
      return gymStates.KEY_WITH_ME
    }
    return gymStates.RETURN_KEY
  }

  /**
   *
   * @param
   * @returns renders `GymConfirmationModal` component with the key holder's information and gym status
   *
   */

  function renderConfirmationModal(): ReactElement {
    return (
      <GymConfirmationModal
        gymIsOpen={gymStatus.gymIsOpen}
        setModalOpen={setModalOpen}
        isModalOpen={isModalOpen}
        modalState={modalState}
        userId={userId}
        name={name}
        telegramHandle={telegramHandle}
      />
    )
  }

  /**
   *
   * @param
   * @returns a button to be displayed on the screen, with onClick function handleModalState()
   * handleModalState() sets the value of isModalOpen to true, and modalState to the current status of the gym
   *
   */

  function renderButton() {
    const buttonState = getButtonStates()
    return Object.keys(buttonState).map((key: string) => (
      <ButtonComponent
        key={key}
        state={buttonState[key] ? 'primary' : 'secondary'}
        text={getButtonText(key)}
        disabled={!buttonState[key]}
        onClick={() => handleModalState(key)}
      />
    ))
  }

  return (
    <GymContainer>
      {renderConfirmationModal()}
      <GymStatus isOpen={gymStatus.gymIsOpen} />
      <GymKeyWith
        name={gymStatus.keyHolder.displayName}
        handle={gymStatus.keyHolder.telegramHandle}
        avatar={gymStatus.avatar}
      />
      <ButtonContainer>{renderButton()}</ButtonContainer>
    </GymContainer>
  )
}

export default GymStatusTab
