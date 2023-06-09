import { supabase } from '../utils/supabase'
import { useMutation } from 'react-query'
import { v4 as uuidv4 } from 'uuid'

export const useCreateFileMutation = () => {
  /**
   * 指定されたアップロードパスにファイルをアップロードします。
   * @param {Object} arg - 引数オブジェクト
   * @param {File} arg.file - アップロードするファイル
   * @param {string} arg.uploadPath - ファイルのアップロードパス
   * @returns {Promise<any>} - アップロードされたデータ
   * @throws {Error} - アップロード中にエラーが発生した場合にスローされる
   */
  return useMutation(
    async (arg: { file: File; uploadPath: string }) => {
      const { data, error } = await supabase.storage
        .from('files')
        .upload(`${arg.uploadPath}/${uuidv4()}`, arg.file)

      if (error) throw new Error(error.message)
      return data
    },
    {
      onError: (err: TypeError) => {
        alert(err.message)
      },
    }
  )
}

export const useDeleteFileMutation = () => {
  /**
   * 指定されたファイルパスのファイルを削除します。
   * @param {string[]} thumbnailPaths - 削除するファイルパス
   */
  return useMutation(
    async (thumbnailPaths: string[]) => {
      const { data, error } = await supabase.storage
        .from('files')
        .remove(thumbnailPaths)

      if (error) throw new Error(error.message)
      return data
    },
    {
      onError: (err: TypeError) => {
        alert(err.message)
      },
    }
  )
}
