import React from 'react'
import styled from 'styled-components'
import TopNavBar from '../../components/Mobile/TopNavBar'

const MainContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #fafaf4;
`
export default class Home extends React.Component {
  leftIcon = (<button>Hello</button>)

  render() {
    return (
      <MainContainer>
        <TopNavBar title={'NavBarTitle'} leftIconComponent={this.leftIcon} />
      </MainContainer>
    )
  }
}
