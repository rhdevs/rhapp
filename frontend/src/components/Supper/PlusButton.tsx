import React from 'react'
import { PlusCircleFilled } from '@ant-design/icons'

type Props = {
  color?: string
}

export const PlusButton = (props: Props) => {
  const DARK_BLUE = '#002642'
  const LIGHT_RED = '#EB5757'
  const RED_SIZE = '48.7px'
  const BLUE_SIZE = '25px'

  let BUTTON_COLOR = LIGHT_RED
  let BUTTON_SIZE = RED_SIZE

  if (props.color === 'DARK_BLUE') {
    BUTTON_COLOR = DARK_BLUE
    BUTTON_SIZE = BLUE_SIZE
  }

  return (
    <PlusCircleFilled
      style={{
        color: BUTTON_COLOR, //'#EB5757'
        fontSize: BUTTON_SIZE,
        paddingRight: '7px',
        filter: 'drop-shadow(2px 2.5px 3px rgba(0, 0, 0, 0.15))',
      }}
    />
  )
}
