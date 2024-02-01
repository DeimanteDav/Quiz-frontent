import axios from 'axios'
import React from 'react'
import { API_URL } from '../config'

const TestPage = () => {
    // let test = {num: 5}
    // try{
    //     if (test.num === 5) {
    //         throw new Error('lalal')
    //     }
    //     console.log(test);
    // }catch(error) {
    //     console.error(error);
    // }finally{
    //     console.log('finally');
    // }
    // console.log('veikia');
    
    async function test() {
        try{
            let response = await axios.get(`${API_URL}/i/questions`)
            console.log(response);
        }catch(error) {
            console.log('lalalla');
            console.log(error);
        }
    }
    test()

  return (
    <div>TestPage</div>
  )
}

export default TestPage