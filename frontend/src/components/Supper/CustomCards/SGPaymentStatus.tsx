import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import styled from 'styled-components'
import { setExpandAll, setPaymentExpandedCount } from '../../../store/supper/action'
import { SplitACMethod, SupperGroup } from '../../../store/supper/types'
import { RootState } from '../../../store/types'
import { MainCard } from '../MainCard'
import { UnderlinedButton } from '../UnderlinedButton'
import { UserPaymentStatus } from '../UserPaymentStatus'

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
  font-size: 18px;
  margin: 10px auto;
`

type Props = {
  supperGroup?: SupperGroup | null
  margin?: string
}

export const SGPaymentStatus = (props: Props) => {
  const dispatch = useDispatch()
  const { isExpandAll } = useSelector((state: RootState) => state.supper)
  const buttonText = isExpandAll ? 'Expand all' : 'Collapse all'

  return (
    <MainCard margin={props.margin} flexDirection="column">
      {props.supperGroup?.orderList && props.supperGroup?.orderList?.length ? (
        <>
          <UnderlinedButton
            text={buttonText}
            onClick={() => {
              dispatch(setExpandAll(!isExpandAll))
              if (!isExpandAll) {
                dispatch(setPaymentExpandedCount(0))
              } else {
                dispatch(setPaymentExpandedCount(props.supperGroup?.orderList?.length ?? 0))
              }
            }}
          />
          {props.supperGroup.orderList.map((order, index) => {
            const additionalCost =
              props.supperGroup?.splitAdditionalCost === SplitACMethod.EQUAL
                ? props.supperGroup?.additionalCost ?? 0 / (props.supperGroup?.userIdList?.length ?? 0)
                : ((props.supperGroup?.additionalCost ?? 0) * order.totalCost) /
                  (props.supperGroup?.currentFoodCost ?? 0 + (props.supperGroup?.additionalCost ?? 0))
            return (
              <>
                <UserPaymentStatus
                  orderId={order.orderId}
                  key={index}
                  name={order.user.displayName}
                  phoneNumber={order.userContact ?? 0} //TODO: CHECK whether should make type compulsory
                  telegramHandle={order.user.telegramHandle}
                  hasPaid={order.hasPaid}
                  foodList={order.foodList}
                  hasReceived={order.hasReceived}
                  totalCost={order.totalCost}
                  additionalCost={additionalCost}
                  paymentMethod={order.paymentMethod}
                  numOrders={props.supperGroup?.orderList?.length ?? 0}
                />
                {index + 1 !== props.supperGroup?.orderList?.length && <HorizontalLine />}
              </>
            )
          })}
        </>
      ) : (
        <StyledText>No orders found!</StyledText>
      )}
    </MainCard>
  )
}
