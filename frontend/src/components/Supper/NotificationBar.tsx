import React, { useEffect, useState } from 'react'

import styled from 'styled-components'
import CloseOutlined from '@ant-design/icons/lib/icons/CloseOutlined'
import { useHistory } from 'react-router-dom'
import { PATHS } from '../../routes/Routes'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/types'
import { getSupperNotifications } from '../../store/supper/action/level1/getReqests'
import { closeSupperNotification } from '../../store/supper/action/level1/deleteRequests'
import { NotificationType } from '../../store/supper/types'

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
  max-width: 95%
  word-break: break-word;
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
  const [notifText, setNotifText] = useState<JSX.Element>(<></>)
  const { supperNotifications } = useSelector((state: RootState) => state.supper)
  const onNotifClick = () => {
    const supperGroupId = supperNotifications[0].supperGroupId
    setIsVisible(false)
    dispatch(closeSupperNotification(supperNotifications[0].supperGroupId))
    //TODO: Currently it will only open the first notification, should have an interface for when there is more than 1
    history.replace(`${PATHS.VIEW_ORDER}/${supperGroupId}`)
  }

  const onCloseClick = () => {
    //Close notification
    setIsVisible(false)
    dispatch(closeSupperNotification(supperNotifications[0].supperGroupId))
  }

  useEffect(() => {
    dispatch(getSupperNotifications())
  }, [dispatch])

  useEffect(() => {
    if (supperNotifications.length) {
      setIsVisible(true)
      if (supperNotifications[0].notification === NotificationType.FOOD) {
        setNotifText(
          <HeaderText>
            {supperNotifications[0].ownerName} updated your order in{' '}
            <GroupNameText>{supperNotifications[0].supperGroupName}</GroupNameText>
          </HeaderText>,
        )
      } else if (supperNotifications[0].notification === NotificationType.UPDATE) {
        setNotifText(
          <HeaderText>
            <GroupNameText>{supperNotifications[0].supperGroupName}</GroupNameText> has been updated!
          </HeaderText>,
        )
      } else {
        setIsVisible(false)
      }
    }
  }, [supperNotifications])

  return (
    <Container>
      {isVisible && (
        <MainContainer>
          <LeftContainer onClick={onNotifClick}>
            {notifText}
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
