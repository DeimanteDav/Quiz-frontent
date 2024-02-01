import axios from "axios";
import { API_URL } from "../../config";

export default async function addFriend(friendId) {
    const {user, jwt} = JSON.parse(localStorage.getItem('user-data'))
    const headers = {Authorization: `Bearer ${jwt}`}
    console.log(friendId, user.id);

    const response =  await axios.post(`${API_URL}/friendships?populate=*`, {
      data: {
        sender: {
          connect: [user.id]
        },
        receiver: {
          connect: [friendId]
        }
      } 
    }, {headers})
      // .then(res => {
      //   console.log(res);
      //   if (res.status === 200) {
      //     setRequestIsSent(res.data.data.id)
      //     // FIXME: buttonInactive kai kur ner kai kur yra
      //     setButtonInactive(false)
      //   }
      // })
      .catch(err => console.error(err))

    return response
}