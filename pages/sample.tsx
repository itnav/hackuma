import { Base } from '@/components/layouts/base'
import { Post } from '@/types/types'
import { supabase } from '@/utils/supabase'
import { GetStaticProps, NextPage } from 'next'

export const getStaticProps: GetStaticProps = async () => {
  console.log('getStaticProps/ssg invoked')

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
  const signOut = () => {
    supabase.auth.signOut()
  }

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
