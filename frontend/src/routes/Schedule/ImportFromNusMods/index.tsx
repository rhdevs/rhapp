import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'

import styled from 'styled-components'
import { PATHS } from '../../Routes'
import { setUserNusMods } from '../../../store/scheduling/action'
import LeftOutlined from '@ant-design/icons/lib/icons/LeftOutlined'
import nusmodsImportImage from '../../../assets/nusmodsImportImage.svg'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import Button from '../../../components/Mobile/Button'
import { RootState } from '../../../store/types'
import { ConfirmationModal } from '../../../components/Mobile/ConfirmationModal'

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

const ErrorText = styled.p`
  color: #ff837a;
  width: 100%;
  text-align: center;
`

const Input = styled.input`
  width: 100%;
  border-radius: 30px;
  padding: 5px 10px;
  margin: 10px 0;
  height: 35px;
`

export default function ImportFromNusMods() {
  const history = useHistory()
  const dispatch = useDispatch()
  const { nusModsIsSuccessful, nusModsIsFailure } = useSelector((state: RootState) => state.scheduling)
  const [modal, setModal] = useState(false)

  const leftIcon = (
    <LeftOutlined
      style={{ color: 'black', padding: '0 10px 0 0' }}
      onClick={() => {
        history.goBack()
      }}
    />
  )

  // const { nusModsIsSuccessful, nusModsIsFailure } = useSelector((state: RootState) => state.scheduling)

  // const getNusModsInputStatusnusModsIsSuccessful = () => {
  //   if (nusModsIsSuccessful === true && nusModsIsFailure === false) {
  //     return true
  //   } else if (nusModsIsSuccessful === false && nusModsIsFailure === true) {
  //     return false
  //   } else return false
  // }

  const { handleSubmit, register, errors, watch } = useForm()
  const onSubmit = () => {
    if (!errors.length) {
      setModal(!modal)
    }
  }

  useEffect(() => {
    if (nusModsIsSuccessful === true && nusModsIsFailure === false) {
      history.push(PATHS.SCHEDULE_PAGE)
    }
  }, [nusModsIsSuccessful, nusModsIsFailure])

  return (
    <Background>
      <TopNavBar title="NUSMods" leftIcon leftIconComponent={leftIcon} />
      <img alt="plusCircle" style={{ width: '90vw', display: 'flex', margin: '15px auto' }} src={nusmodsImportImage} />
      <BottomContainer>
        <form>
          {modal && (
            <ConfirmationModal
              title="Confirm Import?"
              hasLeftButton
              leftButtonText="Import"
              onLeftButtonClick={() => {
                dispatch(setUserNusMods(localStorage.getItem('userID'), watch('nusmodsLink')))
              }}
              rightButtonText="Cancel"
              onRightButtonClick={() => {
                setModal(false)
              }}
            />
          )}
          <LinkText>Copy link from NUSMods below:</LinkText>
          <Input
            type="text"
            placeholder="Enter link here..."
            name="nusmodsLink"
            ref={register({
              required: true,
              validate: (input) =>
                input.trim().length !== 0 && input.trim().indexOf('https://nusmods.com/timetable/') !== -1,
            })}
            style={{
              border: errors.nusmodsLink ? '1px solid red' : '1px solid #d9d9d9',
              background: errors.nusmodsLink && '#ffd1d1',
            }}
          />
          {errors.nusmodsLink && errors.nusmodsLink?.type !== 'validate' && (
            <ErrorText>NUSMods Link Required!</ErrorText>
          )}
          {errors.nusmodsLink?.type === 'validate' && <ErrorText>Invalid NUSMods link!</ErrorText>}

          <ButtonContainer>
            <Button
              stopPropagation
              hasSuccessMessage={false}
              defaultButtonDescription="Import"
              onButtonClick={() => {
                handleSubmit(onSubmit)()
              }}
              isFlipButton={false}
            />
          </ButtonContainer>
        </form>
      </BottomContainer>
      <BottomNavBar />
    </Background>
  )
}
