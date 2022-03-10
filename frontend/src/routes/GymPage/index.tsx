import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { Icon } from 'antd-mobile'
import GymHistory from '../../components/Gym/GymHistory'
import GymStatusTab from '../../components/Gym/GymStatusTab'
import PullToRefreshRH from '../../components/PullToRefreshRH'
import BottomNavBar from '../../components/Mobile/BottomNavBar'

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
  background-color: #fafaf4;
  align-items: center;
  top: 0;
  padding-top: env(safe-area-inset-top);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
`

const GymTabContainer = styled.div<{ isSelected?: boolean }>`
  flex: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
  background-color: #fafaf4;
  color: #191919;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 45px;
  ${(props) =>
    props.isSelected
      ? `color: #59ba95;
    background-position: 50% 2.5em;
    background-image: linear-gradient(
      to bottom,
      #59ba95,
      #73bb75
    );
    background-repeat: no-repeat;
    background-size: 100% 2px;`
      : ``}
`

export default function GymPage({ onLeftClick }: { onLeftClick?: () => void }) {
  const [currentTab, setCurrentTab] = useState<number>(1)
  const sections = ['Gym', 'History']
  const history = useHistory()

  function TabPage(tabID: number) {
    switch (tabID) {
      case 1:
        return <GymStatusTab />
      case 2:
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
        {sections.map((section, index) => {
          const isSelected = sections.indexOf(section) === currentTab - 1
          return (
            <GymTabContainer key={index} onClick={() => setCurrentTab(index + 1)} isSelected={isSelected}>
              {section}
            </GymTabContainer>
          )
        })}
      </GymBarContainer>
      {TabPage(currentTab)}
      <BottomNavBar />
    </PullToRefreshRH>
  )
}
