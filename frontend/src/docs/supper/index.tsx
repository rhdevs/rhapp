import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import styled from 'styled-components'
import Markdown from 'markdown-to-jsx'

const Background = styled.div`
  background-color: #f1f1f1 !important;
  padding: 50px;
`

const Supper_Documentation = () => {
  const params = useParams<{ file: string }>()
  const file_name = `${params.file}.md`
  const [readme, setReadme] = useState('')

  useEffect(() => {
    import(`./${file_name}`)
      .then((res) => {
        fetch(res.default)
          .then((res) => res.text())
          .then((res) => setReadme(res))
          .catch((err) => console.log(err))
      })
      .catch((err) => console.log(err))
  })

  return (
    <Background>
      <Markdown>{readme}</Markdown>
    </Background>
  )
}

export default Supper_Documentation
