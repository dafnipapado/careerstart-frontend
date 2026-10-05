export const statusStyle = (status: string | undefined) => {
    if (status === 'ACCEPTED') return 'bg-success'
    if (status === 'PENDING') return 'bg-primary-light'
    if (status === 'REJECTED') return 'bg-danger'
}