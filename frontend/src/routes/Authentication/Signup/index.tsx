import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { Button, Input } from 'antd'

import { PATHS } from '../../Routes'
import NavBar from '../../../components/NavBar'
import 'antd/dist/antd.css'

const AccountText = styled.text`
  margin-top: 10px;
  font-size: 21px;
  display: flex;
  justify-content: center;
`

const SignUpContainer = styled.div`
  height: 100%;
  width: 75vw;
  background-color: #f2f7f7;
  margin: 5vh auto;
  padding: 15px;
`

export default function Signup() {
  const history = useHistory()

  return (
    <>
      <NavBar text="Sign up" />
      <SignUpContainer>
        <Input placeholder="Email"></Input>
        <br /> <br />
        <Input placeholder="Username"></Input> <br />
        <br />
        <Input placeholder="Password"></Input>
        <br /> <br />
        <Button
          type="primary"
          block
          onClick={() => {
            history.push(PATHS.HOME_PAGE)
          }}
        >
          Sign Up
        </Button>
        <AccountText>Have an account?</AccountText>
        <Button
          type="primary"
          block
          onClick={() => {
            history.push(PATHS.LOGIN_PAGE)
          }}
        >
          Login
        </Button>
      </SignUpContainer>
    </>
  )
}
