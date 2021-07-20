import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

import styled from 'styled-components'
import { V1_BACKGROUND } from '../../../common/colours'
import LoadingSpin from '../../../components/LoadingSpin'
import SearchBar from '../../../components/Mobile/SearchBar'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { SupperGroupCard } from '../../../components/Supper/SupperGroupCard'
import { ViewMenuFoodModal } from '../../../components/Supper/ViewMenuFoodModal'
import { MenuSection } from '../../../components/Supper/MenuSection'
import { MenuTabs } from '../../../components/Supper/MenuTabs'
import { ViewCartButton } from '../../../components/Supper/ViewCartButton'
import {
  getRestaurant,
  getSupperGroupById,
  getUserOrder,
  getReadableSupperGroupId,
  setOrderId,
  setSearchValue,
  unixTo12HourTime,
  setIsFoodMenuModalOpen,
  setFoodModalInfo,
  updateOrderDetails,
} from '../../../store/supper/action'
import { RootState } from '../../../store/types'
import { PATHS } from '../../Routes'
import { supper } from '../../../store/supper/reducer'

const Background = styled.div`
  width: 100vw;
  background: ${V1_BACKGROUND};
  position: relative;
  min-height: 100vh;
  height: 100%;
  padding-bottom: 1rem;
`

const SearchBarContainer = styled.div`
  margin: 0 20px 8px 20px;
`

const StickyContainer = styled.div`
  position: sticky;
  left: 0;
  top: 4.4rem;
  background: ${V1_BACKGROUND};
`

const Restaurant = styled.text`
  font-weight: 700;
  font-size: 24px;
  margin-left: 5px;
`

export default function PlaceOrder() {
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams<{ supperGroupId: string; restaurantId: string }>()
  const {
    supperGroup,
    restaurant,
    isLoading,
    searchValue,
    orderId,
    order,
    foodMenuModalId,
    isFoodMenuModalOpen,
    modalMenuFoodName,
  } = useSelector((state: RootState) => state.supper)
  const isOwner = localStorage.userID === supperGroup?.ownerId

  useEffect(() => {
    dispatch(getSupperGroupById(params.supperGroupId))
    dispatch(getRestaurant(params.restaurantId))
    dispatch(getUserOrder(params.supperGroupId, localStorage.userID))
    if (order) {
      dispatch(setOrderId(order.orderId))
    }
  }, [dispatch, order])

  const onChange = (input: string) => {
    dispatch(setSearchValue(input))
  }

  const numberOfItems = () => {
    let quantity = 0
    order?.foodList.forEach((food) => {
      quantity += food.quantity
    })
    return quantity
  }

  return (
    <Background>
      <TopNavBar title="Order" />
      {isLoading || restaurant == undefined ? (
        <LoadingSpin />
      ) : (
        <>
          {isFoodMenuModalOpen && (
            <ViewMenuFoodModal
              orderId={orderId ?? order?.orderId}
              supperGroupId={Number(params.supperGroupId)}
              foodList={order?.foodList}
              foodMenuId={foodMenuModalId}
              menuFoodName={modalMenuFoodName}
              viewMenuFoodModalSetter={setIsFoodMenuModalOpen}
            />
          )}
          <SupperGroupCard isHome={false} supperGroup={supperGroup} />
          <SearchBarContainer>
            <StickyContainer>
              <Restaurant>{restaurant?.name ?? '-'}</Restaurant>
              <SearchBar placeholder="Search for food" value={searchValue} onChange={onChange} />
              {searchValue === '' && <MenuTabs menuSections={restaurant?.allSection} />}
            </StickyContainer>
            <MenuSection
              supperGroupId={supperGroup?.supperGroupId}
              orderId={orderId ?? order?.orderId}
              order={order}
              menu={
                searchValue === ''
                  ? restaurant?.menu
                  : restaurant?.menu.filter((food) =>
                      food.foodMenuName.toLowerCase().includes(searchValue.toLowerCase()),
                    )
              }
            />
          </SearchBarContainer>
          {order?.foodList.length ? (
            <>
              <br />
              <br />
              {isOwner ? (
                <ViewCartButton
                  numberOfItems={numberOfItems()}
                  currentTotal={order?.totalCost}
                  onClick={() => {
                    history.push(`${PATHS.VIEW_ORDER}/${params.supperGroupId}`)
                  }}
                />
              ) : (
                <ViewCartButton
                  numberOfItems={numberOfItems()}
                  currentTotal={order?.totalCost}
                  onClick={() => history.push(`${PATHS.VIEW_CART}/${params.supperGroupId}`)}
                />
              )}
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </Background>
  )
}
