import React from 'react'
import styled from 'styled-components'
import 'antd/dist/antd.css'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import NotFoundCatImg from '../../../assets/notFound.svg'

const MainContainer = styled.div`
  height: 100vh;
  background-color: #fafaf4;
  text-align: center;
`

export default function NotFound() {
  return (
    <MainContainer>
      <img src={NotFoundCatImg} />
      <h1>Sorry, Page not found. Try navigating to other pages</h1>
      <BottomNavBar />
    </MainContainer>
  )
}
