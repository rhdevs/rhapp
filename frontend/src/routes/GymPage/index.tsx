import React, { useState, useEffect, ReactElement } from 'react'
import GymStatus from '../../components/GymStatus'
import GymKeyWith from '../../components/GymKeyWith'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { RootState } from '../../store/types'
import styled from 'styled-components'
import { GymTabContainer } from '../../components/Tabs'
import { Icon } from 'antd-mobile'
import ButtonComponent from '../../components/Button'
import { getGymStatus, moveKey, returnKey, toggleGym } from '../../store/gym/action'
import { getUserDetail } from '../../store/social/action'
import { ButtonStates, ButtonTypes } from '../../store/gym/types'
import { ConfirmationModal } from '../../components/Gym/ConfirmationModal'
import GymHistory from '../../components/GymHistory'

const NavBarIcons = styled(Icon)`
  &.am-icon-md {
    width: 30px;
    height: 30px;
  }

  margin-left: 0.5rem;
  width: 30px;
  height: 30px;
`

const GymBarContainer = styled.div`
  position: sticky;
  display: flex;
  background-color: #fff;
  align-items: center;
  top: 0;
`

const GymContainer = styled.div`
  padding: 50px 0;
`

const ButtonContainer = styled.div`
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`

export default function GymPage({ onLeftClick }: { onLeftClick?: () => void }) {
  const dispatch = useDispatch()
  const { gymStatus } = useSelector((state: RootState) => state.gym)
  const { name } = useSelector((state: RootState) => state.social)
  useEffect(() => {
    dispatch(getGymStatus())
    dispatch(getUserDetail())
    // dispatch(getGymHistory())
  }, [])

  const [currentTab, setCurrentTab] = useState<number>(1)
  const [isModalOpen, setModalOpen] = useState<boolean>(false)
  const [modalState, setModalState] = useState<ButtonTypes>()
  const sections = ['Gym', 'History']
  const history = useHistory()
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
      if (gymStatus.keyHolder.displayName == name) {
        return gymButtonStates.get('gymClosed')!
      }
      return gymButtonStates.get('keyWithOthers')!
    }
    //Runs this if gym is open
    if (gymStatus.keyHolder.displayName == name) {
      return gymButtonStates.get('gymOpen')!
    }
    return gymButtonStates.get('keyWithOthers')!
  }

  function renderButton() {
    const buttonState: ButtonStates = getButtonStates()
    return Object.keys(buttonState).map((key: string, index: number) => (
      <ButtonComponent
        key={index}
        state={buttonState[key] ? 'primary' : 'secondary'}
        text={getButtonText(key)}
        onClick={() => handleModalState(key)}
      />
    ))
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
        setModalState('closeGym')
        return
      }
      setModalState('openGym')
      return
    }
    setModalState(key)
  }

  function dispatchModalAction(): void {
    switch (modalState) {
      case 'keyWithMe': {
        dispatch(moveKey(name, Date.now()))
        return
      }
      case 'returnKey': {
        dispatch(returnKey(name, Date.now()))
        return
      }
      case 'openGym': {
        dispatch(toggleGym(name, Date.now()))
        return
      }
      case 'closeGym': {
        dispatch(toggleGym(name, Date.now()))
        return
      }
      default:
        console.error('Invalid Action')
        return
    }
  }

  function getTitle(): string {
    switch (modalState) {
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
    setModalOpen(false)
  }

  function renderConfirmationModal(): ReactElement {
    return (
      <ConfirmationModal
        isModalOpen={isModalOpen}
        setModalOpen={setModalOpen}
        rightButtonType="primary"
        rightButtonText="Confirm"
        onRightButtonClick={onRightClick}
        hasLeftButton
        leftButtonType="secondary"
        onLeftButtonClick={() => setModalOpen(false)}
        title={getTitle()}
      />
    )
  }

  function TabPage(tabID: number) {
    switch (tabID) {
      case 1:
        return (
          <GymContainer>
            {renderConfirmationModal()}
            <GymStatus isOpen={gymStatus.gymIsOpen} />
            <GymKeyWith name={gymStatus.keyHolder.displayName} handle={gymStatus.keyHolder.telegramHandle} />
            <ButtonContainer>{renderButton()}</ButtonContainer>
          </GymContainer>
        )
      case 2:
        return <GymHistory />
    }
  }

  return (
    <>
      <GymBarContainer>
        <NavBarIcons
          type="left"
          onClick={() => {
            onLeftClick ? onLeftClick() : history.goBack()
          }}
        />
        {sections.map((section, index) => {
          const isSelected = sections.indexOf(section) === currentTab - 1
          return (
            <>
              <GymTabContainer key={index} onClick={() => setCurrentTab(index + 1)} isSelected={isSelected}>
                {section}
              </GymTabContainer>
            </>
          )
        })}
      </GymBarContainer>
      {TabPage(currentTab)}
    </>
  )
}
