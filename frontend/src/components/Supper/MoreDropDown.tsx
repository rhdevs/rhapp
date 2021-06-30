import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import styled from 'styled-components'
import { Dropdown, Menu } from 'antd'
import { DeleteOutlined, MoreOutlined, ShareAltOutlined } from '@ant-design/icons'
import redEditIcon from '../../assets/RedSupperEditIcon.svg'
import doorIcon from '../../assets/supper/DoorIcon.svg'
import { V1_RED } from '../../common/colours'
import { PATHS } from '../../routes/Routes'
import { UserType } from '../../store/supper/types'

const Icon = styled.img<{ height?: string; paddingLeft?: string; verticalAlign?: string }>`
  padding: 0 7px 0 ${(props) => props.paddingLeft ?? '2px'};
  height: ${(props) => props.height ?? '15px'};
  ${(props) => props.verticalAlign && `vertical-align: ${props.verticalAlign};`}
`

type Props = {
  ownerId: string | undefined
  userIdList: string[] | undefined
  supperGroupId: number | undefined
  shareModalSetter: React.Dispatch<React.SetStateAction<boolean>>
  deleteModalSetter: React.Dispatch<React.SetStateAction<boolean>>
  leaveModalSetter: React.Dispatch<React.SetStateAction<boolean>>
}

export const MoreDropDown = (props: Props) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const history = useHistory()
  let userType
  if (props.ownerId === localStorage.userID) {
    userType = UserType.OWNER
  } else if (props.userIdList?.includes(localStorage.userID)) {
    userType = UserType.USER
  } else {
    userType = UserType.WATCHER
  }

  const antdIconStyling = { color: V1_RED, margin: 'auto 5px auto 0', verticalAlign: 'text-top', fontSize: '18px' }

  const onEditClick = () => {
    setIsVisible(false)
    history.push(`${PATHS.EDIT_SUPPER_GROUP}/${props.supperGroupId}`)
  }
  const editIcon = <Icon src={redEditIcon} alt="Edit Icon" />

  const onDeleteClick = () => {
    setIsVisible(false)
    setTimeout(() => props.deleteModalSetter(true), 200)
  }
  const deleteIcon = <DeleteOutlined style={antdIconStyling} />

  const onShareClick = () => {
    setIsVisible(false)
    setTimeout(() => props.shareModalSetter(true), 200)
  }
  const shareIcon = <ShareAltOutlined style={antdIconStyling} />

  const onLeaveGroup = () => {
    setIsVisible(false)
    setTimeout(() => props.leaveModalSetter(true), 200)
  }

  const leaveIcon = <Icon src={doorIcon} alt="Leave Icon" height="19px" paddingLeft="0" verticalAlign="sub" />
  const content = () => {
    switch (userType) {
      case UserType.OWNER:
        return (
          <Menu>
            <Menu.Item key="0" onClick={onEditClick}>
              {editIcon} Edit Group
            </Menu.Item>
            <Menu.Item key="1" onClick={onDeleteClick}>
              {deleteIcon} Delete Group
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="2" onClick={onShareClick}>
              {shareIcon} Share Group
            </Menu.Item>
          </Menu>
        )
      case UserType.USER:
        return (
          <Menu>
            <Menu.Item key="0" onClick={onLeaveGroup}>
              {leaveIcon}Leave Group
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="2" onClick={onShareClick}>
              {shareIcon} Share Group
            </Menu.Item>
          </Menu>
        )
      case UserType.WATCHER: //fallthrough
      default:
        return (
          <Menu>
            <Menu.Item key="0">{shareIcon} Share Group</Menu.Item>
          </Menu>
        )
    }
  }

  return (
    <Dropdown visible={isVisible} overlay={content} trigger={['click']}>
      <MoreOutlined
        onClick={(e) => {
          e.preventDefault()
          setIsVisible(true)
        }}
        style={{ position: 'absolute', transform: 'rotate(90deg)', right: '18px', fontSize: '18px' }}
      />
    </Dropdown>
  )
}
