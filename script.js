const Player = (name) => {
  let _name = name;
  const setName = (nameSet) => _name = nameSet;
  const getName = () => _name;

  return { getName, setName };
};

const player1 = Player('Player 1');
const player2 = Player('Player 2');

const gameBoard = (() => {
  const _marks = [];

  for (let i = 0; i < 9; i++) {
    _marks.push('_');
  }
  const getMarks = () => _marks;

  let _playerFlag = true;
  const _markBoxes = Array.from(document.querySelectorAll('.mark-box'));

  const getPlayerFlag = () => _playerFlag;
  const setPlayerFlag = (flag) => _playerFlag = flag;

  const _checkIfAllTrue = (value) => {
    return (value !== '_');
  };

  const _removeOnClick = (array) => {
    array.forEach(element => {
      element.onclick = null;
    });
  };

  const removeAllMarks = () => _marks.fill('_');

  //012 345 678
  //036 147 258
  //048 246
  const evaluate = (board) => {

    if (((board[0] === 'x') || (board[0] === 'o')) &&
      ((board[0] === board[1] && board[1] === board[2]) ||
        (board[0] === board[3] && board[3] === board[6]) ||
        (board[0] === board[4] && board[4] === board[8]))) {
      if (board[0] === 'o') {
        return -10;
      } else if (board[0] === 'x') {
        return 10;
      }
    }
    else if (((board[3] === 'x') || (board[3] === 'o')) &&
      (board[3] === board[4] && board[4] === board[5])) {
      if (board[3] === 'o') {
        return -10;
      } else if (board[3] === 'x') {
        return 10;
      }
    }
    else if (((board[6] === 'x') || (board[6] === 'o')) &&
      (board[6] === board[7] && board[7] === board[8])) {
      if (board[6] === 'o') {
        return -10;
      } else if (board[6] === 'x') {
        return 10;
      }
    }
    else if (((board[1] === 'x') || (board[1] === 'o')) &&
      (board[1] === board[4] && board[4] === board[7])) {
      if (board[1] === 'o') {
        return -10;
      } else if (board[1] === 'x') {
        return 10;
      }
    }
    else if (((board[2] === 'x') || (board[2] === 'o')) &&
      ((board[2] === board[5] && board[5] === board[8]) ||
        (board[2] === board[4] && board[4] === board[6]))) {
      if (board[2] === 'o') {
        return -10;
      } else if (board[2] === 'x') {
        return 10;
      }
    } else {
      return 0;
    }
  };

  const _togglePlayerFlag = () => {
    _playerFlag = _playerFlag ? false : true;
  };

  const _finishGame = (message = true) => {
    if (message) {
      displayController.showWinnerMessage(getPlayerFlag() ? player1.getName() : player2.getName());
    } else {
      displayController.showWinnerMessage();
    }

    _removeOnClick(_markBoxes);
    removeAllMarks();
  };

  const _checkIfFinished = () => {
    const _evaResult = evaluate(_marks);
    if ((_evaResult === -10) || (_evaResult === 10)) {
      _finishGame();
    } else if ((_evaResult === 0) && (_marks.every(_checkIfAllTrue))) {
      _finishGame(false);
    }
  };

  const add = (index) => {
    _marks.splice(index, 1, getPlayerFlag() ? 'o' : 'x');

    _checkIfFinished();
    _togglePlayerFlag();
  };

  return { getMarks, getPlayerFlag, setPlayerFlag, add, removeAllMarks, evaluate };
})();


