import axios from "axios";
import { API_URL } from "../config";

export default async function getNavLinks(links) {
    const {data} = await axios.get(`${API_URL}/header?populate[${links}][populate]=*`)

    return data.data.attributes[links]
}