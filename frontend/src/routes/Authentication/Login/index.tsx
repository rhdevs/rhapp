import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { Alert, Button, Input } from 'antd'
import 'antd/dist/antd.css'
import sha256 from 'crypto-js/sha256'

import { PATHS } from '../../Routes'
import logo from '../../../assets/devsLogo.svg'
import { DOMAIN_URL, ENDPOINTS } from '../../../store/endpoints'
import LoadingSpin from '../../../components/LoadingSpin'
import { SetIsJcrc } from '../../../store/facilityBooking/action'

const LoginContainer = styled.div`
  height: 100vh !important;
  margin: 0px 23px;
  padding-top: 50px;
  text-align: center;
`

const InputTextLabel = styled.text`
  float: left;
  font-size: 17px;
  padding: 0px 0px 4px 0px;
  font-family: Inter;
  font-style: normal;
  font-weight: 200;
`

const Logo = styled.img`
  width: 70%;
  max-width: 255px;
  max-height: 255px;
`

const PostButton = styled.div`
  text-align: center;
  .ant-btn {
    font-size: 17px;
    letter-spacing: 0em;
    text-align: center;
    font-weight: 200;
  }
  .ant-btn-primary {
    background-color: #de5f4c;
    border-color: #de5f4c;
    width: 100%;
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
  .ant-btn-default: {
    height: min-content;
    margin: 10px;
    float: left;
    border-radius: 20px;
  }
`
const AlertGroup = styled.div`
  margin: 0px;
`
const StyledUsernameInput = styled.div`
  .ant-input {
    border-radius: 20px;
    font-size: 20px;
    font-weight: 200;
  }
`
const StyledPasswordInput = styled.div`
  .ant-input-password {
    border-radius: 20px;
    font-size: 20px;
  }
  .ant-input {
    border-radius: 15px;
    font-size: 20px;
    font-weight: 200;
  }
`

const ButtonLabel = styled.div`
  width: 100%;
  white-space: break-spaces;
  overflow: hidden;
`

const StyledButtonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 70px;
  column-gap: 6%;
`

export default function Login() {
  const history = useHistory()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const passwordHash = sha256(password).toString()
  const [isOn, setIsOn] = useState(false)

  const [error, setError] = useState({ message: '' })

  const loginHandler = async () => {
    if (username !== '' && password !== '') {
      setError({ message: '' })
      // setIsLoading(true)
      const queryBody = {
        userID: username,
        passwordHash: passwordHash,
      }
      await fetch(DOMAIN_URL.AUTH + ENDPOINTS.LOGIN, {
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
          if (username === 'RH_JCRC') {
            dispatch(SetIsJcrc(true))
          }
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
    <div style={{ backgroundColor: '#fafaf4' }}>
      {isLoading && <LoadingSpin />}
      {!isLoading && (
        <LoginContainer>
          <Logo src={logo} />
          <br />
          <InputTextLabel>Username: </InputTextLabel>
          <StyledUsernameInput>
            <Input
              type="text"
              placeholder="Matric Number"
              value={username}
              onChange={(e) => {
                const newUsername = e.target.value
                setUsername(newUsername.toUpperCase())
              }}
            />
          </StyledUsernameInput>
          <br />
          <InputTextLabel>Password: </InputTextLabel>
          <StyledPasswordInput>
            <Input.Password
              type="password"
              placeholder="Enter Password"
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              onPressEnter={loginHandler}
            />
          </StyledPasswordInput>
          <br />
          {error.message !== '' && (
            <AlertGroup>
              <Alert message={error.message} type="error" closable showIcon />
            </AlertGroup>
          )}
          <PostButton>
            <Button type="primary" shape="round" size="large" block onClick={loginHandler}>
              Login
            </Button>
          </PostButton>
          <br />
          <StyledButtonContainer>
            <PostButton>
              <Button
                type="default"
                shape="round"
                size="large"
                block
                style={{ height: '100%', borderRadius: '20px' }}
                onClick={() => {
                  history.push(PATHS.SIGNUP_PAGE)
                }}
              >
                <ButtonLabel>Register</ButtonLabel>
              </Button>
            </PostButton>
            <PostButton>
              <Button
                type="default"
                shape="round"
                size="large"
                block
                style={{ height: '100%', borderRadius: '20px' }}
                onClick={() => {
                  history.push(PATHS.FORGET_PASSWORD_PAGE)
                }}
              >
                <ButtonLabel>Forget Password</ButtonLabel>
              </Button>
            </PostButton>
          </StyledButtonContainer>
        </LoginContainer>
      )}
    </div>
  )
}
