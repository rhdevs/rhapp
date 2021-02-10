import React, { useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { Alert, Button, Input } from 'antd'
import 'antd/dist/antd.css'
import bcrypt from 'bcryptjs'
import { PATHS } from '../../Routes'
// import jwt from 'jsonwebtoken'
import logo from '../../../assets/white_logo.png'
import { DOMAIN_URL, ENDPOINTS } from '../../../store/endpoints'
import LoadingSpin from '../../../components/LoadingSpin'

const LoginContainer = styled.div`
  height: 100%;
  background-color: #ffffff;
  margin: 23px;
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
  .ant-btn-primary:focus {
    background-color: #de5f4c;
    border-color: #de5f4c;
    background: #de5f4c;
    border-color: #de5f4c;
  }
  .ant-btn-primary:hover {
    background-color: #de5f4c;
    border-color: #de5f4c;
    background: #de5f4c;
    border-color: #de5f4c;
  }
`
const AlertGroup = styled.div`
  margin: 23px;
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
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const salt = bcrypt.genSaltSync(10)
  const passwordHash = bcrypt.hashSync(password, salt)
  const [error, setError] = useState({ message: '' })

  const loginHandler = async () => {
    if (username && password) {
      setError({ message: '' })
      setIsLoading(true)
      const queryBody = {
        userID: username,
        passwordHash: passwordHash,
      }

      await fetch(DOMAIN_URL.SOCIAL + ENDPOINTS.LOGIN, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(queryBody),
      })
        .then((resp) => {
          if (!resp.ok) {
            setError({ message: 'Something is wrong. Try Again!' })
          }
          return resp.json()
        })
        .then((data) => {
          console.log(data.token)
          localStorage.setItem('token', data.token)
          setIsLoading(false)
        })
    } else {
      setError({ message: 'Missing Username or Password!' })
    }
  }

  return (
    <>
      {isLoading && <LoadingSpin />}
      {!isLoading && (
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
          {error.message !== '' && (
            <AlertGroup>
              <Alert message={error.message} type="error" closable showIcon />
            </AlertGroup>
          )}
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
              Register
            </Button>
          </PostButton>
        </LoginContainer>
      )}
    </>
  )
}
