import React, { useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { Button, Input, Form, Select } from 'antd'
// import passwordHash from 'password-hash'
import { PATHS } from '../../Routes'
import 'antd/dist/antd.css'

const MainContainer = styled.div`
  height: 110vh;
  width: 100vw;
  background-color: #fafaf4;
`

const AccountText = styled.text`
  padding-top: 10px;
  font-size: 21px;
  display: flex;
  justify-content: center;
`

const SignUpContainer = styled.div`
  width: 70vw;
  margin: auto;
  background-color: #fafaf4;
  text-align: center;
  border-radius: 13px 13px 13px 13px;
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
    width: 70vw;
    height: 6vh;
    border-radius: 10px;
    padding-top: 10px;
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
    border-radius: 10px;
    padding-top: 10px;
  }
`

export default function Signup() {
  const history = useHistory()
  // const [password] = useState('')
  // const passwordHashed = passwordHash.generate(password)

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

  // const { name, email, password, password2 } = formData

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const optionChange = (value) => {
    setFormData({
      ...formData,
      block: value,
    })
  }

  //combit onSubmit and signupHandler
  const onSubmit = async (e) => {
    e.preventDefault()
    console.log('submit')
    if (formData.password !== formData.password2) {
      console.log('passwords do not match')
    } else {
      console.log(formData)
    }
  }

  const signupHandler = () => {
    console.log('signup')
  }

  return (
    <>
      <MainContainer>
        <p style={{ marginLeft: '10vw', paddingTop: '5vw', fontSize: '24px', fontWeight: 'bold' }}>Sign Up</p>
        <SignUpContainer>
          <Input
            placeholder="NUS Email"
            name="email"
            style={{ borderRadius: '10px' }}
            value={formData.email}
            onChange={(e) => onChange(e)}
          ></Input>
          <br /> <br />
          <Input
            placeholder="Username"
            name="userId"
            style={{ borderRadius: '10px' }}
            value={formData.userId}
            onChange={(e) => onChange(e)}
          ></Input>{' '}
          <br />
          <br />
          <Input.Password
            placeholder="Password"
            name="password"
            style={{ borderRadius: '10px' }}
            value={formData.password}
            onChange={(e) => onChange(e)}
          ></Input.Password>
          <br /> <br />
          <Input.Password
            placeholder="Confirm Password"
            name="password2"
            style={{ borderRadius: '10px' }}
            value={formData.password2}
            onChange={(e) => onChange(e)}
          ></Input.Password>
          <br /> <br />
          <Input
            placeholder="Display Name"
            name="display"
            style={{ borderRadius: '10px' }}
            value={formData.display}
            onChange={(e) => onChange(e)}
          ></Input>
          <br /> <br />
          <Input
            placeholder="Telegram Handle"
            name="telegram"
            style={{ borderRadius: '10px' }}
            value={formData.telegram}
            onChange={(e) => onChange(e)}
          ></Input>
          <br /> <br />
          <Form.Item>
            <Select placeholder="Select your block" style={{ borderRadius: '10px' }} onChange={optionChange}>
              <Select.Option value="1">Block 1</Select.Option>
              <Select.Option value="2">Block 2</Select.Option>
              <Select.Option value="3">Block 3</Select.Option>
              <Select.Option value="4">Block 4</Select.Option>
              <Select.Option value="5">Block 5</Select.Option>
              <Select.Option value="6">Block 6</Select.Option>
              <Select.Option value="7">Block 7</Select.Option>
              <Select.Option value="8">Block 8</Select.Option>
            </Select>
          </Form.Item>
          <Input.TextArea
            placeholder="Bio"
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
          <AccountText>Have an account?</AccountText>
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
          </PostButton>
        </SignUpContainer>
      </MainContainer>
    </>
  )
}
