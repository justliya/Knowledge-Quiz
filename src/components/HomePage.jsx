import PropTypes from "prop-types";
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        difficulty: '',
    });
    const [quizError, setQuizError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            e.stopPropagation();
            return;
        }

        setQuizError("");

        try {
            const apiUrl = `https://opentdb.com/api.php?amount=1&category=${formData.category}&difficulty=${formData.difficulty}&type=multiple`;
            console.log("API URL:", apiUrl);

            // Implement rate limiting (adjust delay as needed)(Kept getting error 429 Too Many Requests this helped)
            await new Promise(resolve => setTimeout(resolve, 2000));

            const response = await axios.get(apiUrl);
            console.log("API Response:", response);

            if (!response.data || !response.data.results || response.data.results.length === 0) {
                setQuizError("No quiz data received from the API.");
                return;
            }

            navigate('/quiz', { state: { quizData: response.data.results, name: formData.name } });
        } catch (err) {
            console.error("API Error:", err);

            let errorMessage = "Something went wrong while fetching the quiz.";
            if (err.response) {
                if (err.response.status === 429) {
                    errorMessage = "Too many requests. Please try again later.";
                } else if (err.response.data && err.response.data.message) {
                    errorMessage = err.response.data.message;
                } else {
                    errorMessage = `Error: ${err.response.status} - ${err.response.statusText}`;
                }
            } else if (err.message) {
                errorMessage = `Error: ${err.message}`;
            }
            setQuizError(errorMessage);
        }
    };


    return (
        <div>
            <h1>Welcome to Trivia Quest</h1>
            <p>Please fill in the details below to start the quiz:</p>
            <form onSubmit={handleSubmit}>
                <label>
                    Enter Name:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Category:
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="">Select a category</option>
                        <option value="10">Entertainment: Books</option>
                        <option value="18">Science: Computers</option>
                        <option value="9">General Knowledge</option>
                        <option value="25">Art</option>
                    </select>
                </label>
                <br />
                <label>
                    Difficulty:
                    <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleChange}
                    >
                        <option value="">Select difficulty</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </label>
                <br />
                <button type="submit">Start Quiz</button>
                {quizError && <p style={{ color: "red" }}>{quizError}</p>}
            </form>
        </div>
    );
}
HomePage.propTypes = {
  name: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  difficulty: PropTypes.string.isRequired,
};
export default HomePage;

