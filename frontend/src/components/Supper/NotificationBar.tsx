import React, { useEffect, useState } from 'react'

import styled from 'styled-components'
import { CloseOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import { PATHS } from '../../routes/Routes'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/types'
import { closeSupperNotification, getSupperNotification } from '../../store/supper/action'

const Container = styled.div`
  position: fixed;
  left: 0;
  top: 4.5rem;
  width: 100%;
  z-index: 1000;
`

const MainContainer = styled.div`
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  width: 85vw;
  max-width: 400px;
  margin: auto;
  padding: 10px 15px;
  background-color: white;
  box-shadow: 0px 3px 6px -4px rgba(0, 0, 0, 0.12), 0px 6px 16px rgba(0, 0, 0, 0.08),
    0px 9px 28px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
`

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 95%;
`

const RightContainer = styled.div`
  flex: 5%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const HeaderText = styled.text`
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 18px;
`

const GroupNameText = styled.text`
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;
`

const DescriptionText = styled.text`
  font-style: normal;
  font-weight: 200;
  font-size: 13px;
  line-height: 18px;
  padding-top: 3px;
`

export const NotificationBar = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const { supperNotifications } = useSelector((state: RootState) => state.supper)
  const onNotifClick = () => {
    setIsVisible(false)
    //TODO: Currently it will only open the first notification, should have an interface for when there is more than 1
    history.push(`${PATHS.VIEW_ORDER}/${supperNotifications[0].supperGroupId}`)
  }

  const onCloseClick = () => {
    //Close notification
    setIsVisible(false)
    dispatch(closeSupperNotification(supperNotifications[0].supperGroupId))
  }

  useEffect(() => {
    dispatch(getSupperNotification())
  }, [dispatch])

  useEffect(() => {
    if (supperNotifications.length) setIsVisible(true)
  }, [supperNotifications])

  return (
    <Container>
      {isVisible && (
        <MainContainer>
          <LeftContainer onClick={onNotifClick}>
            <HeaderText>
              <GroupNameText>{supperNotifications[0].supperGroupName}</GroupNameText> has been updated!
            </HeaderText>
            <DescriptionText>Tap to view.</DescriptionText>
          </LeftContainer>
          <RightContainer>
            <CloseOutlined onClick={onCloseClick} />
          </RightContainer>
        </MainContainer>
      )}
    </Container>
  )
}
