import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { setPriceLimit } from '../../store/supper/action'
import { RootState } from '../../store/types'
import { MinusButton } from './MinusButton'
import { PlusButton } from './PlusButton'

const ValueContainer = styled.text`
  font-size: 24px;
  font-weight: 500;
  margin: 30px;
`
type Props = {
  max?: number
}

export const MaxPriceFixer = (props: Props) => {
  const dispatch = useDispatch()

  const { priceLimit } = useSelector((state: RootState) => state.supper)

  const MAX = props.max !== undefined ? props.max : Math.max()

  const subFrompriceLimit = () => {
    if (priceLimit !== 0) {
      dispatch(setPriceLimit(priceLimit - 1))
    }
  }

  const addTopriceLimit = () => {
    if (priceLimit < MAX) {
      dispatch(setPriceLimit(priceLimit + 1))
    }
  }

  return (
    <>
      <MinusButton color="DARK_BLUE" onClick={subFrompriceLimit} />
      <ValueContainer>${priceLimit}</ValueContainer>
      <PlusButton color="DARK_BLUE" isAdding={true} onClick={addTopriceLimit} max={MAX} />
    </>
  )
}
