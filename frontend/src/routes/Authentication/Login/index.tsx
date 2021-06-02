import React, { useState } from 'react'
import styled from 'styled-components'
import { useHistory, useLocation } from 'react-router-dom'
import { Alert, Button, Input } from 'antd'
import 'antd/dist/antd.css'
import sha256 from 'crypto-js/sha256'

import { PATHS } from '../../Routes'
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
  max-width: 255px;
  max-height: 255px;
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

export default function Login() {
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const passwordHash = sha256(password).toString()

  const [error, setError] = useState({ message: '' })

  const loginHandler = async () => {
    if (username !== '' && password !== '') {
      setError({ message: '' })
      // setIsLoading(true)
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
            if (resp.status >= 500) {
              setError({ message: 'Server Error! Try again in awhile or approach an administrator!' })
              setIsLoading(false)
              throw new Error('Server Error')
            } else if (resp.status == 403) {
              setError({ message: 'Credentials is wrong. Try Again!' })
              setIsLoading(false)
              throw new Error('Wrong Credentials')
            }
          }
          return resp.json()
        })
        .then((data) => {
          localStorage.setItem('token', data.token)
          localStorage.setItem('userID', username)
          history.push(PATHS.HOME_PAGE)
          setIsLoading(false)
        })
        .catch((err) => console.log(err))
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('userID')
      setError({ message: 'Missing Username or Password!' })
    }
  }

  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      {isLoading && <LoadingSpin />}
      {!isLoading && (
        <LoginContainer>
          <Logo src={logo} />
          <br />
          <InputTextLabel>Username: </InputTextLabel>
          <Input
            type="text"
            placeholder="A1234567B"
            value={username}
            onChange={(e) => {
              const newUsername = e.target.value
              setUsername(newUsername.toUpperCase())
            }}
          />
          <br />
          <br />
          <InputTextLabel>Password: </InputTextLabel>
          <Input.Password
            type="password"
            placeholder="password1"
            onChange={(e) => {
              setPassword(e.target.value)
            }}
            onPressEnter={loginHandler}
          />
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
    </div>
  )
}
