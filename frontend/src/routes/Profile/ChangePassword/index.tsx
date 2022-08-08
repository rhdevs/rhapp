import React from 'react'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import styled from 'styled-components'
import 'antd/dist/antd.css'
import { Input, Space, Button } from 'antd'

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

const handleClick = () => {
  alert('Comfirmation Modal HERE')
}

export default class ChangePassword extends React.Component {
  render() {
    return (
      <>
        <TopNavBar title="Change Password" leftIcon={true} />
        <MainContainer>
          <div>
            <Space direction="vertical">
              <Input.Password placeholder="Old Password" style={{ width: '80vw', borderRadius: '20px', left: '10%' }} />
              <Input.Password placeholder="New Password" style={{ width: '80vw', borderRadius: '20px', left: '10%' }} />
              <Input.Password
                placeholder="Confirm Password"
                style={{ width: '80vw', borderRadius: '20px', verticalAlign: 'middle', left: '10%' }}
              />
            </Space>
          </div>
          <ButtonDiv>
            <Button type="primary" style={LongButton} onClick={handleClick}>
              Change
            </Button>
          </ButtonDiv>
        </MainContainer>
        <BottomNavBar />
      </>
    )
  }
}
