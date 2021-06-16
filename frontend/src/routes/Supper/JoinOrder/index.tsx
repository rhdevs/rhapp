import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

import styled from 'styled-components'
import { ShareAltOutlined } from '@ant-design/icons'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import Button from '../../../components/Mobile/Button'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { JoinOrderSGCard } from '../../../components/Supper/CustomCards/JoinOrderSGCard'
import { createOrder, getSupperGroupById, readableSupperGroupId, unixTo12HourTime } from '../../../store/supper/action'
import { RootState } from '../../../store/types'
import { PATHS } from '../../Routes'
import { Restaurants } from '../../../store/supper/types'

const Background = styled.div`
  height: 100vh;
  width: 100vw;
  background: #fafaf4;
  position: relative;
`
const ButtonContainer = styled.div`
  margin-top: 40px;
  position: absolute;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, 0);
`

export default function JoinOrder() {
  const rightIcon = <ShareAltOutlined />
  const { supperGroup } = useSelector((state: RootState) => state.supper)
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
      <TopNavBar title="Join Order" rightComponent={rightIcon} />
      <JoinOrderSGCard
        isOwner={supperGroup?.ownerId === localStorage.userID}
        title={supperGroup?.supperGroupName ?? ''}
        restaurant={supperGroup?.restaurantName as Restaurants}
        orderId={readableSupperGroupId(supperGroup?.supperGroupId)}
        username={supperGroup?.ownerId === localStorage.userID ? 'You' : supperGroup?.ownerName ?? ''}
        currentAmount={supperGroup?.currentFoodCost ?? 0}
        priceLimit={supperGroup?.costLimit ?? 50}
        closingTime={unixTo12HourTime(supperGroup?.closingTime)}
        numberOfUsers={supperGroup?.userIdList?.length ?? 0}
        splitACType={supperGroup?.splitAdditionalCost}
        deliveryFee={String((supperGroup?.additionalCost ?? 0).toFixed(2))}
      />
      <ButtonContainer>
        <Button onButtonClick={onClick} defaultButtonDescription="Join Order" stopPropagation={true} />
      </ButtonContainer>
      <BottomNavBar />
    </Background>
  )
}
