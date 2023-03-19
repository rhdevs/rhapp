import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { Icon } from 'antd-mobile'
import PullToRefreshRH from '../../components/PullToRefreshRH'
import BottomNavBar from '../../components/Mobile/BottomNavBar'
import SearchBar from '../../components/CrowdAnalyzer/SearchBar'

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

const CrowdAnalyzerBarContainer = styled.div`
  position: fixed;
  width: 100%;
  display: flex;
  background-color: #ffffff;
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

const DescriptionContainer = styled.div`
  margin-top: 300px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 50px;
`

const LevelContainer = styled.div`
  font-family: 'Lato';
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 20px;
`

const LevelValueContainer = styled.div`
  font-family: 'Lato';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 20px;
`
const CrowdAnalyzerTabContainer = styled.div`
  flex: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
  background-color: #ffffff;
  color: '#000000';
  font-family: 'Lato';
  font-style: normal;
  font-weight: 700;
  font-size: 22px;
  height: 20px;
`

export default function CrowdAnalyzerPage({ onLeftClick }: { onLeftClick?: () => void }) {
  const title = 'Crowd Analyzer'
  const level = 'Current level:'
  const value = 'High - 98%'
  const history = useHistory()

  return (
    <PullToRefreshRH>
      <CrowdAnalyzerBarContainer>
        <NavBarIcons
          type="left"
          onClick={() => {
            onLeftClick ? onLeftClick() : history.goBack()
          }}
        />
        <TabContainer>
          <CrowdAnalyzerTabContainer>{title}</CrowdAnalyzerTabContainer>
        </TabContainer>
      </CrowdAnalyzerBarContainer>
      <MainContainer>
        <SearchBar />
        <DescriptionContainer>
          <LevelContainer>{level}</LevelContainer>
          <LevelValueContainer>{value}</LevelValueContainer>
        </DescriptionContainer>
      </MainContainer>
      <BottomNavBar />
    </PullToRefreshRH>
  )
}
