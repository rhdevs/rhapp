import React from 'react'
import styled from 'styled-components'
import { Button } from 'antd'
import 'antd/dist/antd.css'

const LongButton = {
  size: 'large',
  backgroundColor: '#DE5F4C',
  borderColor: '#DE5F4C',
  width: '80vw',
  left: '5%',
  boxShadow: '0px 2px 0px rgba(0, 0, 0, 0.043)',
  borderRadius: '8px',
}

const ButtonDiv = styled.div`
  position: relative;
  margin-left: 5vw;
  margin-top: 3vh;
  margin-bottom: 6vh;
`

const EditProfileButton = ({ handleClick }: { handleClick: () => void }) => {
  return (
    <ButtonDiv>
      <Button type="primary" style={LongButton} onClick={handleClick}>
        Edit Profile
      </Button>
    </ButtonDiv>
  )
}

export default EditProfileButton
