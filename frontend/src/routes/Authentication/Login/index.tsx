import React, { useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { Button, Input } from 'antd'
import axios from 'axios'
import passwordHash from 'password-hash'

import NavBar from '../../../components/NavBar'
import 'antd/dist/antd.css'
import { PATHS } from '../../Routes'
import jwt from 'jsonwebtoken'

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

function generateToken(user) {
  const u = {
    username: user.username,
    password: user.password,
    _id: user._id.toString(),
    image: user.image,
  }
  return jwt.sign(u, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24, // expires in 24 hours
  })
}

export default function Login() {
  const history = useHistory()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const passwordHashed = passwordHash.generate(password)

  const loginHandler = () => {
    axios
      .post('/auth/login', { username, passwordHashed })
      .then((res: any) => {
        console.log(res)
        history.push(PATHS.HOME_PAGE)
      })
      .catch((err) => {
        window.alert('Incorrect username or password!')
      })
  }

  return (
    <>
      <NavBar text="Sign in" />
      <LoginContainer>
        <Input
          placeholder="Username"
          onChange={() => {
            setUsername(username)
          }}
        ></Input>
        <br />
        <br />
        <Input
          placeholder="Password"
          onChange={() => {
            setPassword(password)
          }}
        ></Input>
        <br /> <br />
        <Button type="primary" block onClick={loginHandler}>
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
      </LoginContainer>
    </>
  )
}
