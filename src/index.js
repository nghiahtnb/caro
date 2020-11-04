import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render() {
		return (
			<div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [
				{
					squares: Array(9).fill(null),
				},
			],
			stepNumber: 0,
			isNext: true,
		};
	}
	handleClick(i) {
		const { stepNumber, isNext } = this.state;
		const history = this.state.history.slice(0, stepNumber + 1);
		const current = history[stepNumber];
		const squares = current.squares.slice();

		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = isNext ? "X" : "O";
		this.setState({
			history: history.concat([{ squares }]),
			stepNumber: history.length,
			isNext: !isNext,
		});
	}

	jumpTo(move) {
		this.setState({
			stepNumber: move,
			isNext: move % 2 === 0,
		});
	}

	render() {
		const { history, stepNumber, isNext } = this.state;
		const current = history[stepNumber];
		const squares = current.squares;
		const winner = calculateWinner(squares);
		let status;

		const moves = history.map((step, move) => {
			const desc = move ? "Go to move #" + move : "Go to game start";
			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			);
		});

		if (winner) {
			status = "Winner: " + winner;
		} else {
			status = "Next player: " + (isNext ? "X" : "O");
		}
		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

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
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (
			squares[a] &&
			squares[a] === squares[b] &&
			squares[a] === squares[c]
		) {
			return squares[a];
		}
	}
	return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));