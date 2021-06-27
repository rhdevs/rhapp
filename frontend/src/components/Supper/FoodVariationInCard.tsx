import { EditOutlined } from '@ant-design/icons'
import React, { MouseEventHandler } from 'react'

import styled from 'styled-components'
import { CancelAction } from '../../store/supper/types'

const MainContainer = styled.div<{ padding?: string | undefined }>`
  height: fit-content;
  position: relative;
  width: 100%;
  padding: ${(props) => props.padding ?? '10px'};
  display: flex;
  flex-direction: row;
`

const QuantityContainer = styled.div<{
  fontPercentage?: number | undefined
  quantityWeight?: number | undefined
  quantitySize?: number | undefined
}>`
  width: 10%;
  font-size: ${(props) => (props.quantitySize ? props.quantitySize : (props.fontPercentage ?? 1) * 17)}px;
  font-weight: ${(props) => props.quantityWeight ?? 400};
  line-height: 22px;
  color: #de5f4c;
`

const SubContainer = styled.div`
  width: 90%;
`

const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const MiddleContainer = styled.div``

const RightContainer = styled.div``

const TitleText = styled.text<{ fontPercentage?: number | undefined }>`
  font-size: ${(props) => (props.fontPercentage ?? 1) * 17}px;
  line-height: 22px;
`

const MoneyText = styled.text<{ fontPercentage?: number | undefined; moneyWeight?: number | undefined }>`
  font-size: ${(props) => (props.fontPercentage ?? 1) * 14}px;
  font-weight: ${(props) => props.moneyWeight ?? 400};
  line-height: 14px;
  margin: auto 0;
`

const BottomContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const CustomisationContainer = styled.div`
  min-width: 76%;
  display: flex;
  flex-direction: column;
`

const CustomText = styled.text<{ fontPercentage?: number | undefined }>`
  font-size: ${(props) => (props.fontPercentage ?? 1) * 14}px;
  line-height: 14px;
  font-weight: 200;
  margin: auto 0;
`

const IconsContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: fit-content;
`

const CommentsContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const CancelActionContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const BoldText = styled.text<{ fontPercentage?: number | undefined }>`
  font-weight: 400;
  font-size: ${(props) => (props.fontPercentage ?? 1) * 14}px;
  padding-right: 5px;
`

const Icon = styled(EditOutlined)`
  padding: 0px 0px 0px 7px;
  font-size: 20px;
  color: #de5f4c;
`

type Props = {
  foodUserId?: string
  padding?: string
  fontPercentage?: number
  quantitySize?: number
  quantityWeight?: number
  moneyWeight?: number
  foodName?: string
  qty: number
  price?: number
  customisations?: string[]
  isEditable?: boolean | undefined
  comments?: string | undefined
  cancelAction?: CancelAction | undefined
  onEditClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onDeleteClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const FoodVariationInCard = (props: Props) => {
  return (
    <MainContainer padding={props.padding}>
      <QuantityContainer
        quantitySize={props.quantitySize}
        quantityWeight={props.quantityWeight}
        fontPercentage={props.fontPercentage}
      >
        {props.qty}x
      </QuantityContainer>
      <SubContainer>
        <TopContainer>
          {props.foodName ?? <TitleText fontPercentage={props.fontPercentage}>{props.foodName}</TitleText>}
          <MoneyText moneyWeight={props.moneyWeight} fontPercentage={props.fontPercentage}>
            ${props.price?.toFixed(2)}
          </MoneyText>
        </TopContainer>
        <BottomContainer>
          <CustomisationContainer>
            {props.customisations?.map((custom, index) => {
              return (
                <CustomText fontPercentage={props.fontPercentage} key={index}>
                  {custom}
                </CustomText>
              )
            })}
            {props.comments && (
              <CommentsContainer>
                <BoldText fontPercentage={props.fontPercentage}>Comments:</BoldText>
                <CustomText>{props.comments}</CustomText>
              </CommentsContainer>
            )}
            {props.cancelAction && (
              <CancelActionContainer>
                <BoldText fontPercentage={props.fontPercentage}>If unavailable:</BoldText>
                <CustomText>{props.cancelAction}</CustomText>
              </CancelActionContainer>
            )}
          </CustomisationContainer>

          {props.isEditable && (props.foodUserId ?? localStorage.userID) === localStorage.userID && (
            <IconsContainer>
              <Icon color={'red'} onClick={props.onEditClick as MouseEventHandler<HTMLImageElement>} alt="Edit Icon" />
            </IconsContainer>
          )}
        </BottomContainer>
      </SubContainer>
    </MainContainer>
  )
}