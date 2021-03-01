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

const StyledText = styled.text`
  font-size: 17px;
  font-weight: 200;
`

export default function useSnackbar(type: string, icon?: ReactElement) {
  const success = (content: string) => {
    const styledContent = <StyledText>{content}</StyledText>
    message.success({
      content: styledContent,
    })
  }

  const error = (content: string) => {
    const styledContent = <StyledText>{content}</StyledText>
    message.error({
      content: styledContent,
    })
  }

  const warning = (content: string) => {
    const styledContent = <StyledText>{content}</StyledText>
    message.warning({
      content: styledContent,
    })
  }

  const custom = (content: string) => {
    const styledContent = <StyledText>{content}</StyledText>
    message.success({
      content: styledContent,
      icon: <div style={{ color: '#002642', fontSize: 20 }}>{icon}</div>,
    })
  }

  /**
   * Add more custom types of snackbars over here (e.g. error, warning)
   * Return them as such: [success, error, warning, etc...]
   */

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
