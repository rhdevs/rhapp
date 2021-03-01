import React, { useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { Button, Input, Form, Select } from 'antd'
// import passwordHash from 'password-hash'
import { Alert } from 'antd'
import 'antd/dist/antd.css'
import { PATHS } from '../../Routes'
import bcrypt from 'bcryptjs'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { DOMAIN_URL, ENDPOINTS } from '../../../store/endpoints'

const MainContainer = styled.div`
  height: 110vh;
  width: 100vw;
  background-color: #fafaf4;
`

const AccountText = styled.text`
  font-family: ui-monospace;
  float: left;
  font-size: 12px;
  padding-bottom: 5px;
  padding-left: 3px;
  font-weight: bold;
`

const SignUpContainer = styled.div`
  margin: 23px;
  background-color: #fafaf4;
  text-align: center;
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
`

const AlertGroup = styled.div`
  margin: 23px;
`

export default function Signup() {
  const history = useHistory()

  const [formData, setFormData] = useState({
    email: '',
    userId: '',
    password: '',
    password2: '',
    display: '',
    telegram: '',
    block: '',
    bio: '',
  })

  const [pageNum, setPageNum] = useState({ page: 1 })
  const [error, setError] = useState({ message: '' })
  // const { name, email, password, password2 } = formData

  const onChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const optionChange = (value: any) => {
    setFormData({
      ...formData,
      block: value,
    })
  }

  //combit onSubmit and signupHandler
  const onSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    const salt = bcrypt.genSaltSync(10)
    const passwordHash = bcrypt.hashSync(formData.password, salt)

    const newUser = {
      userID: formData.userId,
      passwordHash: passwordHash,
      email: formData.email,
      position: ['Resident'],
      displayName: formData.display,
      bio: formData.bio,
      block: parseInt(formData.block),
      telegramHandle: formData.telegram,
    }

    await fetch('https://rhappsocial.rhdevs.repl.co/auth/register', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })
      .then((resp) => resp)
      .then((data) => {
        if (data.ok) {
          const queryBody = {
            userID: formData.userId,
            passwordHash: passwordHash,
          }
          fetch(DOMAIN_URL.SOCIAL + ENDPOINTS.LOGIN, {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(queryBody),
          })
            .then((resp) => {
              if (!resp.ok) {
                throw new Error('Wrong Credentials')
              }
              return resp.json()
            })
            .then((data) => {
              localStorage.setItem('token', data.token)
              localStorage.setItem('userID', formData.userId)
              history.push(PATHS.HOME_PAGE)
            })
            .catch((err) => console.log(err))
        }
      })
  }

  return (
    <>
      <MainContainer>
        {pageNum.page === 1 && <TopNavBar title="Sign Up" />}
        {pageNum.page === 2 && <TopNavBar title="Almost Done!" leftIcon={true} />}
        {error.message !== '' && (
          <AlertGroup>
            <Alert message={error.message} type="error" closable showIcon />
          </AlertGroup>
        )}
        <SignUpContainer>
          {pageNum.page === 1 && (
            <>
              <AccountText>NUS Email</AccountText>
              <Input
                placeholder="NUS Email"
                name="email"
                style={{ borderRadius: '10px' }}
                value={formData.email}
                onChange={(e) => onChange(e)}
              ></Input>
              <br /> <br />
              <AccountText>NUS ID</AccountText>
              <Input
                placeholder="A01234567X"
                name="userId"
                style={{ borderRadius: '10px' }}
                value={formData.userId}
                onChange={(e) => onChange(e)}
              ></Input>
              <br />
              <br />
              <AccountText>Password</AccountText>
              <Input.Password
                placeholder="Password"
                name="password"
                style={{ borderRadius: '10px' }}
                value={formData.password}
                onChange={(e) => onChange(e)}
              ></Input.Password>
              <br /> <br />
              <AccountText>Confirm Password</AccountText>
              <Input.Password
                placeholder="Confirm Password"
                name="password2"
                style={{ borderRadius: '10px' }}
                value={formData.password2}
                onChange={(e) => onChange(e)}
              ></Input.Password>
              <br /> <br />
              <PostButton>
                <Button
                  style={{ color: '#de5f4c' }}
                  type="link"
                  onClick={() => {
                    if (formData.password !== formData.password2) {
                      setError({ message: 'Password does not match!' })
                    } else if (!formData.email || !formData.userId || !formData.password || !formData.password2) {
                      setError({ message: 'All fields are compulsary!' })
                    } else {
                      setPageNum({ page: 2 })
                      setError({ message: '' })
                    }
                  }}
                >
                  Next Page
                </Button>
              </PostButton>
            </>
          )}
          {pageNum.page === 2 && (
            <>
              <AccountText>Full Name</AccountText>
              <Input
                placeholder="Mao Tan Ah Beng"
                name="display"
                style={{ borderRadius: '10px' }}
                value={formData.display}
                onChange={(e) => onChange(e)}
              ></Input>
              <br /> <br />
              <AccountText>Telegram Handle</AccountText>
              <Input
                placeholder="xiaomaomaozxc"
                name="telegram"
                style={{ borderRadius: '10px' }}
                value={formData.telegram}
                onChange={(e) => onChange(e)}
              ></Input>
              <br /> <br />
              <Form.Item>
                <Select
                  placeholder="Which block are you from?"
                  style={{ borderRadius: '10px', textAlign: 'left' }}
                  onChange={optionChange}
                >
                  <Select.Option value="2">Block 2</Select.Option>
                  <Select.Option value="3">Block 3</Select.Option>
                  <Select.Option value="4">Block 4</Select.Option>
                  <Select.Option value="5">Block 5</Select.Option>
                  <Select.Option value="6">Block 6</Select.Option>
                  <Select.Option value="7">Block 7</Select.Option>
                  <Select.Option value="8">Block 8</Select.Option>
                </Select>
              </Form.Item>
              <AccountText>Profile Biography</AccountText>
              <Input.TextArea
                placeholder="Put something interesting down, it will appear on your profile!"
                name="bio"
                style={{ borderRadius: '10px' }}
                value={formData.bio}
                onChange={(e) => onChange(e)}
              ></Input.TextArea>
              <br />
              <br />
              <PostButton>
                <Button type="primary" block onClick={onSubmit}>
                  Sign Up
                </Button>
              </PostButton>
              <br />
              <PostButton>
                <Button
                  style={{ color: '#de5f4c' }}
                  type="link"
                  block
                  onClick={() => {
                    setPageNum({ page: 1 })
                  }}
                >
                  Back
                </Button>
              </PostButton>
            </>
          )}
          {/* <AccountText>Have an account?</AccountText>
          <PostButton>
            <Button
              type="primary"
              block
              onClick={() => {
                signupHandler()
                history.push(PATHS.LOGIN_PAGE)
              }}
            >
              Login
            </Button>
          </PostButton> */}
        </SignUpContainer>
      </MainContainer>
    </>
  )
}
