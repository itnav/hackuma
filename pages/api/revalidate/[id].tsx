import { NextApiRequest, NextApiResponse } from 'next'

type Data = { revalidate: boolean }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log('Revalidating detail page...')
  const {
    query: { id },
  } = req
  let revalidate = false
  try {
    await res.revalidate(`/post/${id}`)
    revalidate = true
  } catch (error) {
    console.error(error)
  }
  res.json({ revalidate })
}
