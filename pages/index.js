import Head from 'next/head'
import Router from 'next/router'

export default function Home() {
  const handle_route = (e) => {
    e.preventDefault()
    Router.push('/blog')
  }


  return (
    <div>
      <h1>index</h1>
      <ul>
        <li onClick={handle_route}>Blog</li>
      </ul>
    </div>
  )
}
