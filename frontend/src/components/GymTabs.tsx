import React, { ReactElement, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Tabs } from 'antd'
import { NavBar, Icon } from 'antd-mobile'
import styled from 'styled-components'
import 'antd-mobile/dist/antd-mobile.css'
import { Separator, GymTabContainer } from './Tabs'

const CustomTabs = styled(Tabs)`
  justify-content: space-between;
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #59ba95 !important;
    font-weight: 500;
  }
  .ant-tabs-ink-bar {
    // antd does not support linear-gradient
    border-bottom: 2px solid #59ba95;
  }
`
const NewNavBar = styled(NavBar)`
  &.am-navbar {
    height: 70px;
    background-color: #ffffff; !important
  }
  padding: 15px;
  max-width:100%;
  position: sticky;
  top:0;
`

const StyledNavBar = styled(NavBar)`
  &.am-navbar {
    height: 70px;
    background-color: #ffffff; !important
  }
  padding: 15px;
  max-width:100%;
  position: sticky;
  top:0;
  z-index:200;
  display: flex;
  flex-direction: row;
  justify-content: right;
  align-items: center;
`
const NavBarIcons = styled(Icon)`
  &.am-icon-md {
    width: 40px;
    height: 40px;
  }
  padding-right: 11px;
  width: 40px;
  height: 40px;
`

const { TabPane } = Tabs

function GymNavBar({
  title,
  leftIcon,
  leftIconComponent,
  rightComponent,
  centerComponent,
  onLeftClick,
}: {
  title?: string
  leftIcon?: boolean
  leftIconComponent?: ReactElement
  rightComponent?: ReactElement | undefined
  centerComponent?: ReactElement
  onLeftClick?: () => void
}) {
  const [currentTab, setCurrentTab] = useState<number>(1)
  const sections = ['Gym', 'History']
  const history = useHistory()
  return (
    <>
      <div style={{ display: 'flex' }}>
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
      </div>
      <GymTabs />
      <StyledNavBar
        mode="light"
        icon={
          <>
            {leftIcon && leftIconComponent}
            {!leftIcon && (
              <NavBarIcons
                type="left"
                onClick={() => {
                  onLeftClick ? onLeftClick() : history.goBack()
                }}
                color="#002642"
              />
            )}
          </>
        }
        rightContent={rightComponent}
      >
        <CustomTabs defaultActiveKey="1" centered>
          <TabPane tab="Activities" key="1" />
          <TabPane tab="Details" key="2" />
        </CustomTabs>
      </StyledNavBar>
      <TabPane tab="Activities" key="1">
        Tab 1 content
      </TabPane>
      <TabPane tab="Details" key="2">
        Tab 2 content
      </TabPane>
    </>
  )
}

function GymTabs({
  title,
  leftIcon,
  leftIconComponent,
  rightComponent,
  centerComponent,
  onLeftClick,
}: {
  title?: string
  leftIcon?: boolean
  leftIconComponent?: ReactElement
  rightComponent?: ReactElement | undefined
  centerComponent?: ReactElement
  onLeftClick?: () => void
}) {
  const history = useHistory()
  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyItems: 'center' }}>
      <div style={{ justifyContent: 'left' }}>
        <NavBar
          mode="light"
          icon={
            <>
              {leftIcon && leftIconComponent}
              {!leftIcon && (
                <NavBarIcons
                  type="left"
                  onClick={() => {
                    onLeftClick ? onLeftClick() : history.goBack()
                  }}
                  color="#002642"
                />
              )}
            </>
          }
        ></NavBar>
      </div>
      <div style={{ justifyContent: 'center' }}>
        <CustomTabs defaultActiveKey="1" centered tabBarGutter={50}>
          <TabPane tab="Activities" key="1">
            Tab 1 content
          </TabPane>
          <TabPane tab="Details" key="2">
            Tab 2 content
          </TabPane>
        </CustomTabs>
      </div>
    </div>
  )
}

export default GymNavBar
