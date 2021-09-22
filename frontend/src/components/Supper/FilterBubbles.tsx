import CaretDownOutlined from '@ant-design/icons/lib/icons/CaretDownOutlined'
import CaretUpOutlined from '@ant-design/icons/lib/icons/CaretUpOutlined'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import styled from 'styled-components'
import { V1_BACKGROUND, V1_RED } from '../../common/colours'
import {
  setAmountLeftFilter,
  setRestaurantFilter,
  setClosingTimeFilter,
  setFilteredSupperGroups,
} from '../../store/supper/action/setter'
import { Filter, Restaurants } from '../../store/supper/types'
import { RootState } from '../../store/types'

const MainContainer = styled.div`
  margin: 20px auto 5px auto;
  overflow-x: scroll;
  width: 90%;
  height: fit-content;
`

const BubblesContainer = styled.div`
  width: fit-content;
  height: fit-content;
  padding: 0 5px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 10px;
  background-color: ${V1_BACKGROUND};
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
    dispatch(setFilteredSupperGroups())
  }, [closingTimeFilter, amountLeftFilter, restaurantFilter])

  const onClosingTimeFilterClick = () => {
    if (closingTimeFilter === Filter.DEFAULT) {
      if (amountLeftFilter !== Filter.DEFAULT) {
        dispatch(setAmountLeftFilter(Filter.DEFAULT))
        setAmountLeftIcon(defaultFilterIcon)
      }
      dispatch(setClosingTimeFilter(Filter.ASCENDING))
      setClosingTimeIcon(ascendingFilterIcon)
    } else if (closingTimeFilter === Filter.ASCENDING) {
      if (amountLeftFilter !== Filter.DEFAULT) {
        dispatch(setAmountLeftFilter(Filter.DEFAULT))
        setAmountLeftIcon(defaultFilterIcon)
      }
      dispatch(setClosingTimeFilter(Filter.DESCENDING))
      setClosingTimeIcon(descendingFilterIcon)
    } else {
      dispatch(setClosingTimeFilter(Filter.DEFAULT))
      setClosingTimeIcon(defaultFilterIcon)
    }
  }

  const onAmountLeftFilterClick = () => {
    if (amountLeftFilter === Filter.DEFAULT) {
      if (closingTimeFilter !== Filter.DEFAULT) {
        dispatch(setClosingTimeFilter(Filter.DEFAULT))
        setClosingTimeIcon(defaultFilterIcon)
      }
      dispatch(setAmountLeftFilter(Filter.ASCENDING))
      setAmountLeftIcon(ascendingFilterIcon)
    } else if (amountLeftFilter === Filter.ASCENDING) {
      if (closingTimeFilter !== Filter.DEFAULT) {
        dispatch(setClosingTimeFilter(Filter.DEFAULT))
        setClosingTimeIcon(defaultFilterIcon)
      }
      dispatch(setAmountLeftFilter(Filter.DESCENDING))
      setAmountLeftIcon(descendingFilterIcon)
    } else {
      dispatch(setAmountLeftFilter(Filter.DEFAULT))
      setAmountLeftIcon(defaultFilterIcon)
    }
  }

  const onRestaurantFilterClick = (restaurant: Restaurants) => {
    if (restaurantFilter.includes(restaurant))
      dispatch(setRestaurantFilter(restaurantFilter.filter((r) => r !== restaurant)))
    else {
      dispatch(setRestaurantFilter(restaurantFilter.concat(restaurant)))
    }
  }

  return (
    <MainContainer>
      <BubblesContainer>
        <Bubble onClick={onClosingTimeFilterClick} isActive={closingTimeFilter !== Filter.DEFAULT}>
          Closing Time
          {closingTimeIcon}
        </Bubble>
        <Bubble onClick={onAmountLeftFilterClick} isActive={amountLeftFilter !== Filter.DEFAULT}>
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
