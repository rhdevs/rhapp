import React, { useEffect, useState } from 'react'
import PlusCircleFilled from '@ant-design/icons/lib/icons/PlusCircleFilled'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/types'
import { V1_BLUE, V1_RED } from '../../common/colours'

type Props = {
  color?: string
  isAdding?: boolean
  max?: number
  onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const PlusButton = (props: Props) => {
  const SHADED_RED = 'rgba(235, 87, 87, 0.5)'
  const SHADED_DARK_BLUE = 'rgb(0, 38, 66, 0.5)'
  const CREATE_SIZE = '48.7px'
  const COUNTING_SIZE = '25px'
  const SHADOW_FILTER = 'drop-shadow(2px 2.5px 3px rgba(0, 0, 0, 0.15))'
  const [buttonColor, setButtonColor] = useState<string>(props.color === 'DARK_BLUE' ? V1_BLUE : V1_RED)
  const buttonSize = props.isAdding ? COUNTING_SIZE : CREATE_SIZE

  const { count } = useSelector((state: RootState) => state.supper)

  const MAX = props.max !== undefined ? props.max : Infinity

  useEffect(() => {
    if (props.isAdding) {
      if (count >= MAX) {
        if (buttonColor === V1_RED) {
          setButtonColor(SHADED_RED)
        } else if (buttonColor === V1_BLUE) {
          setButtonColor(SHADED_DARK_BLUE)
        }
      } else {
        if (buttonColor === SHADED_RED || buttonColor === SHADED_DARK_BLUE) {
          if (buttonColor === SHADED_RED) {
            setButtonColor(V1_RED)
          } else if (buttonColor === SHADED_DARK_BLUE) {
            setButtonColor(V1_BLUE)
          }
        }
      }
    }
  }, [props.isAdding, count])

  return (
    <PlusCircleFilled
      style={{
        color: buttonColor,
        fontSize: buttonSize,
        filter: props.isAdding ? '' : SHADOW_FILTER,
      }}
      onClick={count >= MAX && props.isAdding ? undefined : props.onClick}
      max={MAX}
    />
  )
}
