import { useState } from 'react'

const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    return (
        <div>
            <h2>give feedback</h2>
            <Button 
                handleClick={() => setGood(good + 1)}
                text="good" />
            <Button 
                handleClick={() => setNeutral(neutral + 1)}
                text="neutral" />
            <Button 
                handleClick={() => setBad(bad + 1)}
                text="bad" />

            <h2>statistics</h2>
            <Statistics
                good={good}
                neutral={neutral}
                bad={bad}
            />
        </div>
    )
}

const Statistics = ({ good, neutral, bad }) => {
    const all = good + neutral + bad

    if (all === 0) return <p>No feedback given</p>

    const average = (good - bad) / all
    const positive = good * 100 / all

    return (
        <table>
            <tbody>
                <StatisticLine text="good" value={good} />
                <StatisticLine text="neutral" value={neutral} />
                <StatisticLine text="bad" value={bad} />
                <StatisticLine text="all" value={all} />
                <StatisticLine text="average" value={average} />
                <StatisticLine text="positive" value={positive + ' %'} />
            </tbody>
        </table>
    )
}

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const StatisticLine = ({ text, value }) => (
    <tr>
        <th>{text}</th>
        <td>{value}</td>
    </tr>
)

export default App;
