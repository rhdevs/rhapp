import React from 'react'
import { Avatar as AntdAvatar } from 'antd'
import { useHistory } from 'react-router-dom'
import { PATHS } from '../../routes/Routes'

type AvatarProps = React.ComponentProps<typeof AntdAvatar> & {
  userId: string
}

export default function Avatar(props: AvatarProps) {
  const history = useHistory()
  const { userId, ...rest } = props

  const routeToProfile = () => {
    history.push(PATHS.PROFILE_PAGE + `${userId}`)
  }
  return (
    <div onClick={routeToProfile}>
      <AntdAvatar {...rest} />
    </div>
  )
}
