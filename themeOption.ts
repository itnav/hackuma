import * as createPalette from '@mui/material/styles/createPalette'

// PaletteOptions を拡張して、カラーキーワードを追加
declare module '@mui/material/styles/createPalette' {
  interface PaletteOptions {
    neutral?: PaletteColorOptions
  }
  interface Palette {
    neutral: PaletteColor
  }
}

// Buttonのcolor-propに追加
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    neutral: true
  }
}
