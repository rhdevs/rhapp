import React from 'react'
import styled from 'styled-components'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import TopNavBar from '../../../components/Mobile/TopNavBar'

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fafaf4; !important
`

export default function ViewWashingMachine() {
  return (
    <>
      <MainContainer>
        <TopNavBar title={'Washing Machine'} />
        <BottomNavBar />
      </MainContainer>
    </>
  )
}
