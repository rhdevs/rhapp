import React, { useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { Button, Input } from 'antd'
import axios from 'axios'
import passwordHash from 'password-hash'

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

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  const passwordHashed = passwordHash.generate(password)

  const signupHandler = () => {
    axios
      .post('register', {
        username,
        passwordHashed,
        email,
      })
      .then((res) => {
        console.log(res)
        history.push(PATHS.HOME_PAGE)
      })
      .catch((err) => {
        window.alert(err.responser)
      })
  }

  return (
    <>
      <NavBar text="Sign up" />
      <SignUpContainer>
        <Input
          placeholder="Email"
          onChange={() => {
            setEmail(email)
          }}
        ></Input>
        <br /> <br />
        <Input
          placeholder="Username"
          onChange={() => {
            setUsername(username)
          }}
        ></Input>{' '}
        <br />
        <br />
        <Input
          placeholder="Password"
          onChange={() => {
            setPassword(password)
          }}
        ></Input>
        <br /> <br />
        <Button type="primary" block onClick={signupHandler}>
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
