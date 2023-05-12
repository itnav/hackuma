import { ReactNode, FC } from 'react'
import Head from 'next/head'
import Header from '@/components/layouts/header'
import { Container } from '@mui/material'
import style from '../../styles/common/component/layout/base.module.scss'

type Title = {
  title: string
  auth?: string
  children: ReactNode
}

export const Base: FC<Title> = ({ children, title }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <Header />
      <main>
        <Container className={style['container']} maxWidth="xl">
          {children}
        </Container>
      </main>
    </div>
  )
}

export default Base
