import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import styled from 'styled-components'
import { V1_BACKGROUND } from '../../../common/colours'
import LoadingSpin from '../../../components/LoadingSpin'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { SupperGroupCard } from '../../../components/Supper/SupperGroupCard'
import { Separator, TabContainer } from '../../../components/Tabs'
import { getGroupHistoryPageDetails } from '../../../store/supper/action/level2'
import { HomeSupperGroup, SupperGroupStatus } from '../../../store/supper/types'
import { RootState } from '../../../store/types'
import { PATHS } from '../../Routes'
import { RefreshIcon } from '../../../components/Supper/RefreshIcon'

const Background = styled.div`
  min-height: 100vh;
  height: 100%;
  width: 100vw;
  background: ${V1_BACKGROUND};
  position: relative;
  display: grid;
  grid-template-rows: min-content 1fr min-content;
  grid-template-areas: '.' '.' '.';
`

const SubHeader = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  color: #666666;
  position: sticky;
  top: 6.5rem;
  left: 0;
  height: 28px;
  padding-left: 23px;
  z-index: 3;
  background: ${V1_BACKGROUND};
`

const MainTabsContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: fit-content;
  width: 90vw;
  margin: 0 auto;
  position: sticky;
  left: 0;
  top: 4rem;
  padding: 10px 0;
  background: #fafaf4;
  z-index: 3;
`

const SupperGroupCardsContainer = styled.div`
  margin-top: -23px;
`

const EmptyText = styled.text`
  margin: 0.5rem 0 1rem 0;
  display: flex;
  justify-content: center;
`

const GroupHistory = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { joinedSupperHistory, createdSupperHistory, isLoading } = useSelector((state: RootState) => state.supper)
  const [currentTab, setCurrentTab] = useState<number>(1)
  const sections = ['Created', 'Joined']

  useEffect(() => {
    dispatch(getGroupHistoryPageDetails())
  }, [dispatch])

  const content = () => {
    let supperGroupArr: HomeSupperGroup[] = createdSupperHistory
    if (currentTab === 2) {
      supperGroupArr = joinedSupperHistory
    }

    const openOrPendingSupperGroups = supperGroupArr.filter(
      (supperGroup: HomeSupperGroup) =>
        supperGroup.status === SupperGroupStatus.OPEN || supperGroup.status === SupperGroupStatus.PENDING,
    )

    const nonActiveSupperGroups = supperGroupArr.filter(
      (supperGroup: HomeSupperGroup) =>
        supperGroup.status !== SupperGroupStatus.OPEN && supperGroup.status !== SupperGroupStatus.PENDING,
    )
    return (
      <>
        <SubHeader>Active</SubHeader>
        {openOrPendingSupperGroups.length ? (
          <SupperGroupCardsContainer>
            {openOrPendingSupperGroups.map((supperGroup, index) => (
              <SupperGroupCard key={index} homeSupperGroup={supperGroup} isHome />
            ))}
          </SupperGroupCardsContainer>
        ) : (
          <EmptyText>No supper groups</EmptyText>
        )}
        <SubHeader>Closed</SubHeader>
        {nonActiveSupperGroups.length ? (
          <SupperGroupCardsContainer>
            {nonActiveSupperGroups.map((supperGroup, index) => (
              <SupperGroupCard key={index} homeSupperGroup={supperGroup} statusOnly isHome />
            ))}
          </SupperGroupCardsContainer>
        ) : (
          <EmptyText>No supper groups</EmptyText>
        )}
      </>
    )
  }

  return (
    <Background>
      <TopNavBar title="History" onLeftClick={() => history.push(PATHS.SUPPER_HOME)} rightComponent={<RefreshIcon />} />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <>
          <MainTabsContainer>
            {sections.map((section, index) => {
              const isSelected = sections.indexOf(section) === currentTab - 1
              return (
                <>
                  <TabContainer key={index} onClick={() => setCurrentTab(index + 1)} isSelected={isSelected}>
                    {section}
                  </TabContainer>
                  {index !== sections.length - 1 && <Separator />}
                </>
              )
            })}
          </MainTabsContainer>
          {content()}
        </>
      )}
      <BottomNavBar />
    </Background>
  )
}

export default GroupHistory
