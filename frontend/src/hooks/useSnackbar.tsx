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

import React from 'react'
import styled from 'styled-components'
import 'antd/dist/antd.css'

import { message } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'

const StyledText = styled.text`
  font-size: 17px;
  font-weight: 200;
`

export default function useSnackbar() {
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

  /**
   * Add more custom types of snackbars over here (e.g. error, warning)
   * Return them as such: [success, error, warning, etc...]
   */

  return [success]
}
