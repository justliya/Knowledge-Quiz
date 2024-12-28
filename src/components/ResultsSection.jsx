import PropTypes from "prop-types";

function ResultsSection({ name, userWasCorrect, correctAnswer, onRestart, score }) {
    return (
        <div>
            <h2>Results</h2>
            <p>
                {name}, you {userWasCorrect ? "answered correctly!" : "got it wrong."}
            </p>
            {!userWasCorrect && (
                <p>The correct answer was: <strong>{correctAnswer}</strong></p>
            )}

            {typeof score === 'number' && (<p>Your Score is: {score}</p>)}
            <button onClick={onRestart}>
                {userWasCorrect ? "Next Question" : "Keep going you learned something new :)"}
            </button>
        </div>
    );
}

ResultsSection.propTypes = {
    name: PropTypes.string.isRequired,
    userWasCorrect: PropTypes.bool.isRequired,
    correctAnswer: PropTypes.string.isRequired,
    onRestart: PropTypes.func.isRequired,
    score: PropTypes.number 
};

export default ResultsSection;
