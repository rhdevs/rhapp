import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

import styled from 'styled-components'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { RootState } from '../../../store/types'
import { PATHS } from '../../Routes'
import { V1_BACKGROUND } from '../../../common/colours'
import { SupperGroupCard } from '../../../components/Supper/SupperGroupCard'
import LoadingSpin from '../../../components/LoadingSpin'
import { SupperButton } from '../../../components/Supper/SupperButton'
import { createOrder } from '../../../store/supper/action/level1/postRequests'
import { getJoinGroupPageDetails } from '../../../store/supper/action/level2'
import { SupperGroupStatus } from '../../../store/supper/types'
import PullToRefreshRH from '../../../components/PullToRefreshRH'

const Background = styled.div`
  height: 100vh;
  width: 100vw;
  background: ${V1_BACKGROUND};
  position: relative;
`

const ButtonContainer = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: center;
`

const JoinGroup = () => {
  const { supperGroup, isLoading } = useSelector((state: RootState) => state.supper)
  const params = useParams<{ supperGroupId: string }>()
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getJoinGroupPageDetails(params.supperGroupId))
  }, [dispatch])

  useEffect(() => {
    if ((supperGroup?.userIdList ?? []).includes(localStorage.userID)) {
      history.replace(PATHS.SUPPER_HOME)
    }
  }, [])

  const onClick = () => {
    dispatch(createOrder(params.supperGroupId))
    history.push(`${PATHS.ORDER}/${params.supperGroupId}/${supperGroup?.restaurantId}/order`)
  }

  return (
    <PullToRefreshRH>
      <Background>
        <TopNavBar title="Join Group" />
        {isLoading ? (
          <LoadingSpin />
        ) : (
          <>
            <SupperGroupCard margin="0 23px 23px" supperGroup={supperGroup} isHome={false} />
            {(supperGroup?.status === SupperGroupStatus.OPEN || supperGroup?.status === SupperGroupStatus.PENDING) && (
              <ButtonContainer>
                <SupperButton onButtonClick={onClick} defaultButtonDescription="Join Group" />
              </ButtonContainer>
            )}
            <BottomNavBar />
          </>
        )}
      </Background>
    </PullToRefreshRH>
  )
}

export default JoinGroup
