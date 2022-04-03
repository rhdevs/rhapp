import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { css } from 'styled-components'
import { Icon } from 'antd-mobile'
import GymHistory from '../../components/Gym/GymHistory'
import GymStatusTab from '../../components/Gym/GymStatusTab'
import PullToRefreshRH from '../../components/PullToRefreshRH'
import BottomNavBar from '../../components/Mobile/BottomNavBar'

const NavBarIcons = styled(Icon)`
  &.am-icon-md {
    width: 35px;
    height: 35px;
  }

  margin-left: 0.5rem;
  width: 35px;
  height: 35px;
  position: fixed;
`

const GymBarContainer = styled.div`
  position: fixed;
  width: 100%;
  display: flex;
  background-color: #fff;
  align-items: center;
  top: 0;
  padding-top: env(safe-area-inset-top);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
`

const MainContainer = styled.div`
  margin-top: 45px;
`

const TabContainer = styled.div`
  display: flex;
  width: 100%;
  margin: 0 15%;
`

const GymTabContainer = styled.div<{ isSelected?: boolean }>`
  flex: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
  background-color: #fff;
  color: ${(props) => (props.isSelected ? '#59ba95' : '#191919')};
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  height: 45px;
  ${(props) => props.isSelected && SelectedTab}
`

const SelectedTab = css`
  background-position: 50% 2.5em;
  background-image: linear-gradient(to bottom, #59ba95, #73bb75);
  background-repeat: no-repeat;
  background-size: 100% 2px;
`

export default function GymPage({ onLeftClick }: { onLeftClick?: () => void }) {
  const [currentTab, setCurrentTab] = useState<number>(0)
  const sections = ['Gym', 'History']
  const history = useHistory()

  function TabPage(tabID: number) {
    switch (tabID) {
      case 0:
        return <GymStatusTab />
      case 1:
        return <GymHistory />
    }
  }

  return (
    <PullToRefreshRH>
      <GymBarContainer>
        <NavBarIcons
          type="left"
          onClick={() => {
            onLeftClick ? onLeftClick() : history.goBack()
          }}
        />
        <TabContainer>
          {sections.map((section, index) => {
            const isSelected = index === currentTab
            return (
              <GymTabContainer key={index} onClick={() => setCurrentTab(index)} isSelected={isSelected}>
                {section}
              </GymTabContainer>
            )
          })}
        </TabContainer>
      </GymBarContainer>
      <MainContainer>{TabPage(currentTab)}</MainContainer>
      <BottomNavBar />
    </PullToRefreshRH>
  )
}
