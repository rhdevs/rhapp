import React from 'react'
import styled from 'styled-components'
import NavBar from '../components/NavBar'

const MainContainer = styled.div`
  height: 100%;
  width: 100%;
  background-color: #f2f7f7;
`

export default class Home extends React.Component {
  render() {
    return (
      <>
        <NavBar text={'Website'} />
        <MainContainer>It works!</MainContainer>
      </>
    )
  }
}
