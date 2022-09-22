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

/*
* # GymStatusTab
*  
*/

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

  function getButtonText(key: string): string {
    if (key === 'toggleGym') {
      return gymStatus.gymIsOpen ? buttonMap.get('closeGym')! : buttonMap.get('openGym')!
    }
    return buttonMap.get(key)!
  }

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

  function getGymStatesFromKey(key: string): gymStates {
    if (key == 'keyWithMe') {
      return gymStates.KEY_WITH_ME
    }
    return gymStates.RETURN_KEY
  }

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
