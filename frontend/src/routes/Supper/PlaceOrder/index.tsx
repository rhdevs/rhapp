import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

import styled from 'styled-components'
import LoadingSpin from '../../../components/LoadingSpin'
import SearchBar from '../../../components/Mobile/SearchBar'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { ExpandableSGCard } from '../../../components/Supper/CustomCards/ExpandableSGCard'
import { MenuSection } from '../../../components/Supper/MenuSection'
import { MenuTabs } from '../../../components/Supper/MenuTabs'
import {
  getRestaurant,
  getSupperGroupById,
  readableSupperGroupId,
  setSearchValue,
  unixTo12HourTime,
} from '../../../store/supper/action'
import { RootState } from '../../../store/types'
import { PATHS } from '../../Routes'

const Background = styled.div`
  width: 100vw;
  background: #fafaf4;
  position: relative;
  min-height: 100vh;
  height: 100%;
  padding-bottom: 1rem;
`
const SearchBarContainer = styled.div`
  margin: 8px 20px;
`

const Restaurant = styled.text`
  font-weight: 700;
  font-size: 24px;
  margin-left: 30px;
`

export default function PlaceOrder() {
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams<{ supperGroupId: string; restaurantId: string }>()

  useEffect(() => {
    dispatch(getSupperGroupById(params.supperGroupId))
    dispatch(getRestaurant(params.restaurantId))
  }, [dispatch])

  const { supperGroup, restaurant, isLoading, searchValue } = useSelector((state: RootState) => state.supper)

  const onChange = (input: string) => {
    console.log(input)
    dispatch(setSearchValue(input))
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
          <Restaurant>{restaurant?.name ?? '-'}</Restaurant>
          <SearchBarContainer>
            <SearchBar placeholder="Search for food" value={searchValue} onChange={onChange} />
            <MenuTabs menuSections={restaurant?.allSection} />
            <MenuSection supperGroupId={supperGroup?.supperGroupId} menu={restaurant?.menu} />
          </SearchBarContainer>
          {/* If user has item in order, add 'View cart bottom button' &&& link to View cart page! at VIEW_CART/:supperGroupId */}
        </>
      )}
    </Background>
  )
}
