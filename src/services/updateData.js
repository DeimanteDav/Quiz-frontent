import axios from "axios";
import { API_URL } from "../config";

export default async function updateData(url, urlParams, updatedData) {
    const {jwt} = JSON.parse(localStorage.getItem('user-data'))
    const headers = {Authorization: `Bearer ${jwt}` }

    let {data} = await axios(`${API_URL}/${url}?${urlParams ? urlParams : ''}`, {headers})
    console.log(data);

    data.data.forEach(data => {
        axios.put(`${API_URL}/${url}/${data.id}`, {
            data: updatedData
        }, {headers})
    })
}