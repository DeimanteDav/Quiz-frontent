export default function checkIfCreator(creatorId) {
    const {user} = JSON.parse(localStorage.getItem('user-data'))
    if (user.id === creatorId) {
        return true
    } 

    return false
}
