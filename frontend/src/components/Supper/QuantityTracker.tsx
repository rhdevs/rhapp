import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { setCount } from '../../store/supper/action/setter'
import { RootState } from '../../store/types'
import { MinusButton } from './MinusButton'
import { PlusButton } from './PlusButton'

const CounterContainer = styled.div<{ center?: boolean | undefined; margin?: string | undefined }>`
  display: flex;
  align-items: center;
  ${(props) => props.center && 'justify-content: center;'}
  ${(props) => props.margin && `margin: ${props.margin};`}
`

const ValueContainer = styled.text`
  font-size: 24px;
  font-weight: 500;
  margin: 0 20px;
`

type Props = {
  min?: number
  max?: number
  default: number
  center?: boolean
  margin?: string
}

export const QuantityTracker = (props: Props) => {
  const dispatch = useDispatch()
  const { count } = useSelector((state: RootState) => state.supper)

  useEffect(() => {
    dispatch(setCount(props.default))
  }, [])

  const MAX = props.max !== undefined ? props.max : Number.MAX_SAFE_INTEGER

  const subFromCount = () => {
    if (count !== props.min ?? 0) {
      dispatch(setCount(count - 1))
    }
  }

  const addToCount = () => {
    if (count < MAX) {
      dispatch(setCount(count + 1))
    }
  }

  return (
    <CounterContainer center={props.center} margin={props.margin}>
      <MinusButton increment={1} min={props.min} defaultValue={props.default} onClick={subFromCount} />
      <ValueContainer>{count}</ValueContainer>
      <PlusButton isAdding onClick={addToCount} max={MAX} />
    </CounterContainer>
  )
}
