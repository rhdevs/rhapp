import React from 'react'
import { MinusCircleFilled } from '@ant-design/icons'

type Props = {
  color?: string
}

export const MinusButton = (props: Props) => {
  return (
    <MinusCircleFilled
      style={{
        color: '#002642', //'#EB5757'
        fontSize: '25px',
        paddingRight: '7px',
        filter: 'drop-shadow(2px 2.5px 3px rgba(0, 0, 0, 0.15))',
      }}
    />
  )
}
