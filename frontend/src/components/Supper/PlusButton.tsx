import React from 'react'
import { PlusCircleFilled } from '@ant-design/icons'

type Props = {
  color?: string
}

export const PlusButton = (props: Props) => {
  const DARK_BLUE = '#002642'
  const LIGHT_RED = '#EB5757'

  let BUTTON_COLOR = LIGHT_RED

  if (props.color === 'DARK_BLUE') {
    BUTTON_COLOR = DARK_BLUE
  }

  return (
    <PlusCircleFilled
      style={{
        color: BUTTON_COLOR, //'#EB5757'
        fontSize: '30px',
        paddingRight: '7px',
        filter: 'drop-shadow(2px 2.5px 3px rgba(0, 0, 0, 0.15))',
      }}
    />
  )
}
