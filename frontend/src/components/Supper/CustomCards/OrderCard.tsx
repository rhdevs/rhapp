import React, { useState } from 'react'

import styled from 'styled-components'
import { MainCard } from '../MainCard'
import { UnderlinedButton } from '../UnderlinedButton'
import EmptyCart_src from '../../../assets/EmptyCart.svg'
import { CollatedOrder, Food, SupperGroupStatus } from '../../../store/supper/types'
import { PlusCircleFilled } from '@ant-design/icons'
import { V1_RED } from '../../../common/colours'
import { useHistory } from 'react-router-dom'
import { PATHS } from '../../../routes/Routes'
import useSnackbar from '../../../hooks/useSnackbar'
import { FoodLine } from '../FoodLine'
import { Tabs } from '../../Tabs'

const CardHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`

const EmptyCartContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: auto;
  font-size: 17px;
  font-family: 'Inter';
  padding: 1rem 0;
`

const EmptyCartImg = styled.img`
  height: 61px;
  width: 55px;
`

const EmptyTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 auto;
  justify-content: center;
  font-size: 12px;
`

const MyOrderText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 15px;
  display: flex;
  align-items: center;
`

type Props = {
  ownerId?: string
  supperGroupStatus: SupperGroupStatus | undefined
  foodList?: Food[]
  isEditable?: boolean
  wasEdited?: boolean
  supperGroupId?: number | undefined
  orderId?: string | undefined
  collatedOrder?: CollatedOrder
}

export const OrderCard = (props: Props) => {
  const history = useHistory()
  const [isCancelActionModalOpen, setIsCancelActionModalOpen] = useState<boolean>(false)
  const [isEditedModalOpen, setIsEditedModalOpen] = useState<boolean>(false)

  const isFoodListEmpty = ((props.foodList?.length ?? 0) <= 0) as boolean
  const isEditable = props.isEditable
  const supperGroupId = props.supperGroupId
  const orderId = props.orderId
  const isOwner = localStorage.userID === props.ownerId
  const canEditUserFood =
    isOwner &&
    props.supperGroupStatus !== SupperGroupStatus.OPEN &&
    props.supperGroupStatus !== SupperGroupStatus.PENDING

  // const priceSection = () => {

  // }
  const EmptyCart = () => {
    return (
      <EmptyCartContainer>
        <EmptyCartImg alt="Empty Cart" src={EmptyCart_src} />
      </EmptyCartContainer>
    )
  }
  //TODO: Add was edited modal
  const wasEditedModal = <></>
  //TODO: Add cancel action modal
  const cancelActionModal = <></>

  const onEditClick = (foodId: string | undefined) => {
    if (!foodId) {
      const [error] = useSnackbar('error')
      error('meowmeow is in a bad mood.. try again later!')
      return
    }
    if (canEditUserFood) {
      //TODO: Add owner edit user's order modal
    } else {
      history.push(`${PATHS.EDIT_FOOD_ITEM}/${supperGroupId}/order/${orderId}/food/${foodId}`)
    }
  }

  const userViewFoodContent = () => (
    <>
      {isFoodListEmpty ? (
        <>
          <EmptyCart />
          <EmptyTextContainer>
            Cart is empty. <UnderlinedButton text="Add item" fontSize="12px" color="red" />
          </EmptyTextContainer>
        </>
      ) : (
        <>
          {props.foodList?.map((food, index) => {
            const customisations: string[] = []
            food.custom?.map((custom) =>
              custom.options.map((option) => {
                if (option.isSelected) customisations.push(option.name)
              }),
            )
            return (
              <FoodLine
                key={index}
                margin="5px 0"
                isEditable={props.isEditable}
                onEditClick={() => onEditClick(food.foodId)}
                wasEdited={props.wasEdited}
                wasEditedModalSetter={setIsEditedModalOpen}
                isCancelActionClickable={isOwner}
                cancelActionModalSetter={setIsCancelActionModalOpen}
                food={food}
                supperGroupId={supperGroupId}
                orderId={orderId}
              />
            )
          })}
        </>
      )}
    </>
  )

  const collatedFoodContent = () => <></>

  return (
    <MainCard padding="20px" flexDirection="column">
      <>
        {isEditedModalOpen && wasEditedModal}
        {isCancelActionModalOpen && cancelActionModal}
      </>
      {isOwner ? (
        <Tabs valueNamesArr={['User', 'Food']} childrenArr={[userViewFoodContent(), collatedFoodContent()]} />
      ) : (
        <>
          <CardHeaderContainer>
            <MyOrderText>My Order</MyOrderText>
            {isEditable && <PlusCircleFilled style={{ fontSize: '20px', color: V1_RED }} />}
          </CardHeaderContainer>
          {userViewFoodContent()}
        </>
      )}
    </MainCard>
  )
}
