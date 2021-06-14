import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { PATHS } from '../../routes/Routes'
import { FoodMenu, Order } from '../../store/supper/types'
import { RootState } from '../../store/types'

const MainContainer = styled.div`
  background-color: white;
  margin: 20px 0;
`

const SectionHeaderContainer = styled.div`
  padding: 8px 20px 0px 20px;
`

const SectionHeader = styled.text`
  font-size: 24px;
  font-weight: 700;
`

const SectionBodyContainer = styled.div`
  padding: 15px;
`

const FoodMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const FoodAndQuantityContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0;
`

const FoodContainer = styled.text`
  margin: 5px 2px 5px 5px;
  font-size: 17px;
  font-weight: 700;
`

const QuantityContainer = styled.text`
  margin: 5px;
  color: #de5f4c;
  font-size: 17px;
  font-weight: 600;
`
const PriceContainer = styled.text`
  margin: 0 0 3px 5px;
  font-size: 14px;
  font-weight: 200;
`
const EmptyContainer = styled.div`
  display: flex;
  justify-content: space-around;
`

const EmptyCOntainerText = styled.text`
  margin: 5px 2px 5px 5px;
  font-size: 15px;
  font-weight: 500;
`

type Props = {
  menu?: FoodMenu[] | undefined
  order?: Order
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  supperGroupId?: string | undefined
  orderId?: string | undefined
}

export const MenuSection = (props: Props) => {
  let QUANTITY
  const { menuTabKey } = useSelector((state: RootState) => state.supper)
  const history = useHistory()

  return (
    <MainContainer>
      <SectionHeaderContainer>
        <SectionHeader>{menuTabKey}</SectionHeader>
      </SectionHeaderContainer>
      <SectionBodyContainer>
        <FoodMenuContainer>
          {props.menu ? (
            props.menu
              .filter((foodMenu) => foodMenu.section === menuTabKey || menuTabKey === 'All')
              .map((foodMenu) => (
                <>
                  <FoodAndQuantityContainer
                    // TODO: UPDATE ORDERID!
                    onClick={() =>
                      history.push(
                        `${PATHS.ADD_FOOD_ITEM}/${props.supperGroupId}/order/${props.orderId}/add/${foodMenu.foodMenuId}`,
                      )
                    }
                  >
                    <FoodContainer>{foodMenu.foodMenuName}</FoodContainer>
                    {
                      (QUANTITY = props.order?.foodList?.find((food) => {
                        if (food.foodMenuId === foodMenu.foodMenuId) {
                          return String(food.quantity)
                        }
                      }))
                    }
                    <QuantityContainer>{QUANTITY}</QuantityContainer>
                  </FoodAndQuantityContainer>
                  <PriceContainer>${foodMenu.price.toFixed(2)}</PriceContainer>
                </>
              ))
          ) : (
            <EmptyContainer>
              <EmptyCOntainerText>Menu is currently empty.</EmptyCOntainerText>
            </EmptyContainer>
          )}
        </FoodMenuContainer>
      </SectionBodyContainer>
    </MainContainer>
  )
}
