import React from 'react'
import { Avatar as AntdAvatar } from 'antd'
import { useHistory } from 'react-router-dom'
import { PATHS } from '../../routes/Routes'

type AvatarProps = React.ComponentProps<typeof AntdAvatar>

export default function Avatar(props: AvatarProps) {
  const history = useHistory()

  const routeToProfile = () => {
    history.push(PATHS.PROFILE_PAGE) // TODO: add account id to path to differentiate between unique profiles
  }
  return (
    <div onClick={routeToProfile}>
      <AntdAvatar {...props} />
    </div>
  )
}
