import React from 'react'
import styled from 'styled-components'
import 'antd/dist/antd.css'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import ComingSoonCatImg from '../../../assets/ComingSoonCat.png'

const MainContainer = styled.div`
  height: 100vh;
  background-color: #fafaf4;
  text-align: center;
`

export default function ComingSoon() {
  return (
    <MainContainer>
      <img src={ComingSoonCatImg} width="90%" />
      <h1>Look forward to our announcement!</h1>
      <BottomNavBar />
    </MainContainer>
  )
}
