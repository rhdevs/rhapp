export const getReadableSupperGroupId = (supperGroupId?: number | string) => {
  if (!supperGroupId) {
    return 'RHSO#'
  }
  const readableSupperGroupId = '0000000000' + supperGroupId
  return String('RHSO#' + readableSupperGroupId.substr(-4))
}
