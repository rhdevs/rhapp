import React, { useState } from 'react'

import styled from 'styled-components'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import { Food, PaymentMethod } from '../../store/supper/types'
import { FoodLineInCard } from './FoodLineInCard'
import { StatusSymbol } from './StatusSymbol'
import telegram_black from '../../assets/telegram_black.svg'
import { OpenUserTelegram } from '../TelegramShareButton'
import { Checkbox } from '../Checkbox'
// import { updateOrderDetails } from '../../store/supper/action'

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
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

const ExpandableButtonContainer = styled.div`
  left: 15%;
  display: flex;
  align-items: center;
  padding-left: 1.5rem;
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

const TelegramHandle = styled.text`
  font-weight: 500;
  font-size: 14px;
`

const DeliveryFeeText = styled.text`
  padding-left: 2.2rem;
  display: flex;
  justify-content: space-between;
  padding-right: 0.6rem;
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
  margin: -10px 0 0 0;
`

const PaymentMethodText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  margin: 10px auto 0 auto;
`

type Props = {
  orderId?: string
  foodList: Food[]
  name: string
  hasPaid: boolean
  phoneNumber?: number
  telegramHandle: string
  hasReceived: boolean
  totalCost: number
  additionalCost: number
  paymentMethod: PaymentMethod
}

export const UserPaymentStatus = (props: Props) => {
  const [cancelName, setCancelName] = useState(props.hasReceived)
  const [isExpanded, setIsExpanded] = useState(false)

  const arrowIcon = isExpanded ? (
    <CaretUpOutlined
      onClick={() => {
        setIsExpanded(!isExpanded)
      }}
      style={{ paddingLeft: '5px' }}
    />
  ) : (
    <CaretDownOutlined
      onClick={() => {
        setIsExpanded(!isExpanded)
      }}
      style={{ paddingLeft: '5px' }}
    />
  )

  return (
    <MainContainer>
      <TopContainer>
        <LeftContainer>
          <CheckboxContainer>
            <Checkbox
              isChecked={cancelName}
              onClick={() => {
                setCancelName(!cancelName)
                //set order hasReceived to true
                // dispatch(updateOrderDetails({ hasReceived: true }, props.orderId))
              }}
            />
          </CheckboxContainer>
          <NameText
            onClick={() => {
              setCancelName(!cancelName)
            }}
            cancelName={cancelName}
          >
            {props.name}
          </NameText>
        </LeftContainer>
        <StatusSymbolContainer>
          <StatusSymbol text={props.hasPaid ? 'Paid' : 'Unpaid'} />
        </StatusSymbolContainer>
        <TopMoneyText>${props.totalCost.toFixed(2)}</TopMoneyText>
        {arrowIcon}
      </TopContainer>
      <>
        {isExpanded && (
          <>
            <DetailsContainer>
              {props.phoneNumber}
              <img
                onClick={() => {
                  OpenUserTelegram(props.telegramHandle)
                }}
                src={telegram_black}
                alt="Telegram Icon"
              />
            </DetailsContainer>
            {props.foodList.map((food, index) => {
              const customisations: string[] = []
              food.foodMenu.custom?.map((custom) =>
                custom.options.map((option) => {
                  if (option.isSelected) customisations.push(option.name)
                }),
              )
              return (
                <>
                  <FoodLineInCard
                    padding="5px 15px 10px 15px"
                    fontPercentage={0.85}
                    key={index}
                    foodName={food.foodMenu.foodMenuName}
                    qty={food.quantity}
                    price={food.foodPrice}
                    customisations={customisations}
                    comments={food.comments}
                  />
                  {index + 1 === props.foodList.length && (
                    <DeliveryFeeText>
                      Delivery Fee <MoneyText>${props.additionalCost.toFixed(2) ?? '0.00'}</MoneyText>
                    </DeliveryFeeText>
                  )}
                </>
              )
            })}
            <PaymentMethodText>Paid by {props.paymentMethod}</PaymentMethodText>
          </>
        )}
      </>
    </MainContainer>
  )
}
