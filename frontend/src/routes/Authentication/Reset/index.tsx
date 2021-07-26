import React, { useState, useEffect } from 'react'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import styled from 'styled-components'
import 'antd/dist/antd.css'
import { Input, Space, Button, Alert } from 'antd'
import { useParams, useHistory } from 'react-router-dom'
import { post, ENDPOINTS, DOMAINS, get } from '../../../store/endpoints'
import sha256 from 'crypto-js/sha256'
import InvalidToken from '../../ErrorPages/InvalidToken'

const MainContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #fafaf4;
  display: flex;
  flex-direction: column;
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

const ButtonDiv = styled.div`
  display: flex
  justify-content: center;
  align-items: center;
`
const AlertGroup = styled.div`
  margin: 0px;
`

export default function ChangePassword() {
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState({ message: '' })
  const [validToken, setTokenValidity] = useState(true)
  const [success, setSuccess] = useState(false)
  const history = useHistory()
  const params = useParams<{ resetToken: string }>()

  useEffect(() => {
    get(ENDPOINTS.RESET_PASSWORD, DOMAINS.AUTH, `/${params.resetToken}`)
      .then((resp) => {
        console.log(resp)
        if (resp.status !== 'success') {
          setTokenValidity(false)
        }
      })
      .catch((err) => {
        console.log(err)
        setTokenValidity(false)
      })
  }, [])

  const handleSubmission = () => {
    if (password1 !== password2) {
      setError({ message: 'Passwords do not match' })
      return
    }
    const requestBody = {
      newPasswordHash: sha256(password1).toString(),
    }
    post(ENDPOINTS.RESET_PASSWORD, DOMAINS.AUTH, requestBody, {}, `/${params.resetToken}`)
      .then((resp) => {
        if (resp.status !== 'success') {
          setError({ message: resp.message })
        } else {
          setSuccess(true)
        }
      })
      .catch((err) => {
        console.log(err)
        setError({ message: 'Something went wrong' })
      })
  }

  return !validToken ? (
    <InvalidToken />
  ) : (
    <>
      <TopNavBar title={'Reset Password'} leftIcon={true} />
      <MainContainer>
        {error.message !== '' && (
          <AlertGroup>
            <Alert message={error.message} type="error" closable showIcon />
          </AlertGroup>
        )}
        {success && (
          <AlertGroup>
            <Alert message={'Success! Your password has been changed.'} type="success" showIcon />
          </AlertGroup>
        )}
        <div>
          <Space direction="vertical">
            <Input.Password
              placeholder="New Password"
              style={{ width: '80vw', borderRadius: '20px', left: '10%' }}
              onChange={(event) => setPassword1(event.target.value)}
            />
            <Input.Password
              placeholder="Confirm Password"
              style={{ width: '80vw', borderRadius: '20px', verticalAlign: 'middle', left: '10%' }}
              onChange={(event) => setPassword2(event.target.value)}
            />
          </Space>
        </div>
        <ButtonDiv>
          <Button type="primary" style={LongButton} onClick={handleSubmission}>
            Change
          </Button>
        </ButtonDiv>
      </MainContainer>
    </>
  )
}
