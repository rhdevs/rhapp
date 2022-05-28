import React from 'react'

import { MainTimeContainer, TimeContainer } from './BlockStyles.styled'

const HourBlocks = () => {
  return (
    <MainTimeContainer>
      {[...Array(25).keys()].map((val, index) => {
        const hour = ('0' + val).substring(('0' + val).length - 2) + '00'
        return <TimeContainer key={index}>{hour}</TimeContainer>
      })}
    </MainTimeContainer>
  )
}

export default HourBlocks
