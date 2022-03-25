import React from 'react'

import styled from 'styled-components'
import { Food } from '../../../store/supper/types'
import Button from '../../Mobile/Button'
import LeftOutlined from '@ant-design/icons/lib/icons/LeftOutlined'
import { V1_BACKGROUND } from '../../../common/colours'
import { useHistory } from 'react-router-dom'
import { PATHS } from '../../../routes/Routes'
import { MainCard } from '../MainCard'
import { useDispatch } from 'react-redux'
import { FoodLine } from '../FoodLine'

const OverlayBackground = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999;
`

const ModalCard = styled.div`
  display: flex;
  background: ${V1_BACKGROUND};
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
  padding: 5px 10px;
  position: absolute;
  left: 4.27%;
  right: 3.47%;
  top: 18.18%;
  z-index: 1000;
  border-radius: 20px;
  max-width: 300px;
  min-height: 250px;
  box-shadow: 0px 4px 4px 4px rgba(0.1, 0.1, 0.1, 0.1);
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  padding: 15px 15px;
`

const HeaderText = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 21px;
  color: black;
  font-family: Inter;
`

const SubHeaderContainer = styled.div`
  padding: 2px 0px 0px 22px;
`

const SubHeaderText = styled.p`
  margin: 0;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 14px;
  color: black;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px 0px 15px 0px;
`

const NoResultsContainer = styled.div`
  padding: 15px 20px;
  display: flex;
  justify-content: center;
`

const NoResultsText = styled.p`
  margin: 0;
  font-size: 14px;
  text-align: center;
`

type Props = {
  foodList: Food[] | undefined
  foodMenuId: string | undefined
  menuFoodName: string | undefined
  supperGroupId: number | undefined
  orderId: string | undefined
  viewMenuFoodModalSetter: React.Dispatch<boolean>
}

export const ViewMenuFoodModal = (props: Props) => {
  const foodName = props.foodList?.find((food) => food.foodMenuId === props.foodMenuId)?.foodName
  const filteredFoodList = props.foodList?.filter((food) => food.foodMenuId === props.foodMenuId) ?? []
  const history = useHistory()
  const dispatch = useDispatch()

  const onBackClick = () => {
    dispatch(props.viewMenuFoodModalSetter(false))
  }

  const BackButton = () => {
    return <LeftOutlined style={{ color: 'black', padding: '5px 15px 0 0', margin: 'auto 0' }} onClick={onBackClick} />
  }

  const addButton = (isFirstFood?: boolean) => {
    return (
      <ButtonContainer>
        <Button
          onButtonClick={() => {
            dispatch(props.viewMenuFoodModalSetter(false))
            history.push(`${PATHS.ADD_FOOD_ITEM}/${props.supperGroupId}/order/${props.orderId}/add/${props.foodMenuId}`)
          }}
          defaultButtonDescription={isFirstFood ? 'Add Food' : 'Add Another'}
          stopPropagation={true}
          isFlipButton={false}
        />
      </ButtonContainer>
    )
  }

  return (
    <OverlayBackground>
      <ModalCard>
        {foodName && filteredFoodList.length >= 1 ? (
          <>
            <Header>
              <BackButton />
              <HeaderText>{foodName}</HeaderText>
            </Header>
            <SubHeaderContainer>
              <SubHeaderText>In Your Cart</SubHeaderText>
            </SubHeaderContainer>
            <MainCard flexDirection="column" margin="5px 8px 15px 8px" padding="inherit">
              {filteredFoodList.map((food, index) => {
                const customisations: string[] = []
                food.custom?.map((custom) =>
                  custom.options.map((option) => {
                    if (option.isSelected) customisations.push(option.name)
                  }),
                )
                return (
                  <FoodLine
                    key={index}
                    food={food}
                    isEditable
                    supperGroupId={props.supperGroupId}
                    orderId={props.orderId}
                    onEditClick={() => {
                      dispatch(props.viewMenuFoodModalSetter(false))
                      history.push(
                        `${PATHS.EDIT_FOOD_ITEM}/${props.supperGroupId}/order/${props.orderId}/food/${food.foodId}`,
                      )
                    }}
                  />
                )
              })}
            </MainCard>
            {addButton()}
          </>
        ) : (
          <>
            <Header>
              <BackButton />
              <HeaderText>{props.menuFoodName}</HeaderText>
            </Header>
            <MainCard flexDirection="column" margin="5px 8px 15px 8px" padding="5px">
              <NoResultsContainer>
                <NoResultsText>
                  {/* TODO: Update error message? */}
                  Oops we misread your order! <br />
                  Click back to close
                  {props.supperGroupId &&
                    props.orderId &&
                    props.foodMenuId &&
                    ' or the button below to add food into cart!'}
                </NoResultsText>
              </NoResultsContainer>
            </MainCard>
            {props.supperGroupId && props.orderId && props.foodMenuId && addButton(true)}
          </>
        )}
      </ModalCard>
    </OverlayBackground>
  )
}
