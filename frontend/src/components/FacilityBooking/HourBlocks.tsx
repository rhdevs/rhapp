import React from 'react'

import { MainTimeContainer, TimeContainer } from './BlockStyles.styled'

/**
 * @returns A column that labels the hour blocks of the DailyContainer, from 0000 to 2400
 * @example
 * ```
 * // HourBlocks placed beside DailyContainer
 * <HourBlocks/>
 * <DailyContainer>...</DailyContainer>
 * ```
 */
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
