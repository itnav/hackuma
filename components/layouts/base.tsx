import { ReactNode, FC } from 'react'
import Head from 'next/head'
import AppHeader from '@/components/layouts/Header'
import { Container } from '@mui/material'
import style from '../../styles/common/component/layout/base.module.scss'

type Props = {
  title: string
  auth?: string
  children: ReactNode
}

export const Base: FC<Props> = ({ children, title }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <AppHeader />
      <main>
        <Container className={style['container']} maxWidth="xl">
          {children}
        </Container>
      </main>
    </div>
  )
}

export default Base
