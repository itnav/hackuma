import { NextApiRequest, NextApiResponse } from 'next'

type Data = { revalidate: boolean }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log('Revalidating posts page...')
  let revalidate = false
  try {
    await res.revalidate('/posts')
    revalidate = true
  } catch (error) {
    console.error(error)
  }
  res.json({ revalidate })
}
