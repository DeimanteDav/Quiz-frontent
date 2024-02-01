export function getFullDate(date) {
    const fullDate = new Date(date)
    const year = fullDate.getFullYear()
    const month = (fullDate.getMonth() + 1).toString().padStart(2, '0')
    const day = fullDate.getDate().toString().padStart(2, '0')
    const dateReady = `${year}-${month}-${day}`
    return dateReady
}


