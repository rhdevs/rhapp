import React, { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { useDispatch } from 'react-redux'
import Selector from '../../../components/Selector'
// import { RootState } from '../../store/types'

export default function ViewBooking() {
  const dispatch = useDispatch()
  // const { sampleStateText } = useSelector((state: RootState) => state.home)

  useEffect(() => {
    // fetch all default facilities
  }, [dispatch])

  return (
    <>
      <TopNavBar title={'Laundry Time'} />
      <Selector SelectedValue={'Choose your block'} ValueArray={['2', '3', '4', '5', '6', '7', '8']} />
      <Selector SelectedValue={'Choose your level'} ValueArray={['2', '3', '4']} />
    </>
  )
}
