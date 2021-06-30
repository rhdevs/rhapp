import React, { useState } from 'react'

import styled from 'styled-components'
import { V1_RED } from '../../common/colours'
import editIcon from '../../assets/RedSupperEditIcon.svg'

import { CancelAction, Food } from '../../store/supper/types'
import { PATHS } from '../../routes/Routes'
import { useHistory } from 'react-router-dom'
import { Skeleton } from '../Skeleton'

const Background = styled.div<{
  backgroundColor?: string
  hasFoodName?: boolean
  margin?: string
  padding?: string
  hasNoQuantity?: boolean | undefined
  borderRadius?: string
}>`
  display: grid;
  grid-template-columns: ${(props) => (props.hasNoQuantity ? '' : '10%')} auto auto;
  grid-template-rows: max-content;
  ${(props) =>
    props.hasFoodName
      ? `grid-template-areas: "${props.hasNoQuantity ? '' : `quantity`} name price"  "${
          props.hasNoQuantity ? '' : `.`
        } main icon";`
      : `grid-template-areas: "${props.hasNoQuantity ? '' : `quantity`} main price"  "${
          props.hasNoQuantity ? '' : `.`
        } main icon";`}
  gap: 0px 10px;
  justify-items: stretch;
  margin: ${(props) => props.margin ?? '10px'};
  ${(props) => props.padding && `padding: ${props.padding};`}
  align-items: baseline;
  ${(props) => props.backgroundColor && `background: ${props.backgroundColor};`}
  ${(props) => props.borderRadius && `border-radius: ${props.borderRadius};`}
`

const QuantityContainer = styled.div`
  grid-area: quantity;
  justify-self: end;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: ${V1_RED};
`

const FoodNameContainer = styled.div`
  grid-area: name;
  justify-items: stretch;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
`

const PriceContainer = styled.div`
  grid-area: price;
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 14px;
  justify-self: end;
  padding-right: 5px;
`

const MainContainer = styled.div`
  grid-area: main;
  display: flex;
  flex-direction: column;
`

const IconContainer = styled.div<{ wasEdited?: boolean }>`
  grid-area: icon;
  ${(props) => props.wasEdited && 'margin: auto 0;'}
  justify-self: end;
  padding-right: 5px;
`

const Icon = styled.img`
  padding: 3px 0px 0px 7px;
  font-size: 20px;
  color: ${V1_RED};
`

const StyledText = styled.text<{ color?: string }>`
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 15px;
  color: ${(props) => props.color ?? 'black'};
`

const BoldText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 15px;
`

const ExtraTextContainer = styled.text`
  line-height: normal;
`

const StyledEditedText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  color: ${V1_RED};
`

type Props = {
  backgroundColor?: string
  borderRadius?: string
  margin?: string
  padding?: string
  supperGroupId?: number
  orderId?: string
  foodId?: string
  food?: Food
  quantity?: number
  foodName?: string
  foodPrice?: number
  customisations?: string[]
  comments?: string
  cancelAction?: CancelAction
  isCancelActionClickable?: boolean
  cancelActionModalSetter?: React.Dispatch<React.SetStateAction<boolean>>
  isEditable?: boolean
  onEditClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  wasEdited?: boolean
  wasEditedModalSetter?: React.Dispatch<React.SetStateAction<boolean>>
}
export const FoodLine = (props: Props) => {
  const isLoading = props.food || (props.foodPrice && props.cancelAction) ? false : true
  const [hasError, setHasError] = useState<boolean>(false)
  setTimeout(() => {
    if (isLoading) {
      setHasError(true)
    }
  }, 10000)
  const history = useHistory()
  const foodId = props.food?.foodId ?? props.foodId
  const quantity = props.food?.quantity ?? props.quantity
  const foodName = props.food?.foodName ?? props.foodName
  const hasFoodName = foodName ? true : false
  const price = `$${(props.food?.foodPrice ?? props.foodPrice ?? 0).toFixed(2)}`
  const customisations = props.customisations ?? []
  props.food?.custom?.map((custom) =>
    custom.options.map((option) => {
      if (option.isSelected) customisations.push(option.name)
    }),
  )
  const comments = props.food?.comments ?? props.comments
  const cancelAction = props.food?.cancelAction ?? props.cancelAction

  const onEditClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (props.onEditClick) {
      return props.onEditClick(e)
    } else {
      history.push(`${PATHS.EDIT_FOOD_ITEM}/${props.supperGroupId}/order/${props.orderId}/food/${foodId}`)
    }
  }
  const onCancelActionClick = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (props.cancelActionModalSetter) {
      props.cancelActionModalSetter(true)
    }
  }

  const onOwnerEditClick = () => {
    if (props.wasEditedModalSetter) props.wasEditedModalSetter(true)
  }
  return (
    <>
      {!hasError && (
        <Background
          borderRadius={props.borderRadius}
          backgroundColor={props.backgroundColor}
          hasNoQuantity={quantity ? false : true}
          margin={props.margin}
          padding={props.padding}
          hasFoodName={hasFoodName}
        >
          {quantity && <QuantityContainer>{isLoading ? <Skeleton width="25px" /> : `${quantity}x`}</QuantityContainer>}
          {foodName && (
            <FoodNameContainer>{isLoading ? <Skeleton height="14px" width="150px" /> : foodName}</FoodNameContainer>
          )}
          <PriceContainer>{isLoading ? <Skeleton width="35px" /> : price}</PriceContainer>
          <MainContainer>
            {isLoading ? (
              <Skeleton width="200px" height="50px" />
            ) : (
              <>
                {customisations?.map((custom, index) => {
                  return <StyledText key={index}>{custom}</StyledText>
                })}
                {comments && (
                  <ExtraTextContainer>
                    <BoldText>Comments: </BoldText>
                    <StyledText>{comments}</StyledText>
                  </ExtraTextContainer>
                )}
                <ExtraTextContainer>
                  <BoldText>If unavailable: </BoldText>
                  <StyledText onClick={onCancelActionClick} color={props.isCancelActionClickable ? V1_RED : 'black'}>
                    {cancelAction}
                  </StyledText>
                </ExtraTextContainer>
              </>
            )}
          </MainContainer>
          {!isLoading && (props.isEditable || props.wasEdited) && (
            <IconContainer wasEdited={props.wasEdited}>
              {props.isEditable ? (
                <Icon onClick={onEditClick} src={editIcon} alt="Edit Icon" />
              ) : (
                <StyledEditedText onClick={onOwnerEditClick}>(edited)</StyledEditedText>
              )}
            </IconContainer>
          )}
        </Background>
      )}
    </>
  )
}
