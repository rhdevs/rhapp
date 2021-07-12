import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import styled from 'styled-components'
import ReloadOutlined from '@ant-design/icons/lib/icons/ReloadOutlined'
import { onRefresh } from '../../../common/reloadPage'
import { setExpandAll, setPaymentExpandedCount } from '../../../store/supper/action'
import { SplitACMethod, SupperGroup } from '../../../store/supper/types'
import { RootState } from '../../../store/types'
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

const TopSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`

const StyledReloadIcon = styled(ReloadOutlined)`
  margin: auto 0;
  font-size: 17px;
`

type Props = {
  supperGroup?: SupperGroup | null
  margin?: string
}

export const SGPaymentStatus = (props: Props) => {
  const dispatch = useDispatch()
  const { isExpandAll } = useSelector((state: RootState) => state.supper)
  const buttonText = isExpandAll ? 'Expand all' : 'Collapse all'

  const groupWithoutOwnerOrder = props.supperGroup?.orderList?.filter(
    (order) => order.user.userID !== localStorage.userID,
  )
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
            <StyledReloadIcon onClick={() => onRefresh()} />
          </TopSection>

          {groupWithoutOwnerOrder.map((order, index) => {
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
                  phoneNumber={order.userContact} //TODO: CHECK whether should make type compulsory
                  telegramHandle={order.user.telegramHandle}
                  hasPaid={order.hasPaid}
                  foodList={order.foodList}
                  hasReceived={order.hasReceived}
                  totalCost={order.totalCost}
                  additionalCost={additionalCost}
                  paymentMethod={order.paymentMethod}
                  numOrders={groupWithoutOwnerOrder?.length ?? 0}
                  supperGroupId={props.supperGroup?.supperGroupId}
                />
                {index + 1 !== groupWithoutOwnerOrder?.length && <HorizontalLine />}
              </>
            )
          })}
        </>
      ) : (
        <StyledText>No orders found!</StyledText>
      )}
    </>
  )
}
