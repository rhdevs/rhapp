import React, { useEffect } from 'react'

import styled from 'styled-components'
import { foodList } from '../../store/stubs'
import { Food } from '../../store/supper/types'
import Button from '../Mobile/Button'
import { FoodLineInCard } from './FoodLineInCard'
import { LeftOutlined } from '@ant-design/icons'
import { V1_BACKGROUND } from '../../common/colours'
import { useHistory } from 'react-router-dom'
import { PATHS } from '../../routes/Routes'

const OverlayBackground = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999;
`

const MainCard = styled.div`
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

const HeaderText = styled.text`
  font-weight: 700;
  font-size: 24px;
  color: black;
  font-family: Inter;
`

const SubHeaderContainer = styled.div`
  padding: 2px 0px 0px 22px;
`

const SubHeaderText = styled.text`
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 14px;
  color: black;
`

const CustomCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 5px 5px;
  margin: 5px 8px 15px 8px;
  background: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  width: 94%;
  height: 50%;
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

const NoResultsText = styled.text`
  font-size: 14px;
  text-align: center;
`

type Props = {
  foodList: Food[]
  foodId: string | undefined
  menuFoodName: string | undefined
  supperGroupId: number | undefined
  orderId: string | undefined
  onBackClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const ViewMenuFoodCard = (props: Props) => {
  const foodName = foodList.find((food) => food.foodId === props.foodId)?.foodName
  const filteredFoodList = props.foodList.filter((food) => food.foodId === props.foodId)
  const history = useHistory()

  useEffect(() => {
    if (filteredFoodList.length === 1) {
      history.push(`${PATHS.EDIT_FOOD_ITEM}/${props.supperGroupId}/order/${props.orderId}/food/${props.foodId}`)
    }
  }, [filteredFoodList])

  const BackButton = () => {
    return (
      <LeftOutlined style={{ color: 'black', padding: '5px 15px 0 0', margin: 'auto 0' }} onClick={props.onBackClick} />
    )
  }

  const addButton = (isFirstFood?: boolean) => {
    return (
      <ButtonContainer>
        <Button
          onButtonClick={() =>
            history.push(`${PATHS.ADD_FOOD_ITEM}/${props.supperGroupId}/order/${props.orderId}/add/${props.foodId}`)
          }
          defaultButtonDescription={isFirstFood ? 'Add Food' : 'Add Another'}
          stopPropagation={true}
          isFlipButton={false}
        />
      </ButtonContainer>
    )
  }

  return (
    <OverlayBackground>
      <MainCard>
        {foodName && filteredFoodList.length > 1 ? (
          <>
            <Header>
              <BackButton />
              <HeaderText>{foodName}</HeaderText>
            </Header>
            <SubHeaderContainer>
              <SubHeaderText>In Your Cart</SubHeaderText>
            </SubHeaderContainer>
            <CustomCard>
              {filteredFoodList.map((food, index) => {
                const customisations: string[] = []
                food.custom?.map((custom) =>
                  custom.options.map((option) => {
                    if (option.isSelected) customisations.push(option.name)
                  }),
                )
                return (
                  <FoodLineInCard
                    isEditable
                    supperGroupId={props.supperGroupId}
                    orderId={props.orderId}
                    foodId={food.foodId}
                    key={index}
                    foodName={food.foodName}
                    fontPercentage={0.85}
                    qty={food.quantity}
                    price={food.foodPrice}
                    customisations={customisations}
                    comments={food?.comments}
                    cancelAction={food.cancelAction}
                  />
                )
              })}
            </CustomCard>
            {addButton()}
          </>
        ) : (
          <>
            <Header>
              <BackButton />
              <HeaderText>{props.menuFoodName}</HeaderText>
            </Header>
            <CustomCard>
              <NoResultsContainer>
                <NoResultsText>
                  {/* TODO: Update error message? */}
                  Oops we misread your order! <br />
                  Click back to close
                  {props.supperGroupId &&
                    props.orderId &&
                    props.foodId &&
                    ' or the button below to add food into cart!'}
                </NoResultsText>
              </NoResultsContainer>
            </CustomCard>
            {props.supperGroupId && props.orderId && props.foodId && addButton(true)}
          </>
        )}
      </MainCard>
    </OverlayBackground>
  )
}
