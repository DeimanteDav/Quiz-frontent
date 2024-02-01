export default function isUserLoggedIn() {
    const userData = localStorage.getItem('user-data')

    if (!userData) {
        window.location.replace('/404')
    }
}