import React from 'react'
import { PlusCircleFilled } from '@ant-design/icons'

export const PlusButton = () => {
  return (
    <PlusCircleFilled
      style={{
        color: '#EB5757',
        fontSize: '30px',
        paddingRight: '7px',
        filter: 'drop-shadow(2px 2.5px 3px rgba(0, 0, 0, 0.15))',
      }}
    />
  )
}
