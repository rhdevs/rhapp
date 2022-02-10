import React, { useEffect, useState } from 'react'
import GymNavBar from '../../components/GymNavBar'
import GymStatus from '../../components/GymStatus'
import GymKeyWith from '../../components/GymKeyWith'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { RootState } from '../../store/types'
import styled from 'styled-components'
import { GymTabContainer } from '../../components/Tabs'
import { Icon } from 'antd-mobile'
import ButtonComponent from '../../components/Button'

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

export default function GymPage({ onLeftClick }: { onLeftClick?: () => void }) {
  // const dispatch = useDispatch()
  // const history = useHistory()
  // const { gymStatus, gymHistory, isLoading } = useSelector((state: RootState) => state.gym)
  // const [currentTab, setCurrentTab] = useState<number>(1)
  // const sections = ['Gym', 'History']

  // useEffect(() => {
  //   dispatch(getGymStatus())
  //   dispatch(getGymHistory())
  // }, [dispatch])

  // const content = () => {
  //   let gymGroupArr: getGymHistory[] = gymHistory
  //   if (currentTab === 2) {
  //     gymGroupArr = gymStatus
  //   }
  //   const openOrPendingSupperGroups = gymGroupArr.filter(
  //     (gymGroup : getGymHistory) =>
  //       gymGroup.history
  //   )

  //   const nonActiveSupperGroups = gymGroupArr.filter(
  //     (supperGroup: getGymHistory) =>
  //       supperGroup.status !== SupperGroupStatus.OPEN && supperGroup.status !== SupperGroupStatus.PENDING,
  //   )

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

  const [currentTab, setCurrentTab] = useState<number>(1)
  const [currentGymTab, setCurrentGymTab] = useState<string>('Gym')
  const sections = ['Gym', 'History']
  const gymTelegram = gymHistory.map((gym: any) => gym.telegramHandle)
  const history = useHistory()

  function TabPage(tabID: number) {
    switch (tabID) {
      case 1:
        return (
          <>
            <GymStatus isOpen />
            <GymKeyWith />
            <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ButtonComponent state="primary" text="Key with me" onClick={() => undefined} />
              <ButtonComponent state="primary" text="Return key" onClick={() => undefined} />
              <ButtonComponent state="primary" text="Close Gym" onClick={() => undefined} />
            </div>
          </>
        )
      case 2:
        return (
          <>
            {gymHistory.map((gymGroup, index) => {
              return (
                <DummyHistoryRow key={index}>
                  {gymGroup.telegramHandle}
                  {gymGroup.userID}
                </DummyHistoryRow>
              )
            })}
          </>
        )
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
      {/*
      {currentTab === 1 ? (
        <>
          <GymStatus isOpen />
          <GymKeyWith />
          <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ButtonComponent state="primary" text="Key with me" onClick={() => undefined} />
            <ButtonComponent state="primary" text="Return key" onClick={() => undefined} />
            <ButtonComponent state="primary" text="Close Gym" onClick={() => undefined} />
          </div>
        </>
      ) : (
        <>
          {gymHistory.map((gymGroup, index) => {
            return (
              <DummyHistoryRow key={index}>
                {gymGroup.telegramHandle}
                {gymGroup.userID}
              </DummyHistoryRow>
            )
          })}
        </>
        )}
        */}
    </>
  )
}
