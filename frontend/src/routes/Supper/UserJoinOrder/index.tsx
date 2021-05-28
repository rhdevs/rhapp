import { ShareAltOutlined } from '@ant-design/icons'
import React from 'react'
import { useSelector } from 'react-redux'

import styled from 'styled-components'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import Button from '../../../components/Mobile/Button'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { JoinOrderSGCard } from '../../../components/Supper/CustomCards/JoinOrderSGCard'
import { readableSupperGroupId, unixTo12HourTime } from '../../../store/supper/action'
import { RootState } from '../../../store/types'

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

export default function UserJoinOrder() {
  const rightIcon = <ShareAltOutlined />
  const { supperGroup } = useSelector((state: RootState) => state.supper)

  return (
    <Background>
      <TopNavBar title="Join Order" rightComponent={rightIcon} />
      <JoinOrderSGCard
        title={supperGroup?.supperGroupName ?? ''}
        restaurant={supperGroup?.restaurantName}
        orderId={readableSupperGroupId(supperGroup?.supperGroupId)}
        username={supperGroup?.ownerName ?? ''}
        currentAmount={supperGroup?.currentFoodCost ?? 0}
        priceLimit={supperGroup?.costLimit ?? 50}
        closingTime={unixTo12HourTime(supperGroup?.closingTime)}
        numberOfUsers={supperGroup?.userIdList.length ?? 0}
        splitACType={supperGroup?.splitAdditionalCost}
        deliveryFee={'$' + String((supperGroup?.additionalCost ?? 0).toFixed(2))}
      />
      <ButtonContainer>
        <Button defaultButtonDescription="Join Order" stopPropagation={true} />
      </ButtonContainer>
      <BottomNavBar />
    </Background>
  )
}
