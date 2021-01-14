import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { LeftOutlined } from '@ant-design/icons'
import nusmodsImportImage from '../../../assets/nusmodsImportImage.svg'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import styled from 'styled-components'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import InputRow from '../../../components/Mobile/InputRow'
import Button from '../../../components/Mobile/Button'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store/types'
import { setUserNusModsLink, getUserNusModsEvents } from '../../../store/scheduling/action'
import ConfirmationModal from '../../../components/Mobile/ConfirmationModal'
import { PATHS } from '../../Routes'

const Background = styled.div`
  background-color: #fafaf4;
  height: 100vh;
  width: 100vw;
`

const BottomContainer = styled.div`
  padding: 30px;
  height: 30vh;
  left: 0;
`

const LinkText = styled.text`
  font-family: Inter;
  color: black;
  font-weight: 200;
  font-size: 17px;
  line-height: 22.5px;
  padding-left: 5px;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10vh;
`

export default function ImportFromNusMods() {
  const history = useHistory()
  const dispatch = useDispatch()

  const [link, setLink] = useState('')
  const [modal, setModal] = useState(false)

  const leftIcon = (
    <LeftOutlined
      style={{ color: 'black', padding: '0 10px' }}
      onClick={() => {
        history.goBack()
      }}
    />
  )

  return (
    <Background>
      <TopNavBar title={'NUSMods'} leftIcon={true} leftIconComponent={leftIcon} />
      <img alt="plusCircle" style={{ width: '90vw', display: 'flex', margin: '15px auto' }} src={nusmodsImportImage} />
      <BottomContainer>
        {modal && (
          <ConfirmationModal
            title={'Confirm Import?'}
            hasLeftButton={true}
            leftButtonText={'Import'}
            onLeftButtonClick={() => {
              dispatch(setUserNusModsLink(link))
              dispatch(getUserNusModsEvents())
              history.push(PATHS.SCHEDULE_PAGE)
            }}
            rightButtonText={'Cancel'}
            onRightButtonClick={() => {
              setModal(false)
            }}
          />
        )}
        <LinkText>Copy link from NUSMods below:</LinkText>
        <InputRow placeholder={'Enter link here...'} value={link} setValue={setLink} />
        <ButtonContainer>
          <Button
            stopPropagation={true}
            hasSuccessMessage={false}
            defaultButtonDescription={'Import'}
            onButtonClick={() => {
              setModal(!modal)
              console.log(modal)
            }}
            isFlipButton={false}
          />
        </ButtonContainer>
      </BottomContainer>
      <BottomNavBar />
    </Background>
  )
}
