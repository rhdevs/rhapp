import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import styled from 'styled-components'
import { V1_BACKGROUND } from '../../../common/colours'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { SupperGroupCard } from '../../../components/Supper/SupperGroupCard'
import { Tabs } from '../../../components/Tabs'
import { getAllUserJoinedSupperGroup, getSupperHistory } from '../../../store/supper/action'
import { RootState } from '../../../store/types'

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

const TabsContentContainer = styled.div`
  height: 75vh;
  overflow: scroll;
`

const MainContainer = styled.div``

export default function SGOverview() {
  // const params = useParams<{ section: string }>()
  const dispatch = useDispatch()
  const history = useHistory()
  const { joinedSupperGroupHistory, supperGroupHistory } = useSelector((state: RootState) => state.supper)

  // let section = params.section
  // if (!(params.section === 'created' || params.section === 'joined')) {
  //   section = 'created'
  //   history.replace(`${PATHS.SUPPER_GROUP_OVERVIEW}/created`)
  // }

  // const clickedHistorySection =
  //   section === 'created'
  //     ? supperGroupHistory.length
  //       ? supperGroupHistory
  //       : null
  //     : section === 'joined'
  //     ? joinedSupperGroupHistory.length
  //       ? joinedSupperGroupHistory
  //       : null
  //     : null

  // const sectionSupperGroups = (
  //   <TabsContentContainer>
  //     {clickedHistorySection
  //       ? clickedHistorySection.map((supperGroup, index) => {
  //           return (
  //             <MainSGCard
  //               onClick={() => history.push(`${PATHS.VIEW_ORDER}/${supperGroup.supperGroupId}`)}
  //               key={index}
  //               title={supperGroup.supperGroupName}
  //               time={unixTo12HourTime(supperGroup.closingTime)}
  //               users={supperGroup.numOrders}
  //               orderId={getReadableSupperGroupId(supperGroup.supperGroupId)}
  //             />
  //           )
  //         })
  //       : 'No supper groups'}
  //   </TabsContentContainer>
  // )

  // const onCreatedClick = `${PATHS.SUPPER_GROUP_OVERVIEW}/created`
  // const onJoinedClick = `${PATHS.SUPPER_GROUP_OVERVIEW}/joined`

  // const key = section === 'created' ? '1' : '2'

  const joinedSupperGroups = () => {
    return joinedSupperGroupHistory
      .concat(joinedSupperGroupHistory)
      .concat(joinedSupperGroupHistory)
      .concat(joinedSupperGroupHistory)
      .map((joinedSupperGroup, index) => {
        return <SupperGroupCard key={index} isHome homeSupperGroup={joinedSupperGroup} />
      })
  }

  useEffect(() => {
    dispatch(getSupperHistory(localStorage.userID))
    dispatch(getAllUserJoinedSupperGroup(localStorage.userID))
  }, [dispatch])

  return (
    <Background>
      <TopNavBar title="History" />
      <MainContainer>
        {/* <ToggleCreatedJoined
        createdTabUrl={onCreatedClick}
        joinedTabUrl={onJoinedClick}
        createdTab={<>{sectionSupperGroups}</>}
        joinedTab={<>{sectionSupperGroups}</>}
        tabKey={key}
      /> */}
        <Tabs
          isSticky
          width="90vw"
          margin="auto"
          valueNamesArr={['Created', 'Joined']}
          childrenArr={[joinedSupperGroups(), joinedSupperGroups()]}
        />
      </MainContainer>
      <BottomNavBar />
    </Background>
  )
}
