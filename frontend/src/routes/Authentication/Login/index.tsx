import React from 'react'
import styled from 'styled-components'

import NavBar from '../../../components/NavBar'
import LoginCard from '../../../components/LoginCard'

const LoginContainer = styled.div`
  height: 100%;
  width: 75vw;
  background-color: #f2f7f7;
  margin: 5vh auto;
  padding: 15px;
`

export default function Login() {
  return (
    <>
      <NavBar text="Sign in" />
      <LoginContainer>
        <LoginCard />
      </LoginContainer>
    </>
  )
}
