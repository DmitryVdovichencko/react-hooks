// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import { useLocalStorageState } from '../utils';
function Board(props) {
	const { squares, onClick } = props;

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
	const [ history, setHistory ] = useLocalStorageState('history', [Array(9).fill(null)]);
	const [ current, setCurrent ] = useLocalStorageState('current', 0);
	
	const currentSquares = history[current];
	console.log({history, current, currentSquares})
	const winner = calculateWinner(currentSquares);
	const nextValue = calculateNextValue(currentSquares);
	const status = calculateStatus(winner, currentSquares, nextValue)
	function restart() {    
		setHistory([Array(9).fill(null)]);
		setCurrent(0);
  }
	function selectSquare(square) {
    if(winner || currentSquares[square])	return;
    const squaresCopy = [...currentSquares];
    squaresCopy[square] = nextValue;
		console.log({squaresCopy});
   	setHistory([...history, squaresCopy])
		setCurrent(current + 1 );
  }
	const moves = history.map((historyItem, i ) => {
	const isCurrent = current === i;
	return <li key={`hi_${i}`}>
		<button disabled={isCurrent} onClick={()=>setCurrent(i)}>{`Go to ${i === 0 ? 'game start' : `step #${i}`} ${isCurrent ? '(current)':''}`}</button>
	</li>
	})

  return (
		<div className="game">
    <div className="game-board">
      <Board onClick={selectSquare} squares={currentSquares} />
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
    <div className="game-info">
      <div>{status}</div>
      <ol>{moves}</ol>
    </div>
  </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
	console.log('calculating nextValue',squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O')
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
