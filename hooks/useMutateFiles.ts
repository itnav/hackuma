import { supabase } from '../utils/supabase'
import { useMutation } from 'react-query'
import { v4 as uuidv4 } from 'uuid'

export const useMutateFiles = () => {
  /**
   * 指定されたアップロードパスにファイルをアップロードします。
   * @param {Object} arg - 引数オブジェクト
   * @param {File} arg.file - アップロードするファイル
   * @param {string} arg.uploadPath - ファイルのアップロードパス
   * @returns {Promise<any>} - アップロードされたデータ
   * @throws {Error} - アップロード中にエラーが発生した場合にスローされる
   */
  const createFileMutation = useMutation(
    async (arg: { file: File; uploadPath: string }) => {
      const { data, error } = await supabase.storage
        .from('files')
        .upload(`${arg.uploadPath}/${uuidv4()}`, arg.file)

      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: () => {
        console.log('success')
        // revalidateList()
      },
      onError: (err: TypeError) => {
        alert(err.message)
      },
    }
  )

  /**
   * 指定されたファイルパスのファイルを削除します。
   * @param {string[]} thumbnailPath - 削除するファイルパス
   */
  const deleteFileMutation = useMutation(
    async (thumbnailPath: string[]) => {
      const { error } = await supabase.storage
        .from('files')
        .remove(thumbnailPath)

      if (error) throw new Error(error.message)
    },
    {
      onSuccess: () => {
        // revalidateList()
      },
      onError: (err: TypeError) => {
        alert(err.message)
      },
    }
  )

  return {
    createFileMutation,
    deleteFileMutation,
  }
}
