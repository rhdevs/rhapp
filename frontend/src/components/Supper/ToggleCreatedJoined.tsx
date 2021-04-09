import React, { ReactElement } from 'react'
import { Tabs } from 'antd'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { PATHS } from '../../routes/Routes'

const { TabPane } = Tabs

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
`

const TabContainer = styled(Tabs)`
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: rgba(0, 0, 0, 0.7);
    font-weight: 700;
  }

  .ant-tabs-ink-bar {
    position: absolute;
    background: rgba(0, 0, 0, 0.7);
    pointer-events: none;
  }
`

type Props = {
  createdTab: ReactElement
  createdTabUrl: string
  joinedTab: ReactElement
  joinedTabUrl: string
  tabKey: string
}

export const ToggleCreatedJoined = (props: Props) => {
  const history = useHistory()
  return (
    <MainContainer>
      <TabContainer
        centered
        onTabClick={(key) => {
          history.replace(PATHS.SUPPER_HOME)
          if (key === '1') history.push(props.createdTabUrl)
          else history.push(props.joinedTabUrl)
        }}
        defaultActiveKey={props.tabKey ?? '1'}
        size={'middle'}
        style={{ marginBottom: 32 }}
      >
        <TabPane tab="Created" key="1">
          {props.createdTab}
        </TabPane>
        <TabPane tab="Joined" key="2">
          {props.joinedTab}
        </TabPane>
      </TabContainer>
    </MainContainer>
  )
}
