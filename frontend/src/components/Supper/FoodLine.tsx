import React, { useEffect, useState } from 'react'

import styled from 'styled-components'
import { V1_RED } from '../../common/colours'
import editIcon from '../../assets/RedSupperEditIcon.svg'

import { CancelAction, Food, UpdateAction, Updates } from '../../store/supper/types'
import { PATHS } from '../../routes/Routes'
import { useHistory } from 'react-router-dom'
import { Skeleton } from '../Skeleton'
import { onRefresh } from '../../common/reloadPage'
import { useDispatch, useSelector } from 'react-redux'
import { setIsLoading } from '../../store/supper/action'
import { RootState } from '../../store/types'

const Background = styled.div<{
  backgroundColor?: string
  hasFoodName?: boolean
  margin?: string
  padding?: string
  hasNoQuantity?: boolean | undefined
  borderRadius?: string
}>`
  display: grid;
  grid-template-columns: ${(props) => (props.hasNoQuantity ? '' : '5%')} auto auto;
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

const PriceContainer = styled.div<{ color?: string }>`
  grid-area: price;
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 14px;
  justify-self: end;
  padding-right: 5px;
  color: ${(props) => props.color};
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
  font-weight: 200;
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

const ErrorText = styled.text`
  text-align: center;
  color: ${V1_RED};
  font-family: 'Inter';
`

type Props = {
  backgroundColor?: string
  borderRadius?: string
  margin?: string
  padding?: string
  // Required parameters for editing
  supperGroupId?: number
  orderId?: string
  // Food details parameters
  food?: Food
  hasNoQuantity?: boolean
  foodId?: string
  quantity?: number
  foodName?: string
  foodPrice?: number
  customisations?: string[]
  comments?: string
  cancelAction?: CancelAction
  updates?: Updates
  // Actions
  showError?: boolean
  isCancelActionClickable?: boolean
  cancelActionOnClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  cancelActionModalSetter?: React.Dispatch<React.SetStateAction<boolean>>
  isEditable?: boolean
  onEditClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  wasEdited?: boolean
}
export const FoodLine = (props: Props) => {
  const dispatch = useDispatch()
  const { isLoading } = useSelector((state: RootState) => state.supper)

  useEffect(() => {
    if (props.food || (props.foodPrice && props.cancelAction)) {
      dispatch(setIsLoading(false))
    } else {
      dispatch(setIsLoading(true))
    }
  }, [props.food, props.foodPrice, props.cancelAction])

  const [hasError, setHasError] = useState<boolean>(false)

  setTimeout(() => {
    if (isLoading) {
      setHasError(true)
    }
  }, 10000)

  const history = useHistory()
  const foodId = props.food?.foodId ?? props.foodId
  const quantity = props.food?.quantity ?? props.quantity
  let hasNoQuantity = props.hasNoQuantity
  if (hasNoQuantity === undefined) hasNoQuantity = quantity ? false : true
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
  const updates = props.food?.updates ?? props.updates
  // const wasEdited = props.wasEdited ?? updates ? true : false

  const onEditClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (props.onEditClick) {
      return props.onEditClick(e)
    } else {
      history.push(`${PATHS.EDIT_FOOD_ITEM}/${props.supperGroupId}/order/${props.orderId}/food/${foodId}`)
    }
  }

  const onCancelActionClick = (e, cancelAction?: CancelAction) => {
    e.preventDefault()
    if (cancelAction === CancelAction.CONTACT) {
      if (props.cancelActionModalSetter) {
        props.cancelActionModalSetter(true)
      } else if (props.cancelActionOnClick) {
        props.cancelActionOnClick(e)
      }
    }
  }

  const content = () => {
    const wasEdited = props.wasEdited ?? updates ? true : false
    if (hasError) {
      if (props.showError) {
        return (
          <>
            <ErrorText>
              Food not found.. We think meowmeow ate it! Try <u onClick={onRefresh}>reloading</u> or
              <u onClick={() => history.goBack()}> go back</u>.
            </ErrorText>
          </>
        )
      } else {
        return <></>
      }
    } else {
      let priceValue = price
      console.log(updates, wasEdited)
      if (updates?.updateAction === UpdateAction.REMOVE) {
        priceValue = '$0.00'
      }
      if (updates?.updateAction === UpdateAction.UPDATE) {
        console.log(priceValue)
        priceValue = `$${(updates.updatedPrice ?? 0).toFixed(2)}`
      }
      return (
        <>
          {quantity && !hasNoQuantity && (
            <QuantityContainer>{isLoading ? <Skeleton width="25px" /> : `${quantity}x`}</QuantityContainer>
          )}
          {foodName && (
            <FoodNameContainer>{isLoading ? <Skeleton height="14px" width="150px" /> : foodName}</FoodNameContainer>
          )}
          <PriceContainer color={wasEdited ? V1_RED : 'black'}>
            {isLoading ? <Skeleton width="35px" /> : priceValue}
          </PriceContainer>
          <MainContainer>
            {isLoading ? (
              <Skeleton width="200px" height="50px" />
            ) : wasEdited ? (
              <>
                {updates?.change && <StyledText color={V1_RED}>Change: {updates?.change}</StyledText>}
                <StyledText color={V1_RED}>Reason: {updates?.reason ?? '-'}</StyledText>
              </>
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
                  <StyledText
                    onClick={(e) => onCancelActionClick(e, cancelAction)}
                    color={props.isCancelActionClickable && cancelAction === CancelAction.CONTACT ? V1_RED : 'black'}
                  >
                    {cancelAction}
                  </StyledText>
                </ExtraTextContainer>
              </>
            )}
          </MainContainer>
          {!isLoading && (props.isEditable || wasEdited) && (
            <IconContainer wasEdited={wasEdited}>
              {props.isEditable ? (
                <Icon onClick={onEditClick} src={editIcon} alt="Edit Icon" />
              ) : (
                <StyledEditedText>
                  {updates?.updateAction === UpdateAction.UPDATE
                    ? `(edited)`
                    : updates?.updateAction === UpdateAction.REMOVE
                    ? `(not avail)`
                    : ''}
                </StyledEditedText>
              )}
            </IconContainer>
          )}
        </>
      )
    }
  }
  return (
    <Background
      borderRadius={props.borderRadius}
      backgroundColor={props.backgroundColor}
      hasNoQuantity={hasNoQuantity}
      margin={props.margin}
      padding={props.padding}
      hasFoodName={hasFoodName}
    >
      {content()}
    </Background>
  )
}
