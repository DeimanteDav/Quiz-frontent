import axios from "axios";
import { API_URL } from "../config";

export default async function getHintsAmount() {
    const {jwt, user} = JSON.parse(localStorage.getItem('user-data'))
    const headers = {Authorization: `Bearer ${jwt}`}

    const {data} = await axios(`${API_URL}/power-ups?filters[user][id][$eq]=${user.id}&populate=*`, {headers})

    if (data.data.length === 0) {
        const {data} = await axios.post(`${API_URL}/power-ups?populate=*`, {
            data: {
                hints: {
                    amount: 0,
                },
                fiftyFifty: {
                    amount: 0,
                },
                user: {
                    connect: [user.id]
                }
            }
        }, {headers})
        return {id: data.data[0].id, amount: data.data[0].attributes.hints.amount}
    } 
    
    return {id: data.data[0].id, amount: data.data[0].attributes.hints.amount}
}