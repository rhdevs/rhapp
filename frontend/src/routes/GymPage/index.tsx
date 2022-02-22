import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { GymTabContainer } from '../../components/Tabs'
import { Icon } from 'antd-mobile'
import GymHistory from '../../components/GymHistory'
import GymStatusTab from '../../components/Gym/GymStatusTab'

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
            <GymTabContainer key={index} onClick={() => setCurrentTab(index + 1)} isSelected={isSelected}>
              {section}
            </GymTabContainer>
          )
        })}
      </GymBarContainer>
      {TabPage(currentTab)}
    </>
  )
}
