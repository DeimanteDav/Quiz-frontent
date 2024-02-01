import MultipleChoiceForm from "../components/Quiz/MultipleChoiceForm";
import ShortAnswerForm from "../components/Quiz/ShortAnswerForm";
import TrueFalseForm from "../components/Quiz/TrueFalseForm";
import { QUESTION_TYPES } from "../config";


export default function questionAnswerSection({questionType, answerHandler, currentAnswer, currentQuestion, showHalf, readyQuestion}) {
    let questionAnswerSection = ''

    switch (questionType) {
        case QUESTION_TYPES.shortAnswer.title:
            questionAnswerSection = <ShortAnswerForm onAnswer={answerHandler} enteredAnswer={currentAnswer[0]} />
            break;
  
        case QUESTION_TYPES.trueOrFalse.title:
            questionAnswerSection = <TrueFalseForm onAnswer={answerHandler} enteredAnswer={currentAnswer[0]} />
            break;
  
        case QUESTION_TYPES.multipleChoice.title:
            questionAnswerSection = <MultipleChoiceForm onAnswer={answerHandler} enteredAnswer={currentAnswer} currentQuestion={currentQuestion} wrongAnswers={currentQuestion.attributes.wrongAnswers.data} showHalf={showHalf} readyQuestion={readyQuestion} />
            break;
  
        default:
            break;
      } 

    return questionAnswerSection
}