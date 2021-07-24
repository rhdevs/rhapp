import React, { useEffect } from 'react'

import styled from 'styled-components'
import { StatusSymbol } from './StatusSymbol'
import tick from '../../assets/whiteTick.svg'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/types'
import { Restaurants } from '../../store/supper/types'
import { V1_BLUE } from '../../common/colours'
import { setSelectedRestaurant } from '../../store/supper/action/setter'

const CheckIcon = styled.img`
  margin-top: -4px;
`

const ScrollableContainer = styled.div<{ margin?: string }>`
  overflow: scroll;
  max-width: 90vw;
  margin: ${(props) => props.margin ?? 'auto'};
`

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  padding: 5px 0;
  width: fit-content;
`

type Props = {
  restaurantList: string[]
  defaultRestaurant?: Restaurants | string | undefined
  isDisabled?: boolean
  margin?: string
}

export const RestaurantBubbles = (props: Props) => {
  const SHADED_DARK_BLUE = 'rgba(0,38,66, 0.5)'
  const CHECK_ICON = <CheckIcon src={tick} alt="Check Icon" />

  const { selectedRestaurant } = useSelector((state: RootState) => state.supper)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setSelectedRestaurant(String(props.defaultRestaurant) ?? ''))
  }, [dispatch, props.defaultRestaurant])

  return (
    <ScrollableContainer margin={props.margin}>
      <MainContainer>
        {props.restaurantList.map((restaurant, index) => {
          if (selectedRestaurant === restaurant) {
            return (
              <StatusSymbol
                isDisabled={props.isDisabled ?? false}
                border={props.isDisabled ?? false ? SHADED_DARK_BLUE : V1_BLUE}
                color="white"
                borderWidth="1px"
                shadow
                backgroundColor={props.isDisabled ?? false ? SHADED_DARK_BLUE : V1_BLUE}
                key={index}
                text={restaurant}
                rightIcon={CHECK_ICON}
                minWidth=""
              />
            )
          } else {
            return (
              <StatusSymbol
                isDisabled={props.isDisabled ?? false}
                onClick={() => {
                  if (!props.isDisabled) dispatch(setSelectedRestaurant(restaurant))
                }}
                border={props.isDisabled ?? false ? SHADED_DARK_BLUE : V1_BLUE}
                color={props.isDisabled ?? false ? SHADED_DARK_BLUE : V1_BLUE}
                borderWidth="1px"
                shadow
                key={index}
                text={restaurant}
                minWidth=""
              />
            )
          }
        })}
      </MainContainer>
    </ScrollableContainer>
  )
}
