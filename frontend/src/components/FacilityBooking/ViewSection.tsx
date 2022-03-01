import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { DailyContainer, MainContainer } from './BlockStyles'
import ViewBlock from './ViewBlock'
import { RootState } from '../../store/types'
import HourBlocks from './HourBlocks'
import CurrentTimeLine, { calcTop } from './CurrentTimeLine'
import { getTimeBlocks } from '../../store/facilityBooking/action'

const ViewScheduleBlock = () => {
  const { timeBlocks } = useSelector((state: RootState) => state.facilityBooking)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getTimeBlocks())
  }, [])

  return (
    <MainContainer>
      <CurrentTimeLine width={'calc(100% - 70px)'} right={'10px'} top={calcTop()} />
      <HourBlocks />
      <DailyContainer>
        {timeBlocks.map((entry, index) => (
          <ViewBlock key={index} entry={entry} />
        ))}
      </DailyContainer>
    </MainContainer>
  )
}
export default ViewScheduleBlock
