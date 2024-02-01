import axios from "axios"
import getCoins from "./getCoins"
import { API_URL } from "../config"

export const buyHandler = async ({amount, buyItem, setError, setUserCoins, userData}) => {
    console.log(userData);
    console.log(amount);
    setError(null)
    const {jwt, user} = userData

    let coinsData = await getCoins()
    let {total} = coinsData.attributes
    
    if (total >= amount) {
        const headers = {Authorization: `Bearer ${jwt}`}
        const coinsLeft = total - amount

        axios.put(`${API_URL}/coins/${coinsData.id}`, {
            data: {
                total: coinsLeft,
                user: {
                    connect: [user.id]
                }
            }
        }, {headers})
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    setUserCoins(coinsLeft)

                    buyItem()
                }
            })
            .catch(err => console.log(err))
    } else {
        setError(true)
    }
}
