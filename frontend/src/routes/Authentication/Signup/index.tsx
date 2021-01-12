import React from 'react'
import styled from 'styled-components'

import SignUpCard from '../../../components/SignUpCard'
import NavBar from '../../../components/NavBar'

const SignUpContainer = styled.div`
  height: 100%;
  width: 75vw;
  background-color: #f2f7f7;
  margin: 5vh auto;
  padding: 15px;
`

export default function Signup() {
  return (
    <>
      <NavBar text="Sign up" />
      <SignUpContainer>
        <SignUpCard />
      </SignUpContainer>
    </>
  )
}
