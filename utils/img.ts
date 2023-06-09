import blankImg from '../imgs/blank.png'

/**
 * 引数があれば画像のパスを返し、なければブランク画像を返す
 * @param {string | null} path - 画像のパス（supabaseの files/ 以下）
 * @param {boolean} returnBlankImg - 画像がない場合にブランク画像を返すかどうか
 * @returns {StaticImageData | string } - 画像のパスまたはブランク画像データ
 */
export const getImgPath = (path: string | null, returnBlankImg = true) => {
  const baseURL =
    'https://tpkboyehtconbkzyhcpp.supabase.co/storage/v1/object/public/files'
  if (path) return `${baseURL}/${path}`
  if (returnBlankImg) return blankImg
  return ''
}

/**
 * ファイルをプレビューする
 * @param {React.ChangeEvent<HTMLInputElement>} event - イベント
 * @param {React.Dispatch<React.SetStateAction<any>>} setFile - ファイルをセットする関数
 * @returns {void}
 */
export const previewFile = (
  event: React.ChangeEvent<HTMLInputElement>,
  setFileFunction: React.Dispatch<React.SetStateAction<any>>
) => {
  if (event.target.files !== null) {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      // imagePreviewに読み込み結果（データURL）を代入する
      if (!e.target || !e.target.result) return
      setFileFunction(e.target.result)
    }
    reader.readAsDataURL(file)
  }
}
