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
  background-color: #fff;
  min-height: 100vh;
  height: 100%;
  width: 100vw;
  display: flex;
  flex-direction: column;
  margin-top: 45px;
`

const TabContainer = styled.div`
  display: flex;
  width: 100%;
  margin: 0 15%;
`

const FacilityNameContainer = styled.div`
  color: '#000000';
  font-family: 'Lato';
  font-style: normal;
  font-weight: 700;
  font-size: 22px;
  position: absolute;
  margin: 15% 10%;
`

const LevelContainer = styled.div`
  font-family: 'Lato';
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 20px;
  margin-left: 30px;
  top: 50%;
  margin: 15% 10%;
  position: absolute;
`

const LevelValueContainer = styled.div`
  font-family: 'Lato';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 20px;
  margin-right: 30px;
  top: 50%;
  right: 5%;
  margin: 15% 10%;
  position: absolute;
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
/**
 * # CreateCrowdAnalyzerPage
 * Path: '/crowd'
 *
 * ## Page Description
 * This page is accessed to check crowd analytics.
 *
 */
const CrowdAnalyzerPage = ({ onLeftClick }: { onLeftClick?: () => void }) => {
  const title = 'Crowd Analyzer'
  const level = 'Current level:'
  const value = 'High - 98%'
  const facility = 'Gym'
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

        <FacilityNameContainer>{facility}</FacilityNameContainer>
        <LevelContainer>{level}</LevelContainer>
        <LevelValueContainer>{value}</LevelValueContainer>
      </MainContainer>
      <BottomNavBar />
    </PullToRefreshRH>
  )
}

export default CrowdAnalyzerPage
