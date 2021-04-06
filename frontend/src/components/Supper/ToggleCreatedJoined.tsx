import React from 'react'
import { Tabs } from 'antd'
import styled from 'styled-components'

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
export const ToggleCreatedJoined = () => {
  return (
    <MainContainer>
      <TabContainer defaultActiveKey="1" size={'middle'} style={{ marginBottom: 32 }}>
        <TabPane tab="Created" key="1">
          Created Supper Group
        </TabPane>
        <TabPane tab="Joined" key="2">
          Joined Supper Group
        </TabPane>
      </TabContainer>
    </MainContainer>
  )
}
