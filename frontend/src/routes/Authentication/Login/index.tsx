import React, { useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { Button, Input } from 'antd'
// import passwordHash from 'password-hash'
import 'antd/dist/antd.css'
import { PATHS } from '../../Routes'
// import jwt from 'jsonwebtoken'
import logo from '../../../assets/white_logo.png'

const LoginContainer = styled.div`
  height: 100%;
  width: 90%;
  background-color: white;
  margin: 5vh auto;
  padding: 15px;
  text-align: center;
`

const InputTextLabel = styled.text`
  float: left;
  font-size: 15px;
  padding: 0px 0px 4px 0px;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
`

const Logo = styled.img`
  width: 70%;
`

const PostButton = styled.div`
  text-align: center;
  .ant-btn-primary {
    background-color: #de5f4c;
    border-color: #de5f4c;
    font-size: 14px;
    letter-spacing: 0em;
    text-align: center;
    width: 100%;
    border-radius: 8px;
    margin-top: 10px;
  }
`

// function generateToken(user) {
//   const u = {
//     username: user.username,
//     password: user.password,
//     _id: user._id.toString(),
//     image: user.image,
//   }
//   return jwt.sign(u, process.env.JWT_SECRET, {
//     expiresIn: 60 * 60 * 24, // expires in 24 hours
//   })
// }

export default function Login() {
  const history = useHistory()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  // const passwordHashed = passwordHash.generate(password)

  const loginHandler = () => {
    console.log('login')
  }

  return (
    <>
      <LoginContainer>
        <Logo src={logo} />
        <br />
        <InputTextLabel>Username: </InputTextLabel>
        <Input
          placeholder="Username"
          onChange={() => {
            setUsername(username)
          }}
        ></Input>
        <br />
        <br />
        <InputTextLabel>Password: </InputTextLabel>
        <Input
          placeholder="Password"
          onChange={() => {
            setPassword(password)
          }}
        ></Input>
        <br /> <br />
        <PostButton>
          <Button type="primary" block onClick={loginHandler}>
            Login
          </Button>
        </PostButton>
        <br />
        <PostButton>
          <Button
            type="dashed"
            block
            onClick={() => {
              history.push(PATHS.SIGNUP_PAGE)
            }}
          >
            Register (Coming Soon)
          </Button>
        </PostButton>
      </LoginContainer>
    </>
  )
}
