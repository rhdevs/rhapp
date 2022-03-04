import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { DailyContainer, MainContainer } from './BlockStyles'
import ViewBlock from './ViewBlock'
import { RootState } from '../../store/types'
import HourBlocks from './HourBlocks'
import CurrentTimeLine, { isToday } from './CurrentTimeLine'
import { getTimeBlocks } from '../../store/facilityBooking/action'

export function setDefaultTimePosition(timePosition: number, arrLen: number) {
  let defaultTimePosition = timePosition
  if (defaultTimePosition < 0) {
    defaultTimePosition = 0
  }
  if (defaultTimePosition >= arrLen) {
    defaultTimePosition = arrLen - 1
  }
  return defaultTimePosition
}

const ViewScheduleBlock = () => {
  const { timeBlocks } = useSelector((state: RootState) => state.facilityBooking)
  const dispatch = useDispatch()
  let defaultTimePosition = 16 //4pm

  useEffect(() => {
    dispatch(getTimeBlocks())
    defaultTimePosition = setDefaultTimePosition(defaultTimePosition, timeBlocks.length)
  }, [])

  return (
    <MainContainer>
      <CurrentTimeLine />
      <HourBlocks />
      <DailyContainer>
        {timeBlocks.map((entry, index) => (
          <ViewBlock
            key={index}
            entry={entry}
            // if day selected is not current, scroll to defaultTimePosition
            scrollTo={!isToday(timeBlocks[0].timestamp) && index === defaultTimePosition}
          />
        ))}
      </DailyContainer>
    </MainContainer>
  )
}
export default ViewScheduleBlock
