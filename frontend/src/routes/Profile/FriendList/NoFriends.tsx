import React from 'react'
import styled from 'styled-components'
import Frown from '../../../assets/Frown.svg'
import { Button } from 'antd'
import 'antd/dist/antd.css'

const SearchButtonStyle = {
  size: 'large',
  backgroundColor: '#DE5F4C',
  borderColor: '#DE5F4C',
  width: '25vw',
  boxShadow: '0px 2px 0px rgba(0, 0, 0, 0.043)',
  borderRadius: '8px',
}

const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 3vh;
  margin-bottom: 6vh;
  text-align: center;
`

const FrownDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`

const OuterDiv = styled.div`
  position: absolute;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

export default function NoFriends({ handleSearch }: { handleSearch: () => void }) {
  return (
    <OuterDiv>
      <FrownDiv>
        <img alt="frown" style={{ width: 150 }} src={String(Frown)} />
      </FrownDiv>
      <p style={{ marginTop: '5vh' }}>No friends here - but let&apos;s look for some!</p>
      <ButtonDiv>
        <Button type="primary" style={SearchButtonStyle} onClick={handleSearch}>
          Search
        </Button>
      </ButtonDiv>
    </OuterDiv>
  )
}
