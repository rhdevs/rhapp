import React from 'react'

import styled from 'styled-components'
import editIcon from '../../assets/SupperEditIcon.svg'
import deleteIcon from '../../assets/SupperDeleteIcon.svg'

const MainContainer = styled.div`
  height: fit-content;
  position: relative;
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: row;
`

const QuantityContainer = styled.div`
  width: 10%;
  font-size: 17px;
  line-height: 22px;
`

const SubContainer = styled.div`
  width: 90%;
`

const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const TitleText = styled.text`
  font-size: 17px;
  line-height: 22px;
`

const MoneyText = styled.text`
  font-size: 14px;
  line-height: 14px;
  margin: auto;
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

const CustomText = styled.text`
  font-size: 14px;
  line-height: 14px;
  font-weight: 200;
`

const IconsContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: fit-content;
`

const Icon = styled.img`
  padding: 7px 7px 0 7px;
`

type Props = {
  foodName: string
  qty: number
  price?: number
  customisations?: string[]
  isEditable?: boolean
  comments?: string
  onEditClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onDeleteClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const FoodLineInCard = (props: Props) => {
  return (
    <MainContainer>
      <QuantityContainer>{props.qty}x</QuantityContainer>
      <SubContainer>
        <TopContainer>
          <TitleText>{props.foodName}</TitleText>
          <MoneyText>${props.price?.toFixed(2)}</MoneyText>
        </TopContainer>
        <BottomContainer>
          <CustomisationContainer>
            {props.customisations?.map((custom, index) => {
              return <CustomText key={index}>{custom}</CustomText>
            })}
            {props.comments && (
              <>
                Comments: <CustomText>{props.comments}</CustomText>
              </>
            )}
          </CustomisationContainer>

          {props.isEditable && (
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
