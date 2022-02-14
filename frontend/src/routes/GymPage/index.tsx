import React, { useState, useEffect } from 'react'
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
import { ButtonStates } from '../../store/gym/types'
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

const DummyHistoryRow = styled.div`
  justify-content: space-between;
  text-align: center;
  height: auto;
  padding: 0.5rem;
`

const GymContainer = styled.div`
  padding: 50px 0;
`

export default function GymPage({ onLeftClick }: { onLeftClick?: () => void }) {
  const dispatch = useDispatch()
  const { gymStatus } = useSelector((state: RootState) => state.gym)
  const { name } = useSelector((state: RootState) => state.social)
  const gymHistory = [
    {
      gymStatus: true,
      keyStatus: 'cooltelegram',
      requesttime: 1643388954,
      telegramHandle: 'cooltelegram',
      userID: 'A0123456Z',
    },
    {
      gymStatus: true,
      keyStatus: 'anothernewdude',
      requesttime: 1643389801,
      telegramHandle: 'anothernewdude',
      userID: 'A0234567M',
    },
  ]
  useEffect(() => {
    dispatch(getGymStatus())
    dispatch(getUserDetail())
    // dispatch(getGymHistory())
  }, [])

  const [currentTab, setCurrentTab] = useState<number>(1)
  const sections = ['Gym', 'History']
  const history = useHistory()
  //TODO: export this
  const buttonText = ['Key With Me', 'Return Key', 'Close Gym', 'Open Gym']

  function getButtonStates(): ButtonStates {
    if (!gymStatus.gymIsOpen) {
      if (gymStatus.keyHolder.displayName == name) {
        return { keyWithMe: false, returnKey: true, toggleGym: true }
      }
      return { keyWithMe: true, returnKey: false, toggleGym: false }
    }
    //Runs this if gym is open
    if (gymStatus.keyHolder.displayName == name) {
      return { keyWithMe: false, returnKey: false, toggleGym: true }
    }
    return { keyWithMe: true, returnKey: false, toggleGym: false }
  }

  function renderButton() {
    const buttonState: ButtonStates = getButtonStates()
    return Object.keys(buttonState).map((key, index) => (
      <ButtonComponent
        key={index}
        state={buttonState[key] ? 'primary' : 'secondary'}
        text={getButtonText(key, index)}
        onClick={getButtonFunction(buttonText[index])}
        disabled={!buttonState[key]}
      />
    ))
  }

  function getButtonText(key: string, index: number): string {
    if (key != 'toggleGym') {
      return buttonText[index]
    }
    return gymStatus.gymIsOpen ? buttonText[index] : buttonText[index + 1]
  }

  function getButtonFunction(button: string): () => unknown {
    switch (button) {
      case 'Key With Me': {
        return () => dispatch(moveKey(name, Date.now()))
      }
      case 'Return Key': {
        return () => dispatch(returnKey(name, Date.now()))
      }
      case 'Close Gym': {
        return () => dispatch(toggleGym(name, Date.now()))
      }
      default:
        return () => console.error('Invalid Button')
    }
  }

  function TabPage(tabID: number) {
    switch (tabID) {
      case 1:
        return (
          <GymContainer>
            <GymStatus isOpen />
            <GymKeyWith name={gymStatus.keyHolder.displayName} handle={gymStatus.keyHolder.telegramHandle} />
            <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {renderButton()}
            </div>
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
