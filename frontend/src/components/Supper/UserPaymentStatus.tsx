import React, { useEffect, useState } from 'react'

import styled from 'styled-components'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import { Food, PaymentMethod } from '../../store/supper/types'
import { StatusSymbol } from './StatusSymbol'
import { TelegramShareButton } from '../TelegramShareButton'
import { Checkbox } from '../Checkbox'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/types'
import {
  // setPaymentUpdateArray,
  updateOrderDetails,
} from '../../store/supper/action'
import { FoodLine } from './FoodLine'
import { setExpandAll, setPaymentExpandedCount } from '../../store/supper/action/setter'

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
`

const TopContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
`

const TopMoneyText = styled.text`
  width: 20%;
  margin: auto;
  justify-content: flex-end;
  display: flex;
`
const StatusSymbolContainer = styled.div`
  width: 30%;
  margin: auto;
  display: flex;
  justify-content: center;
`

const DetailsContainer = styled.div`
  width: 82%;
  margin: 0 15px 0 auto;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  justify-content: space-between;
  align-items: center;
  display: flex;
`

const DeliveryFeeText = styled.text`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 92%;
  margin: 0 0 0 auto;
  padding-right: 5px;
`

const MoneyText = styled.text`
  font-size: ${0.85 * 14}px;
`

const LeftContainer = styled.div`
  width: 50%;
  margin: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const NameText = styled.text<{ cancelName: boolean }>`
  font-weight: 500;
  font-size: 17px;
  text-decoration: ${(props) => (props.cancelName ? 'line-through' : 'none')};
  color: rgba(0, 0, 0, 0.47);
`

const CheckboxContainer = styled.div`
  width: fit-content;
`

const PaymentMethodText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  margin: 10px auto 0 auto;
`

type Props = {
  isExpanded?: boolean
  orderId?: string
  foodList: Food[]
  name: string
  hasPaid: boolean
  phoneNumber?: number
  telegramHandle: string
  hasReceived: boolean
  totalCost: number
  deliveryFee: number
  paymentMethod?: PaymentMethod | undefined
  numOrders?: number
  supperGroupId?: number
}

export const UserPaymentStatus = (props: Props) => {
  const { isExpandAll, expandedCount } = useSelector((state: RootState) => state.supper)
  const [cancelName, setCancelName] = useState(props.hasReceived)
  const [isExpanded, setIsExpanded] = useState(props.isExpanded ?? false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isExpandAll) {
      dispatch(setPaymentExpandedCount(0))
    } else {
      dispatch(setPaymentExpandedCount(props.numOrders ?? 0))
    }
  }, [dispatch])

  useEffect(() => {
    if (expandedCount === props.numOrders) {
      dispatch(setExpandAll(false))
    }
    if (expandedCount === 0) {
      dispatch(setExpandAll(true))
    }
  }, [dispatch, expandedCount])

  useEffect(() => {
    setIsExpanded(!isExpandAll)
  }, [isExpandAll])

  const arrowIcon = isExpanded ? (
    <CaretUpOutlined
      onClick={() => {
        setIsExpanded(false)
        dispatch(setPaymentExpandedCount(expandedCount - 1))
      }}
      style={{ paddingLeft: '5px' }}
    />
  ) : (
    <CaretDownOutlined
      onClick={() => {
        setIsExpanded(true)
        dispatch(setPaymentExpandedCount(expandedCount + 1))
      }}
      style={{ paddingLeft: '5px' }}
    />
  )

  const onClick = () => {
    //TODO: Test to see if updating individual checking of name works, if not can use array method
    // dispatch(setPaymentUpdateArray(props.orderId, !cancelName))
    const newOrderDetails = { hasReceived: !cancelName }
    props.orderId && dispatch(updateOrderDetails(props.orderId, newOrderDetails))
    setCancelName(!cancelName)
  }

  return (
    <MainContainer>
      <TopContainer>
        <LeftContainer>
          <CheckboxContainer>
            <Checkbox margin="auto 5px auto 0" isChecked={cancelName} onClick={onClick} />
          </CheckboxContainer>
          <NameText onClick={onClick} cancelName={cancelName}>
            {props.name}
          </NameText>
        </LeftContainer>
        <StatusSymbolContainer>
          <StatusSymbol minHeight="" padding="0 5px" text={props.hasPaid ? 'Paid' : 'Unpaid'} />
        </StatusSymbolContainer>
        <TopMoneyText>${(props.totalCost + props.deliveryFee).toFixed(2)}</TopMoneyText>
        {arrowIcon}
      </TopContainer>
      <>
        {isExpanded && (
          <>
            <DetailsContainer>
              {props.phoneNumber}
              <TelegramShareButton telegramHandle={props.telegramHandle} />
            </DetailsContainer>
            {props.foodList.map((food, index) => {
              const customisations: string[] = []
              food.custom?.map((custom) =>
                custom.options.map((option) => {
                  if (option.isSelected) customisations.push(option.name)
                }),
              )
              return (
                <>
                  <FoodLine margin="10px 0" supperGroupId={props.supperGroupId} food={food} />
                  {index + 1 === props.foodList.length && (
                    <DeliveryFeeText>
                      Delivery Fee <MoneyText>${props.deliveryFee.toFixed(2) ?? '0.00'}</MoneyText>
                    </DeliveryFeeText>
                  )}
                </>
              )
            })}
            {props.hasPaid && <PaymentMethodText>Paid by {props.paymentMethod}</PaymentMethodText>}
          </>
        )}
      </>
    </MainContainer>
  )
}
