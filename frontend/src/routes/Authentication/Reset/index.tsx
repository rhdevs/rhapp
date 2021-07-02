import React, { useState } from 'react'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import styled from 'styled-components'
import 'antd/dist/antd.css'
import { Input, Space, Button, Alert } from 'antd'
import { useParams, useHistory } from 'react-router-dom'
import { post, ENDPOINTS, DOMAINS } from '../../../store/endpoints'

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
  justify-content: 'center';
  align-items: 'center';
`
const AlertGroup = styled.div`
  margin: 0px;
`

const handleClick = () => {
  alert('Comfirmation Modal HERE')
}

export default function ChangePassword() {
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState({ message: '' })
  const history = useHistory()
  const params = useParams<{ resetToken: string }>()

  const handleSubmission = () => {
    if (password1 !== password2) {
      setError({ message: 'Passwords do not match' })
      return
    }
    post(ENDPOINTS.RESET_PASSWORD, DOMAINS.AUTH, {})
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp.status === 'failed') {
          throw resp.err
        } else {
          history.push('/')
        }
      })
      .catch((err) => {
        console.log(err)
        setError({ message: 'Something went wrong' })
      })
  }

  return (
    <>
      <TopNavBar title={'Reset Password'} leftIcon={true} />
      <MainContainer>
        {error.message !== '' && (
          <AlertGroup>
            <Alert message={error.message} type="error" closable showIcon />
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
