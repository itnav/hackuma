import { Base } from '@/components/layouts/Base'
import { Post } from '@/types/types'
import { supabase } from '@/utils/supabase'
import { GetStaticProps, NextPage } from 'next'

export const getStaticProps: GetStaticProps = async () => {
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('id', { ascending: true })

  return { props: { posts } }
}

type StaticProps = {
  posts: Post[]
}

const Login: NextPage<StaticProps> = ({ posts }) => {
  return (
    <Base title="Login （SSG）">
      <ul>
        {posts &&
          posts.map((post) => (
            <li key={post.id}>
              <a href={`/posts/${post.id}`}>{post.title}</a>
            </li>
          ))}
      </ul>
    </Base>
  )
}

export default Login
