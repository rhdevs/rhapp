import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import { useDispatch } from 'react-redux'
// import { RootState } from '../../store/types'
import { Laundry } from '../../../components/laundrypage/test2'
import { available, using, edit, completed, reserved } from '../../../components/laundrypage/status'
import styled from 'styled-components'
import '../../../assets/fonts.css'

import { useHistory } from 'react-router-dom'

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fafaf4; !important
`

// const LaundryContainer = styled.div`
//   margin-top: 50px;
// `

export default function ViewBooking() {
  const dispatch = useDispatch()
  // const { sampleStateText } = useSelector((state: RootState) => state.home)
  const history = useHistory()

  useEffect(() => {
    // fetch all default facilities
  }, [dispatch])

  const [navCap, setNavCap] = useState('Reservation')

  return (
    <>
      <MainContainer>
        {/* <TopNavBar title={navCap} /> */}
        {/* <LaundryContainer> */}
        <Laundry status={reserved} serial={'S/N 050201'} />
        {/* </LaundryContainer> */}
        <BottomNavBar />
      </MainContainer>
    </>
  )
}
