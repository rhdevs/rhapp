import React, { useState } from 'react'
import { MinusCircleFilled } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/types'
import { useEffect } from 'react'
import { setCount } from '../../store/supper/action'
import { V1_BLUE, V1_RED } from '../../common/colours'

type Props = {
  min?: number | undefined
  color?: string
  defaultValue?: number | undefined
  onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  increment: number
}

export const MinusButton = (props: Props) => {
  const SHADED_RED = 'rgba(235, 87, 87, 0.5)'
  const SHADED_DARK_BLUE = 'rgb(0, 38, 66, 0.5)'
  const dispatch = useDispatch()
  const { count } = useSelector((state: RootState) => state.supper)
  const [buttonColor, setButtonColor] = useState<string>(props.color === 'DARK_BLUE' ? V1_BLUE : V1_RED)
  useEffect(() => {
    dispatch(setCount(props.defaultValue ?? props.min ?? 0))
  }, [dispatch])

  useEffect(() => {
    if (count <= (props.min ?? 0)) {
      if (buttonColor === V1_RED) {
        setButtonColor(SHADED_RED)
      }
      if (buttonColor === V1_BLUE) {
        setButtonColor(SHADED_DARK_BLUE)
      }
    } else {
      if (buttonColor === SHADED_RED) {
        setButtonColor(V1_RED)
      }
      if (buttonColor === SHADED_DARK_BLUE) {
        setButtonColor(V1_BLUE)
      }
    }
  }, [count])

  return (
    <>
      <MinusCircleFilled
        style={{
          color: buttonColor,
          fontSize: '25px',
        }}
        onClick={buttonColor === SHADED_RED || buttonColor === SHADED_DARK_BLUE ? undefined : props.onClick}
      />
    </>
  )
}
