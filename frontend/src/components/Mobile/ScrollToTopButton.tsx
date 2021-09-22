import React from 'react'
import UpOutlined from '@ant-design/icons/lib/icons/UpOutlined'
import styled from 'styled-components'

const Button = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  height: 30px;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 70px;
  right: 20px;
  z-index: 1001;
`

export default function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo(0, 0)
  }

  return (
    <Button onClick={scrollToTop}>
      <UpOutlined style={{ color: 'white', fontSize: 20 }} />
    </Button>
  )
}
