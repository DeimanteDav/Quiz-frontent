import axios from "axios";
import { API_URL, DEFAULT_NUM_OF_QUESTIONS } from "../config";

export default async function getGeneratedQuiz(quizId, isLoggedIn) {
    const {data} = await axios.get(`${API_URL}/quizzes/${quizId}?populate[generatedQuizzes][populate]=*&populate[questions][populate]=*`)

    const quiz = data.data.attributes
    const quizGeneratedQuizzes = quiz.generatedQuizzes.data

    let game = await axios.get(`${API_URL}/generated-quizzes?filters[quiz][id][$eq]=${quizId}&populate[questions][populate]=*`)
    const generatedQuizzes = game.data.data

// TODO: pabandyti veliau
    if (!isLoggedIn) {
        if (quizGeneratedQuizzes.length === 0) {
            return createGeneratedQuiz(quiz, quizId)
        }
        return generatedQuizzes[Math.floor(Math.random()*generatedQuizzes.length)]
    }
    
    if (quizGeneratedQuizzes.length === 0) {
        return createGeneratedQuiz(quiz, quizId)
    }

    const {user, jwt} = JSON.parse(localStorage.getItem('user-data'))
    const userId = user.id
    const headers = {Authorization: `Bearer ${jwt}`}

    let result = await axios.get(`${API_URL}/played-games?filters[user][id][$eq]=${userId}&populate=generatedQuiz`, {headers})

    let playedQuizzes = result.data.data

    let playedGeneratedQuizzes = quizGeneratedQuizzes.filter(generatedQuiz => (
        playedQuizzes.some(playedQuiz => {
            let playedGeneratedQuiz = playedQuiz.attributes.generatedQuiz.data
            if (!playedGeneratedQuiz) {
                return false
            }

            return playedGeneratedQuiz.id === generatedQuiz.id
        })
    ))

    if (playedGeneratedQuizzes.length === quizGeneratedQuizzes.length) {
        return createGeneratedQuiz(quiz, quizId)
    } 


    const filteredGenerated = generatedQuizzes.filter(generatedQuiz => (
        playedGeneratedQuizzes.every(playedGenerated => (
            playedGenerated.id !== generatedQuiz.id
        ))
    ))

    return filteredGenerated[0]

}

const createGeneratedQuiz = async (quiz, quizId) => {
    const quizQuestions = [...quiz.questions.data]
    const numberOfQuestions = quiz.questionsAmount ? quiz.questionsAmount : DEFAULT_NUM_OF_QUESTIONS

    let quizRandomQuestions = []
    for (let i = 0; i < numberOfQuestions; i++) {
        const randomIndex = Math.floor(Math.random()*quizQuestions.length)
        const randomQuestion = quizQuestions.splice(randomIndex, 1)
        quizRandomQuestions = [...quizRandomQuestions, ...randomQuestion]
    }

    const data = {
        title: `${quiz.title}`,
        quiz: {
            connect: [quizId]
        },
        questions: {
            connect: quizRandomQuestions.map(question => question.id)
        }
    }

    const generated = await axios.post(`${API_URL}/generated-quizzes`, {data})
        .catch(err => console.error(err))

    return generated.data.data
}