import { FileZipTwoTone, ShareAltOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { JoinOrderSGCard } from '../../../components/Supper/CustomCards/JoinOrderSGCard'
import { OrderSummaryCard } from '../../../components/Supper/CustomCards/OrderSummaryCard'
import { UnderlinedButton } from '../../../components/Supper/UnderlinedButton'
import { foodList, orderList } from '../../../store/stubs'
import { getCollatedOrder, getSupperGroupById } from '../../../store/supper/action'
import { RootState } from '../../../store/types'

const MainContainer = styled.div`
  width: 100vw;
  height: fit-content;
  min-height: 100vh;
  background-color: #fafaf4;
  padding-bottom: 4rem;
`

const SummaryContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 80vw;
  margin: 15px auto 0 auto;
  align-items: baseline;
`

const SubContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const SummaryText = styled.h3`
  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 14px;
  padding-right: 5px;
`

const TotalPriceText = styled.h3`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 14px;
  width: 80vw;
  justify-content: flex-end;
  display: flex;
  margin: 15px auto;
`

const ViewOrder = () => {
  const params = useParams<{ supperGroupId: string }>()
  const dispatch = useDispatch()
  const { supperGroup, collatedOrder } = useSelector((state: RootState) => state.supper)
  const [viewCollatedOrder, setViewCollatedOrder] = useState(false)

  useEffect(() => {
    dispatch(getSupperGroupById(params.supperGroupId))
    dispatch(getCollatedOrder(params.supperGroupId))
  }, [])

  console.log(collatedOrder)
  return (
    <MainContainer>
      <TopNavBar title="View Order" rightComponent={<ShareAltOutlined style={{ fontSize: '20px' }} />} />
      <JoinOrderSGCard
        restaurantLogo={supperGroup?.restaurantLogo}
        cardMargin="0 23px"
        isOwner={supperGroup?.ownerId === localStorage.userID}
        title={supperGroup?.supperGroupName ?? ''}
        orderId={String(supperGroup?.supperGroupId ?? 'RHSO#')}
        username={supperGroup?.ownerName ?? ''}
        currentAmount={supperGroup?.currentFoodCost ?? 0}
        priceLimit={supperGroup?.costLimit ?? 50}
        closingTime={String(supperGroup?.closingTime ?? '-')}
        numberOfUsers={supperGroup?.userIdList.length ?? 0}
        splitACType={supperGroup?.splitAdditionalCost}
        deliveryFee={'$' + String(supperGroup?.additionalCost?.toFixed(2) ?? '0.00')}
      />
      <SummaryContainer>
        <SubContainer>
          <SummaryText>Summary</SummaryText>
          <FileZipTwoTone onClick={() => setViewCollatedOrder(!viewCollatedOrder)} />
        </SubContainer>
        <UnderlinedButton text="Add Item" color="red" />
        {/* TODO: font-weight: 200; */}
      </SummaryContainer>
      <OrderSummaryCard
        margin="5px 23px"
        orderByUser
        collatedOrder={viewCollatedOrder ? collatedOrder : undefined}
        isEditable
        foodList={foodList}
        orderList={orderList}
      />
      <TotalPriceText>Total Price: ${supperGroup?.totalPrice.toFixed(2) ?? '0.00'}</TotalPriceText>
      <br />
    </MainContainer>
  )
}

export default ViewOrder
