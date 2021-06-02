import { ShareAltOutlined } from '@ant-design/icons'
import React from 'react'
import { useHistory, useParams } from 'react-router-dom'

import styled from 'styled-components'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import Button from '../../../components/Mobile/Button'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { JoinOrderSGCard } from '../../../components/Supper/CustomCards/JoinOrderSGCard'
import { SplitACMethod } from '../../../store/supper/types'
import { PATHS } from '../../Routes'

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
  const params = useParams<{ supperGroupId: string }>()
  const history = useHistory()
  const supperGroup = { restaurantId: '605e183e0312ad1400fdc98c' }

  return (
    <Background>
      <TopNavBar title="Join Order" rightComponent={rightIcon} />
      <JoinOrderSGCard
        title="f> SUPPER FRIENDS"
        restaurant="MacDonald"
        orderId="RHSO#1002"
        username="Zhou BaoBao"
        currentAmount={50}
        priceLimit={100}
        closingTime="11:59PM"
        numberOfUsers={7}
        splitACType={SplitACMethod.EQUAL}
        deliveryFee="10.70"
      />
      <ButtonContainer>
        <Button
          onButtonClick={() =>
            history.push(
              `${PATHS.USER_SUPPER_GROUP_PLACE_ORDER}/${params.supperGroupId}/${supperGroup?.restaurantId}/order`,
            )
          }
          defaultButtonDescription="Join Order"
          stopPropagation={true}
        />
      </ButtonContainer>
      <BottomNavBar />
    </Background>
  )
}
