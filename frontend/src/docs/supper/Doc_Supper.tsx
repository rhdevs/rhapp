import React, { useEffect, useState } from 'react'
import Markdown from 'markdown-to-jsx'

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
    <div className="container">
      <Markdown>{post}</Markdown>
    </div>
  )
}

export default Doc_Supper
