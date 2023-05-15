import { Base } from '@/components/layouts/base'
import { useAuthWatcher } from '@/hooks/useAuthWatcher'
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

const Dashboard: NextPage<StaticProps> = ({ posts }) => {
  const { data: user, reset: resetUser } = useAuthWatcher()

  const signOut = () => {
    supabase.auth.signOut()
    resetUser()
  }

  return (
    <Base title="ダッシュボード">
      <h2>Dashboard</h2>

      {(user && <p>{user.email}</p>) || <p>no user</p>}
      {/* ログアウトボタン */}
      <button onClick={signOut}>ログアウト</button>

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

export default Dashboard
