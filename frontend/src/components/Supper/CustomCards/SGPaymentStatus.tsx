import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import styled from 'styled-components'
import { SupperGroup, SupperGroupStatus } from '../../../store/supper/types'
import { RootState } from '../../../store/types'
import { UnderlinedButton } from '../UnderlinedButton'
import { UserPaymentStatus } from '../UserPaymentStatus'
import { getIndivDeliveryFee } from '../../../common/calculateDeliveryFee'
import { setExpandAll, setPaymentExpandedCount } from '../../../store/supper/action/setter'

const HorizontalLine = styled.hr`
  width: 100%;
  height: 1px;
  background: black;
  border: none;
`

const StyledText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  margin: 10px auto;
  display: flex;
  justify-content: center;
`

const TopSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`

type Props = {
  supperGroup?: SupperGroup | null
  margin?: string
}

export const SGPaymentStatus = (props: Props) => {
  const dispatch = useDispatch()
  const { isExpandAll } = useSelector((state: RootState) => state.supper)
  const buttonText = isExpandAll ? 'Expand all' : 'Collapse all'
  const unclickable = props.supperGroup?.status === SupperGroupStatus.COMPLETED

  const groupWithoutOwnerOrder = props.supperGroup?.orderList?.filter(
    (order) => order.user.userID !== localStorage.userID,
  )
  const emptyUserListTextArr = [
    'nobody ordered w u! loser!!',
    'Nothing to show.',
    'Nothing to show.',
    'Nothing to show.',
  ]

  return (
    <>
      {groupWithoutOwnerOrder && groupWithoutOwnerOrder?.length ? (
        <>
          <TopSection>
            <UnderlinedButton
              fontSize="13px"
              fontWeight={500}
              text={buttonText}
              onClick={() => {
                dispatch(setExpandAll(!isExpandAll))
                if (!isExpandAll) {
                  dispatch(setPaymentExpandedCount(0))
                } else {
                  dispatch(setPaymentExpandedCount(groupWithoutOwnerOrder?.length ?? 0))
                }
              }}
            />
          </TopSection>

          {groupWithoutOwnerOrder.map((order, index) => {
            const deliveryFee = getIndivDeliveryFee(order.totalCost, props.supperGroup)
            return (
              <>
                <UserPaymentStatus
                  orderId={order.orderId}
                  key={index}
                  name={order.user.displayName}
                  phoneNumber={order.userContact}
                  telegramHandle={order.user.telegramHandle}
                  hasPaid={order.hasPaid}
                  foodList={order.foodList}
                  hasReceived={order.hasReceived}
                  totalCost={order.totalCost}
                  deliveryFee={deliveryFee}
                  paymentMethod={order.paymentMethod}
                  numOrders={groupWithoutOwnerOrder?.length ?? 0}
                  supperGroupId={props.supperGroup?.supperGroupId}
                  unclickable={unclickable}
                />
                {index + 1 !== groupWithoutOwnerOrder?.length && <HorizontalLine />}
              </>
            )
          })}
        </>
      ) : (
        <StyledText>{emptyUserListTextArr[Math.floor(Math.random() * emptyUserListTextArr.length)]}</StyledText>
      )}
    </>
  )
}
