import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

import styled from 'styled-components'
import { V1_BACKGROUND } from '../../../common/colours'
import LoadingSpin from '../../../components/LoadingSpin'
import SearchBar from '../../../components/Mobile/SearchBar'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { ExpandableSGCard } from '../../../components/Supper/CustomCards/ExpandableSGCard'
import { MenuSection } from '../../../components/Supper/MenuSection'
import { MenuTabs } from '../../../components/Supper/MenuTabs'
import { ViewCartButton } from '../../../components/Supper/ViewCartButton'
import {
  getRestaurant,
  getSupperGroupById,
  getUserOrder,
  readableSupperGroupId,
  setOrderId,
  setSearchValue,
  unixTo12HourTime,
} from '../../../store/supper/action'
import { RootState } from '../../../store/types'
import { PATHS } from '../../Routes'

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
  const { supperGroup, restaurant, isLoading, searchValue, orderId, order } = useSelector(
    (state: RootState) => state.supper,
  )

  useEffect(() => {
    dispatch(getSupperGroupById(params.supperGroupId))
    dispatch(getRestaurant(params.restaurantId))
    dispatch(getUserOrder(params.supperGroupId, localStorage.userID))
    if (order) {
      console.log(order)
      dispatch(setOrderId(order.orderId))
    }
  }, [dispatch])

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
      <TopNavBar title="Place Order" />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <>
          <ExpandableSGCard
            editOnClick={() => history.push(`${PATHS.EDIT_SUPPER_GROUP}/${params.supperGroupId}`)}
            isOwner={supperGroup?.ownerId === localStorage.userID}
            supperGroupName={supperGroup?.supperGroupName ?? ''}
            supperGroupId={readableSupperGroupId(supperGroup?.supperGroupId)}
            ownerName={supperGroup?.ownerName ?? ''}
            priceLimit={supperGroup?.costLimit ?? 50}
            currentAmount={supperGroup?.currentFoodCost ?? 10}
            closingTime={unixTo12HourTime(supperGroup?.closingTime)}
            numberOfUsers={supperGroup?.userIdList?.length ?? 0}
            deliveryFee={String(supperGroup?.additionalCost ?? '-')}
          />
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
              <ViewCartButton
                numberOfItems={numberOfItems()}
                currentTotal={order?.totalCost}
                onClick={() => history.push(`${PATHS.VIEW_CART}/${params.supperGroupId}`)}
              />
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </Background>
  )
}
