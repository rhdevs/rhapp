import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons/lib/icons'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import styled from 'styled-components'
import { V1_RED } from '../../common/colours'
import {
  getAmountLeftFilter,
  getClosingTimeFilter,
  getFilteredSupperGroups,
  getRestaurantFilter,
} from '../../store/supper/action'
import { Filter, Restaurants } from '../../store/supper/types'
import { RootState } from '../../store/types'

const MainContainer = styled.div`
  margin: 20px auto 5px auto;
  overflow: scroll;
  width: 90%;
`

const BubblesContainer = styled.div`
  width: fit-content;
  padding: 0 5px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 10px;
`

const Bubble = styled.div<{ isActive?: boolean }>`
  align-items: center;
  justify-content: center;
  display: flex;
  width: 123.72px;
  height: 22px;
  left: 144.68px;

  background: ${(props) => (props.isActive ? V1_RED : 'white')};
  border: 2px solid ${V1_RED};
  box-sizing: border-box;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  color: ${(props) => (props.isActive ? 'white' : V1_RED)};
`

const InitialIconContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 5px;
`

export const FilterBubbles = () => {
  const iconStyling = { paddingLeft: '5px', fontSize: '11px' }
  const defaultFilterIcon = (
    <InitialIconContainer>
      <CaretUpOutlined style={{ marginBottom: '-2px', fontSize: '11px' }} />
      <CaretDownOutlined style={{ marginTop: '-2px', fontSize: '11px' }} />
    </InitialIconContainer>
  )
  const ascendingFilterIcon = <CaretUpOutlined style={iconStyling} />
  const descendingFilterIcon = <CaretDownOutlined style={iconStyling} />
  const dispatch = useDispatch()

  const { closingTimeFilter, amountLeftFilter, restaurantFilter } = useSelector((state: RootState) => state.supper)

  const [closingTimeIcon, setClosingTimeIcon] = useState<JSX.Element>(defaultFilterIcon)
  const [amountLeftIcon, setAmountLeftIcon] = useState<JSX.Element>(defaultFilterIcon)

  useEffect(() => {
    dispatch(getFilteredSupperGroups())
  }, [closingTimeFilter, amountLeftFilter, restaurantFilter])

  const onClosingTimeFilterClick = () => {
    if (closingTimeFilter === Filter.DEFAULT) {
      if (amountLeftFilter !== Filter.DEFAULT) dispatch(getAmountLeftFilter(Filter.DEFAULT))
      dispatch(getClosingTimeFilter(Filter.ASCENDING))
      setClosingTimeIcon(ascendingFilterIcon)
    } else if (closingTimeFilter === Filter.ASCENDING) {
      if (amountLeftFilter !== Filter.DEFAULT) dispatch(getAmountLeftFilter(Filter.DEFAULT))
      dispatch(getClosingTimeFilter(Filter.DESCENDING))
      setClosingTimeIcon(descendingFilterIcon)
    } else {
      dispatch(getClosingTimeFilter(Filter.DEFAULT))
      setClosingTimeIcon(defaultFilterIcon)
    }
  }

  const onAmountLefftFilterClick = () => {
    if (amountLeftFilter === Filter.DEFAULT) {
      if (closingTimeFilter !== Filter.DEFAULT) dispatch(getClosingTimeFilter(Filter.DEFAULT))
      dispatch(getAmountLeftFilter(Filter.ASCENDING))
      setAmountLeftIcon(ascendingFilterIcon)
    } else if (amountLeftFilter === Filter.ASCENDING) {
      if (closingTimeFilter !== Filter.DEFAULT) dispatch(getClosingTimeFilter(Filter.DEFAULT))
      dispatch(getAmountLeftFilter(Filter.DESCENDING))
      setAmountLeftIcon(descendingFilterIcon)
    } else {
      dispatch(getAmountLeftFilter(Filter.DEFAULT))
      setAmountLeftIcon(defaultFilterIcon)
    }
  }

  const onRestaurantFilterClick = (restaurant: Restaurants) => {
    if (restaurantFilter.includes(restaurant))
      dispatch(getRestaurantFilter(restaurantFilter.filter((r) => r !== restaurant)))
    else {
      dispatch(getRestaurantFilter(restaurantFilter.concat(restaurant)))
    }
  }

  return (
    <MainContainer>
      <BubblesContainer>
        <Bubble onClick={onClosingTimeFilterClick} isActive={closingTimeFilter !== Filter.DEFAULT}>
          Closing Time
          {closingTimeIcon}
        </Bubble>
        <Bubble onClick={onAmountLefftFilterClick} isActive={amountLeftFilter !== Filter.DEFAULT}>
          Amount Left
          {amountLeftIcon}
        </Bubble>
        {Object.values(Restaurants).map((restaurant, index) => {
          const isActive = restaurantFilter.includes(restaurant)
          return (
            <Bubble key={index} onClick={() => onRestaurantFilterClick(restaurant)} isActive={isActive}>
              {restaurant}
            </Bubble>
          )
        })}
      </BubblesContainer>
    </MainContainer>
  )
}
