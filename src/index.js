import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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
      <td key={i}>
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      </td>
    );
  }

  renderBoard() {
    let board = [];
    let currentSquare = 0;

    // Outer loop to create rows
    for (let i = 0; i < 3; i++) {
      let squares = []
      //Inner loop to create squares
      for (let j = 0; j < 3; j++) {
        squares.push(this.renderSquare(currentSquare));
        currentSquare++;
      }
      //Create the roww and add the squares
      board.push(<tr key={i}>{squares}</tr>)
    }
    return board
  }

  render() {
    return(
      <table>
        <tbody>
          {this.renderBoard()}
        </tbody>
      </table>
    )
  }  
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {

    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    squares.column = getColumn(i);
    squares.row = getRow(i);

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    console.log(squares, "squares");

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  setHistoryButtonStyle(step) {
    if (step === this.state.stepNumber) {
      return {fontWeight: 'bold'};
    } else {
      return {fontWeight: 'normal'};
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' (col: ' + step.squares.column + ', row: ' + step.squares.row + ')':
        'Go to game start';
      return (
        <li key={move}>
          <button style={this.setHistoryButtonStyle(move)} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
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

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function getRow(square) {
  if (square<3) {
    return 1;
  } else if (square<6) {
    return 2;
  } else {
    return 3;
  }
}

function getColumn(square) {
  if ([0,3,6].indexOf(square) > -1) {
    return 1;
  } else if ([1,4,7].indexOf(square) > -1) {
    return 2;
  } else {
    return 3;
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

