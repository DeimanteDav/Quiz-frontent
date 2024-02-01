import PlayedQuizInfo from './PlayedQuizInfo'

const QuizResult = ({questions, correctAnswers, playedGameId, passingPercentage, notRegistered, hintsUsed}) => {
  const data = {correctAnswers: correctAnswers.current, hintsUsed}

  return (
    <div className='quiz-result'>
      <PlayedQuizInfo
        className='quiz-result'
        title='Results'
        ifPassed
        passingPercentage={passingPercentage}
        data={data}
        questionsLength={questions.length}
        notRegistered={notRegistered}
        playedGameId={playedGameId}
        link
      />
    </div>
  )
}

export default QuizResult