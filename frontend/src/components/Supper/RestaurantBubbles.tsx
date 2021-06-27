import React, { useEffect } from 'react'

import styled from 'styled-components'
import { StatusSymbol } from './StatusSymbol'
import tick from '../../assets/whiteTick.svg'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/types'
import { setSelectedRestaurant } from '../../store/supper/action'
import { Restaurants } from '../../store/supper/types'
import { V1_BLUE } from '../../common/colours'

const CheckIcon = styled.img`
  margin-top: -4px;
`

const ScrollableContainer = styled.div`
  overflow: scroll;
  width: 75vw;
  margin: auto;
`

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  padding: 5px 0;
  width: fit-content;
  margin-right: 10px;
`

type Props = {
  restaurantList: string[]
  defaultRestaurant?: Restaurants | string | undefined
  isDisabled?: boolean
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
    <ScrollableContainer>
      <MainContainer>
        {props.restaurantList.map((restaurant, index) => {
          if (selectedRestaurant === restaurant) {
            return (
              <StatusSymbol
                isDisabled={props.isDisabled ?? false}
                border={props.isDisabled ?? false ? SHADED_DARK_BLUE : V1_BLUE}
                color="white"
                borderWidth="1px"
                backgroundColor={props.isDisabled ?? false ? SHADED_DARK_BLUE : V1_BLUE}
                shadow="0px 4px 4px 0px #6b6b6b"
                key={index}
                text={restaurant}
                rightIcon={CHECK_ICON}
                fontWeight={500}
                fontSize="14px"
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
                shadow="0px 4px 4px 0px #6b6b6b"
                key={index}
                text={restaurant}
                fontWeight={500}
                fontSize="14px"
                minWidth=""
              />
            )
          }
        })}
      </MainContainer>
    </ScrollableContainer>
  )
}
