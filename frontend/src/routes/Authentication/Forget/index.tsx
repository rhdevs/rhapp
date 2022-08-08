import React, { useState } from 'react'

import styled from 'styled-components'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { post, ENDPOINTS, DOMAINS } from '../../../store/endpoints'
import { Alert, Button, Input } from 'antd'
import 'antd/dist/antd.css'

const ForgetPasswordContainer = styled.div`
  text-align: center;
  margin: 0px 23px;
  padding-top: 50px;
`
const InputTextLabel = styled.text`
  float: left;
  font-size: 17px;
  padding: 0px 0px 4px 0px;
  font-family: Inter;
  font-style: normal;
  font-weight: 200;
`
const StyledEmailInput = styled.div`
  .ant-input {
    border-radius: 20px;
    font-size: 20px;
    font-weight: 200;
  }
`
const AlertGroup = styled.div`
  margin: 23px;
`
const ButtonDiv = styled.div`
  display: flex
  justify-content: 'center';
  align-items: 'center';
`
const LongButton = {
  size: 'small',
  backgroundColor: '#DE5F4C',
  borderColor: '#DE5F4C',
  boxShadow: '0px 2px 0px rgba(0, 0, 0, 0.043)',
  borderRadius: '8px',
  margin: 'auto',
  marginTop: '2vh',
  display: 'block',
}

export default function ForgetPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState({ message: '' })
  const [success, setSuccess] = useState(false)

  const changePasswordHandler = async () => {
    if (email === '') {
      setError({ message: 'Email cannot be empty' })
      return
    } else if (!email.includes('@u.nus.edu')) {
      setError({ message: 'Please check if your NUS Email Domain is @u.nus.edu' })
      return
    } else {
      post(ENDPOINTS.FORGET_PASSWORD, DOMAINS.AUTH, { email: email })
        .then((resp) => {
          if (resp.status === 'success') {
            setSuccess(true)
          }
        })
        .catch((err) => {
          console.log(err)
          setError({ message: 'Something went wrong, please try again.' })
        })
    }
  }

  return (
    <div>
      <TopNavBar title="Forget Password" />
      <ForgetPasswordContainer>
        <InputTextLabel>Email: </InputTextLabel>
        <StyledEmailInput>
          <Input
            type="text"
            placeholder="NUS Email Address"
            value={email}
            onChange={(e) => {
              const input = e.target.value
              setEmail(input)
            }}
          />
        </StyledEmailInput>
        <br />
        {error.message !== '' && (
          <AlertGroup>
            <Alert message={error.message} type="error" closable showIcon />
          </AlertGroup>
        )}
        {success && (
          <AlertGroup>
            <Alert
              message="Please check your email for the reset link. It might be in your spam folder!"
              type="success"
              showIcon
            />
          </AlertGroup>
        )}
        <ButtonDiv>
          <Button type="primary" style={LongButton} onClick={changePasswordHandler}>
            Send Reset Link
          </Button>
        </ButtonDiv>
      </ForgetPasswordContainer>
    </div>
  )
}
