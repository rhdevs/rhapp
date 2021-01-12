import React, { useState } from 'react'

import { Button, Input } from 'antd'
import 'antd/dist/antd.css'
import { useHistory } from 'react-router-dom'
import { PATHS } from '../routes/Routes'
import styled from 'styled-components'

const AccountText = styled.text`
  margin-top: 10px;
  font-size: 21px;
  display: flex;
  justify-content: center;
`

function LoginCard() {
  const history = useHistory()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <>
      <Input
        placeholder="Username"
        onChange={() => {
          setUsername(username)
          console.log(username)
        }}
      ></Input>
      <br />
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

export default LoginCard
