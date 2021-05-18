import React, { useState } from 'react'

import styled from 'styled-components'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import { Food } from '../../store/supper/types'
import { FoodLineInCard } from './FoodLineInCard'
import { StatusSymbol } from './StatusSymbol'
import { UnderlinedButton } from './UnderlinedButton'
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
`

const TopMoneyText = styled.text`
  width: 20%;
  margin: auto;
  justify-content: flex-end;
  display: flex;
`

const ExpandableButtonContainer = styled.div`
  padding-top: 10px;
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
  padding-left: 1.5rem;
  font-weight: 500;
  font-size: 14px;
`

const TelegramHandle = styled.text`
  font-weight: 500;
  font-size: 14px;
`

const BottomContainer = styled.div``

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
`

const NameText = styled.text<{ cancelName: boolean }>`
  font-weight: 500;
  font-size: 17px;
  text-decoration: ${(props) => (props.cancelName ? 'line-through' : 'none')};
  color: rgba(0, 0, 0, 0.47);
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
}

export const UserPaymentStatus = (props: Props) => {
  const [cancelName, setCancelName] = useState(props.hasReceived)
  const [isExpanded, setIsExpanded] = useState(false)

  const buttonText = isExpanded ? 'Hide Details' : 'Show Details'
  const arrowIcon = isExpanded ? <CaretUpOutlined /> : <CaretDownOutlined />

  return (
    <MainContainer>
      <TopContainer>
        <LeftContainer>
          <Checkbox
            isChecked={cancelName}
            onClick={() => {
              setCancelName(!cancelName)
              //set order hasReceived to true
              // dispatch(updateOrderDetails({ hasReceived: true }, props.orderId))
            }}
          />
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
      </TopContainer>
      <BottomContainer>
        <DetailsContainer>
          {props.phoneNumber}{' '}
          <TelegramHandle
            onClick={() => {
              OpenUserTelegram(props.telegramHandle)
            }}
          >
            @{props.telegramHandle}
          </TelegramHandle>
        </DetailsContainer>
        <>
          <ExpandableButtonContainer>
            <UnderlinedButton
              onClick={() => {
                setIsExpanded(!isExpanded)
              }}
              fontSize="13px"
              text={buttonText}
              rightIcon={arrowIcon}
            />
          </ExpandableButtonContainer>
          {isExpanded &&
            props.foodList.map((food, index) => {
              const customisations: string[] = []
              food.foodMenu.custom?.map((custom) =>
                custom.options.map((option) => {
                  if (option.isSelected) customisations.push(option.name)
                }),
              )
              return (
                <>
                  <FoodLineInCard
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
                      Delivery Fee <MoneyText>${props.additionalCost.toFixed(2)}</MoneyText>
                    </DeliveryFeeText>
                  )}
                </>
              )
            })}
        </>
      </BottomContainer>
    </MainContainer>
  )
}
