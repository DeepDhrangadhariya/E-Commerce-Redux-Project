export const formateDate = (isoDate) => {
    const date = new Date(isoDate)
    // console.log(isoDate)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}