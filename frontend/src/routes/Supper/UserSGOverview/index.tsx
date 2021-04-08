import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import styled from 'styled-components'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { MainSGCard } from '../../../components/Supper/CustomCards/MainSGCard'
import { ToggleCreatedJoined } from '../../../components/Supper/ToggleCreatedJoined'
import {
  getAllUserJoinedSupperGroup,
  getSupperHistory,
  readableSupperGroupId,
  unixTo12HourTime,
} from '../../../store/supper/action'
import { RootState } from '../../../store/types'
import { PATHS } from '../../Routes'

const Background = styled.div`
  height: 100vh;
  width: 100vw;
  background: #fafaf4;
  position: relative;
`

export default function UserSGOverview() {
  const param = useParams<{ section: string }>()
  const dispatch = useDispatch()
  const { joinedSupperGroupHistory, supperGroupHistory } = useSelector((state: RootState) => state.supper)

  const clickedHistorySection =
    param.section === 'created'
      ? supperGroupHistory.length
        ? supperGroupHistory
        : null
      : param.section === 'joined'
      ? joinedSupperGroupHistory.length
        ? joinedSupperGroupHistory
        : null
      : null

  const sectionSupperGroups = (
    <>
      {clickedHistorySection
        ? clickedHistorySection.map((supperGroup, index) => {
            return (
              <MainSGCard
                key={index}
                title={supperGroup.supperGroupName}
                time={unixTo12HourTime(supperGroup.closingTime)}
                users={supperGroup.numOrders}
                orderId={readableSupperGroupId(supperGroup.supperGroupId)}
              />
            )
          })
        : 'No supper groups'}
    </>
  )

  const onCreatedClick = `${PATHS.USER_SUPPER_GROUP_OVERVIEW}/created`
  const onJoinedClick = `${PATHS.USER_SUPPER_GROUP_OVERVIEW}/joined`

  const key = param.section === 'created' ? '1' : '2'

  useEffect(() => {
    dispatch(getSupperHistory(localStorage.userID))
    dispatch(getAllUserJoinedSupperGroup(localStorage.userID))
  }, [dispatch])

  return (
    <Background>
      <TopNavBar title="Supper Order" />
      <ToggleCreatedJoined
        createdTabUrl={onCreatedClick}
        joinedTabUrl={onJoinedClick}
        createdTab={<>{sectionSupperGroups}</>}
        joinedTab={<>{sectionSupperGroups}</>}
        tabKey={key}
      />
    </Background>
  )
}
