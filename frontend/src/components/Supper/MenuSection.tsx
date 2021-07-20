import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { PATHS } from '../../routes/Routes'
import { FoodMenu, Order } from '../../store/supper/types'
import { setIsFoodMenuModalOpen, setFoodModalInfo } from '../../store/supper/action'
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

const FoodMainContainer = styled.div<{ noBottomBorder?: boolean }>`
  ${(props) => !(props.noBottomBorder ?? false) && 'border-bottom: 1px rgba(0,0,0,0.15) solid;'}
  padding-bottom: 1px;
  min-height: 4rem;
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

const EmptyContainerText = styled.text`
  margin: 5px 2px 5px 5px;
  font-size: 15px;
  font-weight: 500;
`

type Props = {
  menu?: FoodMenu[] | undefined
  order?: Order | null
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  supperGroupId?: string | undefined | number
  orderId?: string | undefined
}

export const MenuSection = (props: Props) => {
  const { menuTabKey, searchValue } = useSelector((state: RootState) => state.supper)
  const history = useHistory()
  const dispatch = useDispatch()

  const menuItems = () => {
    if (props.menu) {
      if (searchValue !== '' && props.menu.length === 0) {
        return (
          <EmptyContainer>
            {/* escape character for ' */}
            <EmptyContainerText>No results for &#39;{searchValue}&#39;.</EmptyContainerText>
          </EmptyContainer>
        )
      }
      const selectedMenuItems: FoodMenu[] = props.menu.filter(
        (foodMenu) => foodMenu.section === menuTabKey || menuTabKey === 'All',
      )
      return selectedMenuItems.length ? (
        selectedMenuItems.map((foodMenu, index) => {
          const QUANTITY = props.order?.foodList?.find((food) => food.foodMenuId === foodMenu.foodMenuId)?.quantity
          return (
            <FoodMainContainer key={index} noBottomBorder={index + 1 === selectedMenuItems?.length}>
              <FoodAndQuantityContainer
                onClick={() => {
                  if (!props.supperGroupId || !props.orderId || !foodMenu.foodMenuId) return
                  if (QUANTITY && QUANTITY > 0) {
                    dispatch(setFoodModalInfo(foodMenu.foodMenuId, foodMenu.foodMenuName))
                    dispatch(setIsFoodMenuModalOpen(true))
                  } else {
                    history.push(
                      `${PATHS.ADD_FOOD_ITEM}/${String(props.supperGroupId)}/order/${props.orderId}/add/${
                        foodMenu.foodMenuId
                      }`,
                    )
                  }
                }}
              >
                <FoodContainer>{foodMenu.foodMenuName}</FoodContainer>
                <QuantityContainer>{QUANTITY && `x${QUANTITY}`}</QuantityContainer>
              </FoodAndQuantityContainer>
              <PriceContainer>${foodMenu.price.toFixed(2)}</PriceContainer>
            </FoodMainContainer>
          )
        })
      ) : (
        <EmptyContainer>
          <EmptyContainerText>Oops! There are no items in this section.</EmptyContainerText>
        </EmptyContainer>
      )
    } else {
      return (
        <EmptyContainer>
          <EmptyContainerText>Menu is currently empty.</EmptyContainerText>
        </EmptyContainer>
      )
    }
  }

  return (
    <MainContainer>
      <SectionHeaderContainer>
        <SectionHeader>{searchValue === '' ? menuTabKey : `Results for '${searchValue}'`}</SectionHeader>
      </SectionHeaderContainer>
      <SectionBodyContainer>
        <FoodMenuContainer>{menuItems()}</FoodMenuContainer>
      </SectionBodyContainer>
    </MainContainer>
  )
}
