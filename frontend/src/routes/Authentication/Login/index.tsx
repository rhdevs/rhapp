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

import logo from '../../../assets/white_logo.png'

const LoginContainer = styled.div`
  height: 100%;
  width: 400px;
  background-color: white;
  margin: 5vh auto;
  padding: 15px;
  text-align: center;
`
//box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

const AccountText = styled.text`
  margin-top: 10px;
  font-size: 18px;
  display: flex;
  justify-content: center;
`
const Logo = styled.img`
  height: 100px;
  width: 100px;
`

const PostButton = styled.div`
  text-align: center;
  .ant-btn-primary {
    background-color: #de5f4c;
    border-color: #de5f4c;
    font-size: 17px;
    font-style: normal;
    font-weight: 200;
    line-height: 23px;
    letter-spacing: 0em;
    text-align: center;
    width: 72;
    height: 33px;
    border-radius: 8px;
    margin-top: 10px;
  }
  .ant-btn-primary:hover,
  .ant-btn-primary:focus {
    background-color: #b54c3c;
    border-color: #b54c3c;
    font-size: 17px;
    font-style: normal;
    font-weight: 200;
    line-height: 23px;
    letter-spacing: 0em;
    text-align: center;
    width: 72;
    height: 33px;
    border-radius: 8px;
    margin-top: 10px;
  }
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
        <Logo src={logo} />
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
        <PostButton>
          {' '}
          <Button type="primary" block onClick={loginHandler}>
            Sign in
          </Button>
        </PostButton>
        <AccountText>Do not have an account?</AccountText>
        <PostButton>
          {' '}
          <Button
            type="primary"
            block
            onClick={() => {
              history.push(PATHS.SIGNUP_PAGE)
            }}
          >
            Sign Up
          </Button>
        </PostButton>
      </LoginContainer>
    </>
  )
}
