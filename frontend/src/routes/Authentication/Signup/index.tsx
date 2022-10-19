import React, { useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { Button, Input, Form, Select, Spin } from 'antd'
// import passwordHash from 'password-hash'
import { Alert } from 'antd'
import 'antd/dist/antd.css'
import { PATHS } from '../../Routes'
import sha256 from 'crypto-js/sha256'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { DOMAIN_URL, ENDPOINTS } from '../../../store/endpoints'

const MainContainer = styled.div`
  height: 110vh;
  width: 100vw;
  background-color: #fafaf4;
`

const AccountText = styled.text`
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
    letter-spacing: 0;
    text-align: center;
    width: 100%;
    border-radius: 8px;
    margin-top: 10px;
  }

  .ant-btn-primary:focus {
    border-color: #de5f4c;
    background: #de5f4c;
  }
`

const AlertGroup = styled.div`
  margin: 23px;
`

/**
 * A list of custom usernames for the Residential Fellows and Admins
 */
const ADMIN_USERNAMES = [
  'RFHTBS', // Evan
  'EPHCSLE', // Mr Ezra
  'BIEYHY', // Prof Yu
  'CEECSC', // Prof Darren
  'EPHFM', // Prof Mornin
  'GROLC', // Prof Linda
  'ISSNTT', // Prof Tin
]

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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState({ message: '' })
  // const { name, email, password, password2 } = formData

  const onChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.name === 'userId' ? e.target.value.trim().toUpperCase() : e.target.value
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === 'userId'
          ? e.target.value.toUpperCase()
          : e.target.name === 'email'
          ? e.target.value.toLowerCase()
          : e.target.value,
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
    const passwordHash = sha256(formData.password).toString()

    const newUser = {
      userID: formData.userId,
      passwordHash: passwordHash,
      email: formData.email.trim().toLowerCase(),
      // position: [0], //0 = 'Resident'
      displayName: formData.display.trim(),
      bio: formData.bio.trim(),
      block: parseInt(formData.block),
      telegramHandle: formData.telegram.trim(),
    }
    try {
      await fetch(DOMAIN_URL.AUTH + ENDPOINTS.REGISTER, {
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
            fetch(DOMAIN_URL.AUTH + ENDPOINTS.LOGIN, {
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
                setIsLoading(false)
              })
              .catch((err) => {
                setError({ message: err })
                setIsLoading(false)
              })
          } else if (data.status === 401) {
            setError({ message: 'This user already has an account.' })
            setIsLoading(false)
          } else {
            setError({ message: 'Server Error! Contact a RHDEVS member for assistance!' })
            setIsLoading(false)
          }
        })
        .catch((err) => {
          setError({ message: err })
          setIsLoading(false)
        })
    } catch (err) {
      setError({ message: err as any })
      setIsLoading(false)
    }
  }

  const isValidUserID = (userId) => {
    return (
      userId.match(/^A\d{7}[A-Z]$/) || // Check if User ID is Axxxxxx
      userId.match(/^E\d{7}$/) || //  Else Check for Exxxx ID
      ADMIN_USERNAMES.includes(userId) //  Else check if it's any of the RFs or Admins
    )
  }

  const checkRegisterInfo = (formData) => {
    if (formData.password !== formData.password2) {
      setError({ message: 'Password does not match!' })
      return false
    }
    if (!(formData.email && formData.userId && formData.password && formData.password2)) {
      setError({ message: 'All fields are compulsory!' })
      return false
    }
    if (!formData.email.match(/^.+@u\.nus\.edu$/) && !formData.email.match(/^.+@nus\.edu\.sg$/)) {
      setError({ message: 'Please check if your NUS Email Domain is @u.nus.edu or @nus.edu.sg' })
      return false
    }
    if (!isValidUserID(formData.userId)) {
      setError({ message: 'Please check that your NUS ID is your matriculation number' })
      return false
    }
    // WRONG PLACE TO CHECK TELE HANDLE
    // if (!formData.telegramHandle.match(/^[A-Za-z0-9_]+$/)) {
    //   setError({ message: 'Please check your telegram handle is valid and does not contain the @symbol' })
    //   pass = false
    //   return pass
    // }
    return true
  }

  return (
    <>
      <MainContainer>
        {pageNum.page === 1 && <TopNavBar title="Sign Up" />}
        {pageNum.page === 2 && <TopNavBar title="Almost Done!" leftIcon />}
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
              />
              <br /> <br />
              <AccountText>NUS ID</AccountText>
              <Input
                placeholder="E1234567"
                name="userId"
                style={{ borderRadius: '10px' }}
                value={formData.userId}
                onChange={(e) => onChange(e)}
              />
              <br />
              <br />
              <AccountText>Password</AccountText>
              <Input.Password
                placeholder="Password"
                name="password"
                style={{ borderRadius: '10px' }}
                value={formData.password}
                onChange={(e) => onChange(e)}
              />
              <br /> <br />
              <AccountText>Confirm Password</AccountText>
              <Input.Password
                placeholder="Confirm Password"
                name="password2"
                style={{ borderRadius: '10px' }}
                value={formData.password2}
                onChange={(e) => onChange(e)}
              />
              <br /> <br />
              <PostButton>
                <Button
                  style={{ color: '#de5f4c' }}
                  type="link"
                  onClick={() => {
                    const pass = checkRegisterInfo(formData)
                    if (pass) {
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
              />
              <br /> <br />
              <AccountText>Telegram Handle</AccountText>
              <Input
                placeholder="xiaomaomaozxc"
                name="telegram"
                style={{ borderRadius: '10px' }}
                value={formData.telegram}
                onChange={(e) => onChange(e)}
              />
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
              />
              <br />
              <br />
              <PostButton>
                {isLoading && <Spin />}
                {!isLoading && (
                  <Button
                    type="primary"
                    block
                    onClick={(e) => {
                      setIsLoading(true)
                      if (
                        !formData.display ||
                        formData.display.trim() === '' ||
                        !formData.telegram ||
                        formData.bio === ''
                      ) {
                        setError({ message: 'All fields are compulsory!' })
                        setIsLoading(false)
                      } else {
                        onSubmit(e)
                      }
                    }}
                  >
                    Sign Up
                  </Button>
                )}
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
