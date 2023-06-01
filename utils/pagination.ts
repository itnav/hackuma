/**
 * ページネーションの開始位置と終了位置を計算する
 * @param page ページ番号
 * @param limit 1ページあたりの表示数
 * @returns
 */
export const calculatePaginationRange = (page: number, limit: number) => {
  const start = limit * (page - 1)
  const end = start + limit - 1
  return { start, end }
}
