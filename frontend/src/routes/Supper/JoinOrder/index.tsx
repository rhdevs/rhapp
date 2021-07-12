import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

import styled from 'styled-components'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import Button from '../../../components/Mobile/Button'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { createOrder, getSupperGroupById } from '../../../store/supper/action'
import { RootState } from '../../../store/types'
import { PATHS } from '../../Routes'
import { V1_BACKGROUND } from '../../../common/colours'
import { SupperGroupCard } from '../../../components/Supper/SupperGroupCard'
import LoadingSpin from '../../../components/LoadingSpin'

const Background = styled.div`
  height: 100vh;
  width: 100vw;
  background: ${V1_BACKGROUND};
  position: relative;
`

const ButtonContainer = styled.div`
  margin-top: 30px;
  position: absolute;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, 0);
`

export default function JoinOrder() {
  const { supperGroup, isLoading } = useSelector((state: RootState) => state.supper)
  const params = useParams<{ supperGroupId: string }>()
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getSupperGroupById(params.supperGroupId))
  }, [dispatch])

  const onClick = () => {
    dispatch(createOrder(localStorage.userID, params.supperGroupId))
    history.push(`${PATHS.PLACE_ORDER}/${params.supperGroupId}/${supperGroup?.restaurantId}/order`)
  }

  return (
    <Background>
      <TopNavBar title="Join Order" />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <>
          {supperGroup && <SupperGroupCard supperGroup={supperGroup} isHome={false} />}
          <ButtonContainer>
            <Button onButtonClick={onClick} defaultButtonDescription="Join Order" stopPropagation={true} />
          </ButtonContainer>
          <BottomNavBar />
        </>
      )}
    </Background>
  )
}
