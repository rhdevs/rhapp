import React from 'react'

import styled from 'styled-components'
import editIcon from '../../assets/SupperEditIcon.svg'
import deleteIcon from '../../assets/SupperDeleteIcon.svg'
import { CancelAction } from '../../store/supper/types'

const MainContainer = styled.div<{ padding?: string }>`
  height: fit-content;
  position: relative;
  width: 100%;
  padding: ${(props) => props.padding ?? '10px'};
  display: flex;
  flex-direction: row;
`

const QuantityContainer = styled.div<{ fontPercentage?: number }>`
  width: 10%;
  font-size: ${(props) => (props.fontPercentage ?? 1) * 17}px;
  line-height: 22px;
`

const SubContainer = styled.div`
  width: 90%;
`

const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const TitleText = styled.text<{ fontPercentage?: number }>`
  font-size: ${(props) => (props.fontPercentage ?? 1) * 17}px;
  line-height: 22px;
`

const MoneyText = styled.text<{ fontPercentage?: number }>`
  font-size: ${(props) => (props.fontPercentage ?? 1) * 14}px;
  line-height: 14px;
  margin: auto 0;
`

const BottomContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const CustomisationContainer = styled.div`
  min-width: 76%;
  display: flex;
  flex-direction: column;
`

const CustomText = styled.text<{ fontPercentage?: number }>`
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

const BoldText = styled.text<{ fontPercentage?: number }>`
  font-weight: 400;
  font-size: ${(props) => (props.fontPercentage ?? 1) * 14}px;
  padding-right: 5px;
`

const Icon = styled.img`
  padding: 7px 7px 0 7px;
`

type Props = {
  foodUserId?: string
  padding?: string
  fontPercentage?: number
  foodName: string
  qty: number
  price?: number
  customisations?: string[]
  isEditable?: boolean
  comments?: string
  cancelAction?: CancelAction
  onEditClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onDeleteClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const FoodLineInCard = (props: Props) => {
  return (
    <MainContainer padding={props.padding}>
      <QuantityContainer fontPercentage={props.fontPercentage}>{props.qty}x</QuantityContainer>
      <SubContainer>
        <TopContainer>
          <TitleText fontPercentage={props.fontPercentage}>{props.foodName}</TitleText>
          <MoneyText fontPercentage={props.fontPercentage}>${props.price?.toFixed(2)}</MoneyText>
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
              <Icon onClick={props.onEditClick} src={editIcon} alt="Edit Icon" />
              <Icon onClick={props.onDeleteClick} src={deleteIcon} alt="Edit Icon" />
            </IconsContainer>
          )}
        </BottomContainer>
      </SubContainer>
    </MainContainer>
  )
}
