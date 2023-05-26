import { Base } from '@/components/layouts/base'
import { Post } from '@/types/types'
import { supabase } from '@/utils/supabase'
import { GetStaticProps, NextPage } from 'next'
import CardOfPost from '@/components/elements/card/post'
import style from '../styles/pages/top.module.scss'

export const getStaticProps: GetStaticProps = async () => {
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: true })

  return { props: { posts } }
}

type StaticProps = {
  posts: Post[]
}

const Sample: NextPage<StaticProps> = ({ posts }) => {
  return (
    <Base title="Sample （SSG）">
      <ul className={style.cards}>
        {posts &&
          posts.map((post) => (
            <li key={post.id}>
              <CardOfPost post={post} />
            </li>
          ))}
      </ul>
    </Base>
  )
}

export default Sample
