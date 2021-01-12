import React, { useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { Button, Input } from 'antd'

import NavBar from '../../../components/NavBar'
import 'antd/dist/antd.css'
import { PATHS } from '../../Routes'

const LoginContainer = styled.div`
  height: 100%;
  width: 75vw;
  background-color: #f2f7f7;
  margin: 5vh auto;
  padding: 15px;
`

const AccountText = styled.text`
  margin-top: 10px;
  font-size: 21px;
  display: flex;
  justify-content: center;
`

export default function Login() {
  const history = useHistory()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <>
      <NavBar text="Sign in" />
      <Input
        placeholder="Username"
        onChange={() => {
          setUsername(username)
          console.log(username)
        }}
      ></Input>
      <br />
      <br />
      <Input
        placeholder="Password"
        onChange={() => {
          setPassword(password)
          console.log(password)
        }}
      ></Input>
      <br /> <br />
      <Button
        type="primary"
        block
        onClick={() => {
          history.push(PATHS.HOME_PAGE)
        }}
      >
        Sign in
      </Button>
      <AccountText>Do not have an account?</AccountText>
      <Button
        type="primary"
        block
        onClick={() => {
          history.push(PATHS.SIGNUP_PAGE)
        }}
      >
        Sign Up
      </Button>
    </>
  )
}
