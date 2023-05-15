// TODO：サンプル→コンポーネントの再利用性を考慮して、TextFieldをラップしたコンポーネントを作成
import React, { FC } from 'react'
import { TextField, TextFieldVariants } from '@mui/material'

// import style from '../../styles/common/text-field.module.scss'
import { concatClassName } from '@/utils/className'

interface Props {
  value: string
  type: string
  required?: boolean
  variant?: TextFieldVariants
  className?: string
  onChangeFunc: (value: string) => void
}
export const TextFieldComponent: FC<Props> = ({
  value,
  type,
  required,
  variant,
  className,
  onChangeFunc,
}) => {
  return (
    <TextField
      // className={concatClassName(style['text-field'], className)}
      type={type}
      required={required ? required : false}
      variant={variant ? variant : 'outlined'}
      value={value}
      onChange={(e) => {
        onChangeFunc(e.target.value)
      }}
    />
  )
}

export default TextFieldComponent
