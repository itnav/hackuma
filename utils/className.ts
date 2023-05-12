export const concatClassName = (
  srcClassName: string,
  distClassName: string | undefined
) => {
  return srcClassName + distClassName ? ` ${distClassName}` : ''
}
