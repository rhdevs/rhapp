import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons/lib/icons'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import styled from 'styled-components'
import { V1_RED } from '../../common/colours'
import { getAmountLeftFilter, getClosingTimeFilter } from '../../store/supper/action'
import { Filter, Restaurants } from '../../store/supper/types'
import { RootState } from '../../store/types'

const MainContainer = styled.div`
  margin: 10px;
  overflow: scroll;
`

const BubblesContainer = styled.div`
  width: fit-content;
  padding: 0 5px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: '. . .';
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

const DropdownBackground = styled.div`
  background-color: white;
  border-radius: 10px;
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 1fr;
  grid-template-areas: '.' '.' '.';
  border: 1px solid black;
  justify-items: center;
  grid-row-gap: 5px;
`

const RestaurantBubblesContainer = styled.div``

const DropdownOption = styled.div<{ topOutline?: boolean }>`
  width: 100%;
  ${(props) => props.topOutline && 'border-top: 1px #ccc solid'}
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
  // export const getClosingTimeFilter = (chosenFilter: Filter) => (dispatch: Dispatch<ActionTypes>) => {
  //     closingTimeFilter: chosenFilter,

  // export const getAmountLeftFilter = (chosenFilter: Filter) => (dispatch: Dispatch<ActionTypes>) => {
  //     amountLeftFilter: chosenFilter,

  // export const getRestaurantFilter = (chosenFilter: Restaurants[]) => (dispatch: Dispatch<ActionTypes>) => {
  //     restaurantFilter: chosenFilter,

  const { closingTimeFilter, amountLeftFilter, restaurantFilter } = useSelector((state: RootState) => state.supper)

  const [closingTimeIcon, setClosingTimeIcon] = useState<JSX.Element>(defaultFilterIcon)
  const [amountLeftIcon, setAmountLeftIcon] = useState<JSX.Element>(defaultFilterIcon)
  const [isDropwdownOpen, setIsDropdownOpen] = useState<boolean>(false)

  const onClosingTimeFilterClick = () => {
    if (closingTimeFilter === Filter.DEFAULT) {
      dispatch(getClosingTimeFilter(Filter.ASCENDING))
      setClosingTimeIcon(ascendingFilterIcon)
    } else if (closingTimeFilter === Filter.ASCENDING) {
      dispatch(getClosingTimeFilter(Filter.DESCENDING))
      setClosingTimeIcon(descendingFilterIcon)
    } else {
      dispatch(getClosingTimeFilter(Filter.DEFAULT))
      setClosingTimeIcon(defaultFilterIcon)
    }
  }

  const onAmountLefftFilterClick = () => {
    if (amountLeftFilter === Filter.DEFAULT) {
      dispatch(getAmountLeftFilter(Filter.ASCENDING))
      setAmountLeftIcon(ascendingFilterIcon)
    } else if (amountLeftFilter === Filter.ASCENDING) {
      dispatch(getAmountLeftFilter(Filter.DESCENDING))
      setAmountLeftIcon(descendingFilterIcon)
    } else {
      dispatch(getAmountLeftFilter(Filter.DEFAULT))
      setAmountLeftIcon(defaultFilterIcon)
    }
  }

  const onRestaurantFilterClick = () => {
    console.log('Restaurants was clicked')
    setIsDropdownOpen(!isDropwdownOpen)
  }

  const dropdown = () => {
    return (
      <DropdownBackground>
        <DropdownOption>{Restaurants.ALAMAANS}</DropdownOption>
        <DropdownOption topOutline>{Restaurants.KIMLYDIMSUM}</DropdownOption>
        <DropdownOption topOutline>{Restaurants.MCDONALDS}</DropdownOption>
      </DropdownBackground>
    )
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
        <RestaurantBubblesContainer>
          <Bubble onClick={onRestaurantFilterClick}>
            {restaurantFilter.length === 0
              ? 'Restaurants'
              : restaurantFilter.length === 1
              ? restaurantFilter[0]
              : `${restaurantFilter.length} Restaurants`}
          </Bubble>
          {isDropwdownOpen && dropdown()}
        </RestaurantBubblesContainer>
      </BubblesContainer>
    </MainContainer>
  )
}
