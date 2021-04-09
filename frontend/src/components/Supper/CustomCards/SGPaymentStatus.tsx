import React from 'react'

import styled from 'styled-components'
import { SplitACMethod, SupperGroup } from '../../../store/supper/types'
import { MainCard } from '../MainCard'
import { UserPaymentStatus } from '../UserPaymentStatus'

const HorizontalLine = styled.hr`
  width: 100%;
  height: 1px;
  background: black;
  border: none;
`

type Props = {
  supperGroup: SupperGroup
}

export const SGPaymentStatus = (props: Props) => {
  return (
    <MainCard flexDirection="column">
      {props.supperGroup.orderList ? (
        props.supperGroup.orderList.map((order, index) => {
          const additionalCost =
            props.supperGroup.splitAdditionalCost === SplitACMethod.EQUAL
              ? props.supperGroup.additionalCost ?? 0 / props.supperGroup.userIdList.length
              : ((props.supperGroup.additionalCost ?? 0) * order.totalCost) /
                (props.supperGroup.currentFoodCost + (props.supperGroup.additionalCost ?? 0))
          return (
            <>
              <UserPaymentStatus
                key={index}
                name={order.user.displayName}
                phoneNumber={order.userContact}
                telegramHandle={order.user.telegramHandle}
                hasPaid={order.hasPaid}
                foodList={order.foodList}
                hasReceived={order.hasReceived}
                totalCost={order.totalCost}
                additionalCost={additionalCost}
              />
              {index + 1 !== props.supperGroup.orderList?.length && <HorizontalLine />}
            </>
          )
        })
      ) : (
        <>there are no orders!</>
      )}
    </MainCard>
  )
}
