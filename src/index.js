import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className={props.className}
      onClick={props.Click}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const [a, b, c] = this.props.lines;
    let className = "square";
    if (i === a || i === b || i === c) {
      className = "squareWinner";
    }
    return (
      <Square
        value={this.props.squares[i]}
        Click={() => this.props.onClick(i)}
        className={className}
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
      history: [{
        squares: Array(9).fill(null),
        coordinate: null,
      }],
      xIsNext: true,
      stepNumber: 0,
      lines: [],
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squareArrays = current.squares.slice();
    if (isWinner(squareArrays) || squareArrays[i]) {
      return;
    }
    squareArrays[i] = this.state.xIsNext ? 'X' : 'O';
    if (isWinner(squareArrays)) {
      this.setState({
        lines: isWinner(squareArrays).lines,
      });
    }
    let column = i % 3 + 1;
    let row = Math.floor(i / 3) + 1;
    let coordinate = " coordinate is (" + column + "," + row + ")";

    this.setState({
      history: history.concat([{
        squares: squareArrays,
        coordinate: coordinate,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
    console.log(history.length);
    //console.log(current.length);
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      lines: [],
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = isWinner(current.squares);
    const tied = isTied(current.squares);

    const moves = history.map((historyItem, index) => {
      const desc = index ? "Go to move #" + index + " " + historyItem.coordinate : "Go to start";
      const className = this.state.stepNumber === index ? "bold" : "";
      return (
        <li key={index}>
          <button className={className} onClick={() => this.jumpTo(index)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner is: " + winner.w;
    }
    else if (tied) {
      status = "Resulted in a tie!";
    }
    else {
      status = "Next player is: " + (this.state.xIsNext ? "X" : "o");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            lines={this.state.lines}
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

function isWinner(squares) {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return ({
        w: squares[a],
        lines: lines[i],
      });
    }
  }
  return null;
}

function isTied(squares) {
  let flag = true;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] == null) {
      flag = false;
      break;
    }
  }
  return flag;
}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
