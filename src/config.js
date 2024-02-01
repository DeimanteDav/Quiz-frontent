const URL = 'http://localhost'
const PORT = '1337'
export const API_URL = `${URL}:${PORT}/api`
export const IMG_URL = `${URL}:${PORT}`

export const QUIZ_TIME = 180
export const DEFAULT_NUM_OF_QUESTIONS = 3


export const QUESTION_TYPES = {
    fillInTheBlank: {
        id: 1,
        title: 'fill in the blank'
    },
    trueOrFalse: {
        id: 2,
        title: 'true/false'
    },
    multipleChoice: {
        id: 3,
        title: 'multiple choice'
    },
    shortAnswer: {
        id: 5,
        title: 'short answer'
    },
}
 

export const GAME_TYPES = {
    standard: 1,
    timed: 2,
    speedGame: 3
}

export const USER_ROLES = {
    authenticated: 1,
    public: 2,
    creator: 3
}

export const PRICES = {
    buy: {
        gameType: 50,
        hint: 15,
        fiftyFifty: 20,
    },
    sell: {
        hint: 10,
        fiftyFifty: 15,
    }
}

export const REWARDS = {
    easy: 10,
    medium: 20,
    hard: 30
}

export const DIFFICULTIES = [
    {
        title: 'easy',
        id: 1,
        level: 1,
        reward: 10
    },
    {
        title: 'medium',
        id: 2,
        level: 2,
        reward: 20
    },
    {
        title: 'hard',
        id: 3,
        level: 3,
        reward: 30
    },
]