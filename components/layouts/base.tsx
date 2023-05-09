import { ReactNode, FC } from 'react'
import Head from 'next/head'
type Title = {
  title: string
  children: ReactNode
}
export const Base: FC<Title> = ({ children, title }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <header></header>
      <main>{children}</main>
      <footer>
        <div>footer</div>
      </footer>
    </div>
  )
}
