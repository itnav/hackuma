import * as PaletteColorOptions from '@mui/material/styles/createPalette'

// PaletteOptions を拡張して、カラーキーワードを追加
declare module '@mui/material/styles/createPalette' {
  interface PaletteOptions {
    colorOutLineGray?: PaletteColorOptions
  }
}
