import React from 'react'
import styled from 'styled-components'

const MainContainer = styled.div`
  height: 100%;
  width: 100%;
  background-color: #f2f7f7;
`

export default class Home extends React.Component {
  render() {
    return <MainContainer>Hello Boy</MainContainer>
  }
}
