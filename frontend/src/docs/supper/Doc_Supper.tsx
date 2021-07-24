import React, { useEffect, useState } from 'react'
import Markdown from 'markdown-to-jsx'
import styled from 'styled-components'

const Background = styled.div`
  background-color: #f1f1f1 !important;
  padding: 50px;
`

function Doc_Supper() {
  const file_name = 'actions.md'
  const [post, setPost] = useState('')

  useEffect(() => {
    import(`./${file_name}`)
      .then((res) => {
        fetch(res.default)
          .then((res) => res.text())
          .then((res) => setPost(res))
          .catch((err) => console.log(err))
      })
      .catch((err) => console.log(err))
  })

  return (
    <Background>
      <Markdown>{post}</Markdown>
    </Background>
  )
}

export default Doc_Supper