const iaController = (() => {
  const _markBoxes = Array.from(document.querySelectorAll('.mark-box'));

  const _playAgainButton = document.querySelector('.gameOver-div > button:first-of-type');

  let _iaOn = false;

  const turnOn = () => _iaOn = true;
  const turnOff = () => _iaOn = false;

  const getIaState = () => _iaOn;

  const _checkIfNotFilled = (board) => {
    for (const box of board) {
      if (box === '_') return true;
    }
    return false;
  };

  const _miniMax = (board, depth, isMax = true) => {
    let score = gameBoard.evaluate(board);

    // If Maximizer has won the game
    // return his/her evaluated score
    if (score == 10) return score;

    // If Minimizer has won the game
    // return his/her evaluated score
    if (score == -10) return score;

    // If there are no more moves and
    // no winner then it is a tie
    if (_checkIfNotFilled(board) === false) return 0;

    // If this maximizer's move
    if (isMax) {
      let best = -1000;

      // Traverse all cells
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '_') {
          board[i] = 'x';

          // Call minimax recursively
          // and choose the maximum value
          best = Math.max(best, _miniMax(board, depth + 1, !isMax));

          // Undo the move
          board[i] = '_';
        }
      }

      return best;
    }

    // If this minimizer's move
    else {
      let best = 1000;

      // Traverse all cells
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '_') {
          board[i] = 'o';

          // Call minimax recursively
          // and choose the minimun value
          best = Math.min(best, _miniMax(board, depth + 1, !isMax));

          // Undo the move
          board[i] = '_';
        }
      }
      return best;
    }
  };

  // This will return the best possible
  // move for the player
  const _findBestMove = (board) => {
    let bestVal = -1000;
    let bestMark = false;

    // Traverse all cells, evaluate
    // minimax function for all empty
    // cells. And return the cell
    // with optimal value.
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '_') {
        board[i] = 'x';

        // compute evaluation function
        // for this move.
        let moveVal = _miniMax(board, 0, false);

        // Undo the move
        board[i] = '_';

        // If the value of the current move
        // is more than the best value, then
        // update best
        if (moveVal > bestVal) {
          bestMark = i;
          bestVal = moveVal;
        }
      }
    }

    return bestMark;
  };

  const _clickBestBox = () => {
    const _board = gameBoard.getMarks().slice()
    const _selectedMark = _findBestMove(_board);

    if (!gameBoard.getPlayerFlag()) {
      _markBoxes[_selectedMark].click();
    }
  };

  const _clickTimer = () => setTimeout(_clickBestBox, 1000);

  const _clickWithPlayerFlag = () => {
    if (!gameBoard.getPlayerFlag()) _clickTimer();
  };

  const clicking = () => {
    for (const _markBox of _markBoxes) {
      if (_markBox.getAttribute('listenerOnClick') !== 'true') {

        _markBox.addEventListener('click', _clickWithPlayerFlag);

        _markBox.setAttribute('listenerOnClick', 'true');
      }
    }
    if (_iaOn) {
      if (_playAgainButton.getAttribute('listenerOnClick') !== 'true') {
        _playAgainButton.addEventListener('click', _clickWithPlayerFlag);
        _playAgainButton.setAttribute('listenerOnClick', 'true');
      }
    }
  }

  const removeMarkListener = () => {
    for (const _markBox of _markBoxes) {
      _markBox.removeEventListener('click', _clickWithPlayerFlag);
      _markBox.setAttribute('listenerOnClick', 'false');
    }
  };

  const removePlayAgainListener = () => {
    _playAgainButton.removeEventListener('click', _clickWithPlayerFlag);
    _playAgainButton.setAttribute('listenerOnClick', 'false');
  };

  return { turnOn, turnOff, getIaState, clicking, removeMarkListener, removePlayAgainListener };
})();


