import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {

//   render() {
//     return (
//       <button 
//         className="square" 
//         onClick={() => this.props.onClick()}
//         >
//         {this.props.value}
//       </button>
//     );
//   }
// }

function Square(props) {
  return (
    <button 
      className="square" 
      onClick={props.onClick}
      >
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return <Square 
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      />;
  }

  renderRow(colNumber) {
    const firstVal = colNumber * 3;
    return <div className="board-row">
      {this.renderSquare(firstVal)}
      {this.renderSquare(firstVal + 1)}
      {this.renderSquare(firstVal + 2)}
    </div>
  }

  render() {
    return (
      <div>
        {this.renderRow(0)}
        {this.renderRow(1)}
        {this.renderRow(2)}
      </div>
    );
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
    const newSquares = current.squares.slice(); // copy
    if (
      calcWinner(newSquares) || 
      newSquares.every(x => x)
      ) {
      return;
    }
    newSquares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{
        squares: newSquares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext 
    });
  }

  jumpTo(move) {
    this.setState({
      stepNumber: move,
      xIsNext: move % 2 === 0
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calcWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move
        ? `Go to move #${move}`
        : "Go to game start";
      return <li key={move}>
        <button onClick={() => this.jumpTo(move)}>
          {desc}
        </button>
      </li>
    });

    let status = '';
    if (winner) {
      status = `Winner: ${winner}`;
    } else if (
      current.squares.every(x => x)){
      status = `It's a draw.`
    } else {
      const nextPlayer = this.state.xIsNext ? "X" : "O";
      status = `Next player: ${nextPlayer}`;
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

function calcWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  const winnerLines = lines.filter(line => {
    const [a,b,c] = line;
    return squares[a] && squares[a] === squares[b] && squares[a] === squares[c];
  });
  return winnerLines.length === 0 
    ? null
    : squares[winnerLines[0][0]];
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
