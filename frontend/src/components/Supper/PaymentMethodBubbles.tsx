import React from 'react'

import styled from 'styled-components'
import { PaymentMethod } from '../../store/supper/types'
import { StatusSymbol } from './StatusSymbol'
import tick from '../../assets/whiteTick.svg'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/types'
import { V1_BLUE } from '../../common/colours'
import { setSelectedPaymentMethod } from '../../store/supper/action/setter'

const CheckIcon = styled.img`
  margin-top: -4px;
`

const ScrollableContainer = styled.div<{ margin?: string }>`
  overflow: scroll;
  width: fit-content;
  max-width: 90vw;
  margin: ${(props) => props.margin ?? 'auto'};
`

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  padding: 5px 0;
  width: fit-content;
  margin-right: 10px;
`

type Props = {
  onlyOne?: boolean
  paymentMethods: PaymentMethod[]
  margin?: string
}

export const PaymentMethodBubbles = (props: Props) => {
  const CHECK_ICON = <CheckIcon src={tick} alt="Check Icon" />

  const { selectedPaymentMethod } = useSelector((state: RootState) => state.supper)
  const dispatch = useDispatch()

  return (
    <ScrollableContainer margin={props.margin}>
      <MainContainer>
        {props.paymentMethods.map((paymentMethod, index) => {
          if (selectedPaymentMethod.includes(paymentMethod)) {
            return (
              <StatusSymbol
                onClick={() => {
                  const updatedPaymentMethod = props.onlyOne
                    ? []
                    : selectedPaymentMethod.filter((pm) => {
                        return pm !== paymentMethod
                      })
                  dispatch(setSelectedPaymentMethod(updatedPaymentMethod))
                }}
                border={V1_BLUE}
                color="white"
                borderWidth="1px"
                backgroundColor="bluegrey"
                shadow
                key={index}
                text={paymentMethod}
                rightIcon={CHECK_ICON}
              />
            )
          } else {
            return (
              <StatusSymbol
                onClick={() => {
                  const updatedPaymentMethod = props.onlyOne
                    ? [paymentMethod]
                    : selectedPaymentMethod.concat(paymentMethod)
                  dispatch(setSelectedPaymentMethod(updatedPaymentMethod))
                }}
                border={V1_BLUE}
                color={V1_BLUE}
                borderWidth="1px"
                shadow
                key={index}
                text={paymentMethod}
              />
            )
          }
        })}
      </MainContainer>
    </ScrollableContainer>
  )
}