const displayController = (() => {
  const _initialDiv = document.querySelector('.initial-div');
  const _mainGame = document.querySelector('main');
  const _addNameButton = document.querySelector('.add-name-button');
  const _formDiv = document.querySelector('.form-div');
  const _inputElements = Array.from(document.querySelectorAll('.input'));
  const _cancelButton = document.querySelector('.cancel');
  const _submitButton = document.querySelector('.submit');

  const _oponentDiv = document.querySelector('.oponent-div');
  const _vsUserBtn = document.querySelector('.vs-user');
  const _vsAiBtn = document.querySelector('.vs-ai');

  const _playerOneTurn = document.querySelector('.p-one');
  const _playerTwoTurn = document.querySelector('.p-two');

  const _markBoxes = Array.from(document.querySelectorAll('.mark-box'));

  const _winnerMessage = document.querySelector('.winner-message');
  const _playAgainButton = document.querySelector('.gameOver-div > button:first-of-type');
  const _menuBtn = document.querySelector('.gameOver-div > button:last-of-type');


  const _toggleTurnColor = (flag = 'remove') => {
    if (flag === 'remove') {
      _playerOneTurn.style.backgroundColor = '#fce7f3';
      _playerOneTurn.style.color = '#000000';
      _playerTwoTurn.style.backgroundColor = '#fce7f3';
      _playerTwoTurn.style.color = '#000000';
    }
    else if (flag) {
      _playerOneTurn.style.backgroundColor = '#be185d';
      _playerOneTurn.style.color = '#ffffff';

      _playerTwoTurn.style.backgroundColor = '#fce7f3';
      _playerTwoTurn.style.color = '#000000';

    } else {
      _playerTwoTurn.style.backgroundColor = '#be185d';
      _playerTwoTurn.style.color = '#ffffff';

      _playerOneTurn.style.backgroundColor = '#fce7f3';
      _playerOneTurn.style.color = '#000000';
    }
  };

  const _addingMark = () => {
    for (const markBox of _markBoxes) {

      markBox.onclick = () => {
        if (!markBox.hasChildNodes()) {

          if (gameBoard.getPlayerFlag()) {
            const oMark = document.createElement('img');
            oMark.className = 'mark';
            oMark.src = 'media/o.svg';
            markBox.appendChild(oMark);

          } else {
            const xMark = document.createElement('img');
            xMark.className = 'mark';
            xMark.src = 'media/x.svg';
            markBox.appendChild(xMark);
          }

          _toggleTurnColor(!gameBoard.getPlayerFlag());
          gameBoard.add(_markBoxes.indexOf(markBox));
        }
      }
    }
  };

  const _markBoxClassToDefault = () => {
    for (let _markBox of _markBoxes) {
      _markBox.className = 'mark-box';
    }
  };

  const _timerToDefaultMarkBoxClass = () => {
    setTimeout(_markBoxClassToDefault, 5000);
  };

  const _turnMarkBoxes = () => {
    for (let _markBox of _markBoxes) {
      _markBox.className += ' active';
    }
    _timerToDefaultMarkBoxClass();
  };

  const _messageClassToDefault = () => {
    _winnerMessage.className = 'winner-message'
  };

  const _timerToDefaultMessageClass = () => {
    setTimeout(_messageClassToDefault, 5000);
  };

  const _scaleMessage = () => {
    _winnerMessage.className += ' active';
    _timerToDefaultMessageClass();
  };

  const _removeMarks = () => {
    for (const _markBox of _markBoxes) {
      while (_markBox.firstChild) {
        _markBox.removeChild(_markBox.firstChild);
      }
    }
  };

  const _toggleElementGridNone = (element) => {
    element.style.display = (window.getComputedStyle(element).getPropertyValue('display') === 'none') ? 'grid' : 'none';
  };

  const _toggleElementBlockNone = (element) => {
    element.style.display = (window.getComputedStyle(element).getPropertyValue('display') === 'none') ? 'block' : 'none';
  };

  const _hideLowerMain = () => {
    _winnerMessage.style.display = 'none';
    _playAgainButton.style.display = 'none';
    _menuBtn.style.display = 'none';
  };

  const _toggleMenuBtnPosition = (flag = false) => {
    if (!flag) {
      const _menuGridColumn = window.getComputedStyle(_menuBtn).getPropertyValue('grid-column');

      _menuBtn.style.gridColumn = (_menuGridColumn === '1 / -1') ? '2 / -1' : '1 / -1';
    } else {
      _menuBtn.style.gridColumn = '1 / -1';
    }
  };

  const _showMenu = () => {
    _menuBtn.onclick = () => {
      _hideLowerMain();
      _toggleElementGridNone(_mainGame);
      _toggleElementGridNone(_initialDiv);
      _removeMarks();
      gameBoard.setPlayerFlag(true);
      gameBoard.removeAllMarks();
      if (iaController.getIaState()) {
        iaController.turnOff();
        iaController.removeMarkListener();
        iaController.removePlayAgainListener();
      }
    };
  };

  const _startGame = () => {
    _toggleElementGridNone(_oponentDiv);
    _toggleElementGridNone(_mainGame);
    _toggleElementBlockNone(_menuBtn);
    _toggleMenuBtnPosition(true);
    _addingMark();
    _showMenu();
    _toggleTurnColor(gameBoard.getPlayerFlag());
  };

  const _oponentBtns = () => {
    _vsUserBtn.onclick = () => {
      _startGame();
    };

    _vsAiBtn.onclick = () => {
      _startGame();
      iaController.turnOn();
      iaController.clicking();
    };
  };

  const _playButton = () => {
    document.querySelector('.play-button').onclick = () => {
      _toggleElementGridNone(_initialDiv);
      _toggleElementGridNone(_oponentDiv);
      _oponentBtns();
    }
  };

  const _writeError = (inputEl, errorElement) => {
    if (!inputEl.validity.valid) {
      if (inputEl.validity.tooLong) {
        errorElement.textContent = `The name must be shorter than ${inputEl.maxLength}; you entered ${inputEl.value.length}`;
      }
      errorElement.className = 'error active';
    } else {
      errorElement.className = 'error';
    }
  };

  const _checkValidityAndLength = (inputEl) => {
    return ((inputEl.validity.valid) && (inputEl.value.length));
  };

  const initialButtonListeners = () => {
    _playButton();
    _addNameButton.onclick = () => {

      _toggleElementGridNone(_formDiv);


      for (const inputElement of _inputElements) {
        if (inputElement.getAttribute('listenerOnInput') !== 'true') {
          inputElement.addEventListener('input', _writeError.bind(0, inputElement, inputElement.nextElementSibling));
          inputElement.setAttribute('listenerOnInput', 'true');
          break;
        }
      }

      if (_submitButton.getAttribute('listenerOnClick') !== 'true') {
        _submitButton.addEventListener('click', () => {

          for (const inputElement of _inputElements) {
            if (!inputElement.validity.valid) {
              _writeError(inputElement, inputElement.nextElementSibling);
              return;
            }
          }

          if (_checkValidityAndLength(_inputElements[0])) {
            player1.setName(_inputElements[0].value);
            _playerOneTurn.textContent = player1.getName();
          }

          if (_checkValidityAndLength(_inputElements[1])) {
            player2.setName(_inputElements[1].value);
            _playerTwoTurn.textContent = player2.getName();
          }

          _toggleElementGridNone(_formDiv);
        });
        _submitButton.setAttribute('listenerOnClick', 'true');
      }

      _cancelButton.onclick = () => _toggleElementGridNone(_formDiv);
    };
  };

  const _playAgain = () => {
    _playAgainButton.onclick = () => {
      _toggleElementBlockNone(_winnerMessage);
      _toggleElementBlockNone(_playAgainButton);
      _toggleMenuBtnPosition();
      _removeMarks();
      _addingMark();
      _toggleTurnColor(gameBoard.getPlayerFlag());
      if (iaController.getIaState()) {
        iaController.clicking();
      }
      window.scrollTo(0, 0);
    };
  };

  const showWinnerMessage = (playerWin = false) => {
    if (playerWin) {
      _winnerMessage.textContent = `${playerWin} won!! \\ (≧∀≦) /`;

      _turnMarkBoxes();
    } else {
      _winnerMessage.textContent = `It's a tie w(°ｏ°)w`;
    }
    _toggleElementBlockNone(_winnerMessage);
    _toggleElementBlockNone(_playAgainButton);
    _toggleMenuBtnPosition();
    _playAgain();
    _toggleTurnColor('remove');
    if (iaController.getIaState()) {
      iaController.removeMarkListener();
    }
    _scaleMessage();
  };

  return { initialButtonListeners, showWinnerMessage };
})();


displayController.initialButtonListeners();