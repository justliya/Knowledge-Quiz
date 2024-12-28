// Quiz.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ResultsSection from './ResultsSection';


function Quiz() {
    const location = useLocation();
    const navigate = useNavigate();
    const { quizData, name } = location.state || {};

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [userWasCorrect, setUserWasCorrect] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [shuffledAnswers, setShuffledAnswers] = useState([]);
    const [score, setScore] = useState(0);


    const currentQuestion = quizData && quizData[currentQuestionIndex];

    useEffect(() => {
        if (!quizData || quizData.length === 0) {
            navigate('/'); // Redirect if no quiz data
        } else {
            
            const answers = currentQuestion.incorrect_answers.concat(currentQuestion.correct_answer);
            setShuffledAnswers(answers.sort(() => Math.random() - 0.5));
        }
    }, [quizData, navigate, currentQuestionIndex, currentQuestion.incorrect_answers, currentQuestion.correct_answer]); 


    const normalizeAnswer = (answer) => {
        return answer.trim().toLowerCase().replace(/&nbsp;/g, ' '); 
    };

    const handleAnswerSelect = (answer) => {
        setSelectedAnswer(answer);
    };

    const handleSubmitAnswer = () => {
        if (!selectedAnswer) return;

        const correct = normalizeAnswer(selectedAnswer) === normalizeAnswer(currentQuestion.correct_answer);

        if (correct) {
            setScore((prevScore) => prevScore + 1);
        }

        setUserWasCorrect(correct);
        setShowResults(true);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quizData.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            setSelectedAnswer(null);
            setUserWasCorrect(null);
            setShowResults(false);
        } else {
            
            navigate('/', { state: { finalScore: score } }); 
        }
    };

    if (!quizData || quizData.length === 0) {
        return <div className="quiz-loading">Loading quiz data...</div>;
    }

    if (showResults) {
        return (
            <ResultsSection
                name={name}
                userWasCorrect={userWasCorrect}
                correctAnswer={currentQuestion.correct_answer}
                onRestart={handleNextQuestion}
                score={score}
            />
        );
    }

    return (
        <div>
            <h2>Question {currentQuestionIndex + 1}</h2>
            <p dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
            <ul>
                {shuffledAnswers.map((answer, index) => (
                    <li key={index}>
                        <label>
                            <input
                                type="radio"
                                name="answer"
                                value={answer}
                                checked={selectedAnswer === answer}
                                onChange={() => handleAnswerSelect(answer)}
                            />
                            <span dangerouslySetInnerHTML={{ __html: answer }} />
                        </label>
                    </li>
                ))}
            </ul>
            <button className="submit-button" onClick={handleSubmitAnswer} disabled={selectedAnswer === null}>
                Submit Answer
            </button>
        </div>
    );
}

export default Quiz;
