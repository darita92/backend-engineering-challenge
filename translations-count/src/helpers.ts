
export const substractMinutes = (date: Date, minutes: number) => {
  return new Date(date.getTime() - minutes * 60000)
}

export const formatWithoutMinutes = (date: Date) => {
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
}
