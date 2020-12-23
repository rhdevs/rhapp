import React, { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { useDispatch } from 'react-redux'
import { BasicCard } from '../../../components/basiccard/test2'
import styled from 'styled-components'
import '../../../assets/fonts.css'
// import { RootState } from '../../store/types'

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fafaf4; !important
`

export default function ViewBooking() {
  const dispatch = useDispatch()
  // const { sampleStateText } = useSelector((state: RootState) => state.home)

  useEffect(() => {
    // fetch all default facilities
  }, [dispatch])

  return (
    <>
      <MainContainer>
        <TopNavBar title={'Laundry Time'} />
        <BasicCard />
      </MainContainer>
    </>
  )
}
