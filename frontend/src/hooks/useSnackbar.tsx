/**
 * Customized set of snackbars based off Ant Design's message component,
 * provided as a React Hook.
 * 
 * E.g.
 * 
 * import useSnackbar from 'relative-file-path'
 * 
 * function Component() {
 * 
 *  const [success] = useSnackbar()
 * 
 *  const handleSuccessfulAction = () => { 
 *    // ...  
 *    success('Success!')
 *  }
 * 
 *  //...
 * }
 * 

 */

import React, { ReactElement } from 'react'
import styled from 'styled-components'
import 'antd/dist/antd.css'

import { message } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const StyledText = styled.text`
  font-size: 17px;
  font-weight: 200;
`

export default function useSnackbar(type: string, icon?: ReactElement) {
  const success = (content: string) => {
    const styledContent = <StyledText>{content}</StyledText>
    message.success({
      content: styledContent,
      icon: <CheckCircleOutlined style={{ color: '#002642', fontSize: 20 }} />,
      style: {
        marginTop: 30,
      },
    })
  }

  const error = (content: string) => {
    const styledContent = <StyledText>{content}</StyledText>
    message.error({
      content: styledContent,
      icon: <CloseCircleOutlined style={{ color: '#002642', fontSize: 20 }} />,
      style: {
        marginTop: 30,
      },
    })
  }

  const warning = (content: string) => {
    const styledContent = <StyledText>{content}</StyledText>
    message.warning({
      content: styledContent,
      icon: <ExclamationCircleOutlined style={{ color: '#002642', fontSize: 20 }} />,
      style: {
        marginTop: 30,
      },
    })
  }

  const custom = (content: string) => {
    const styledContent = <StyledText>{content}</StyledText>
    message.warning({
      content: styledContent,
      icon: <div style={{ color: '#002642', fontSize: 20 }}>{icon}</div>,
      style: {
        marginTop: 30,
      },
    })
  }

  if (type === 'success') {
    return [success]
  } else if (type === 'warning') {
    return [warning]
  } else if (type === 'error') {
    return [error]
  } else {
    return [custom]
  }
}
