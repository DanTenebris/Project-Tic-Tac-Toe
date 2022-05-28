const Player = (name) => {
  let _name = name;
  const setName = (nameSet) => _name = nameSet;
  const getName = () => _name;

  return { getName, setName };
};

const player1 = Player('Player 1');
const player2 = Player('Player 2');

//player1.setName('George');
console.log(player1.getName());
console.log(player2.getName());

const gameBoard = (() => {
  const _marks = [];

  let _playerFlag = true;
  const _markBoxes = Array.from(document.querySelectorAll('.mark-box'));

  for (let i = 0; i < 9; i++) {
    _marks.push(null);
  }

  const getPlayerFlag = () => _playerFlag;
  //const setPlayerFlag = (flag) => _playerFlag = flag;

  const _checkIfAllTrue = (value) => {
    return (value);
  };

  const _removeOnClick = (array) => {
    array.forEach(element => {
      element.onclick = null;
    });
  };

  const removeAllMarks = () => _marks.fill(null);

  //012 345 678
  //036 147 258
  //048 246
  const _checkIfFinished = (player) => {

    const _finishGame = (message = true) => {
      if (message) {
        displayController.showWinnerMessage(player);
      } else {
        displayController.showWinnerMessage();
      }

      console.log(player);
      _removeOnClick(_markBoxes);
      removeAllMarks()
    };

    if ((_marks[0]) &&
      ((_marks[0] === _marks[1] && _marks[1] === _marks[2]) ||
        (_marks[0] === _marks[3] && _marks[3] === _marks[6]) ||
        (_marks[0] === _marks[4] && _marks[4] === _marks[8]))) {
      _finishGame();
    }
    else if ((_marks[3]) &&
      (_marks[3] === _marks[4] && _marks[4] === _marks[5])) {
      _finishGame();
    }
    else if ((_marks[6]) &&
      (_marks[6] === _marks[7] && _marks[7] === _marks[8])) {
      _finishGame();
    }
    else if ((_marks[1]) &&
      (_marks[1] === _marks[4] && _marks[4] === _marks[7])) {
      _finishGame();
    }
    else if ((_marks[2]) &&
      ((_marks[2] === _marks[5] && _marks[5] === _marks[8]) ||
        (_marks[2] === _marks[4] && _marks[4] === _marks[6]))) {
      _finishGame();
    } else if (_marks.every(_checkIfAllTrue)) {
      _finishGame(false);
    }
  };

  const _togglePlayerFlag = () => {
    _playerFlag = _playerFlag ? false : true;
    return _playerFlag;
  };

  const add = (index) => {
    _marks.splice(index, 1, getPlayerFlag() ? 'o' : 'x');
    _checkIfFinished(getPlayerFlag() ? player1.getName() : player2.getName());

    _togglePlayerFlag();
    console.log(_marks);
  };

  return { getPlayerFlag, add, removeAllMarks };
})();




const displayController = (() => {
  const _initialDiv = document.querySelector('.initial-div');
  const _mainGame = document.querySelector('main');
  const _addNameButton = document.querySelector('.add-name-button');
  const _formDiv = document.querySelector('.form-div');
  const _inputElements = Array.from(document.querySelectorAll('.input'));
  const _cancelButton = document.querySelector('.cancel');
  const _submitButton = document.querySelector('.submit');

  const _markBoxes = Array.from(document.querySelectorAll('.mark-box'));

  
  const _winnerMessage = document.querySelector('.winner-message');
  const _playAgainButton = document.querySelector('.gameOver-div > button:first-of-type');
  const _menuBtn = document.querySelector('.gameOver-div > button:last-of-type');


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

          gameBoard.add(_markBoxes.indexOf(markBox));
        }
      }
    }
  };

  const _removeMarks = () => {
    for (const markBox of _markBoxes) {
      while (markBox.firstChild) {
        markBox.removeChild(markBox.firstChild);
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
      gameBoard.removeAllMarks();
    };
  };

  const _playButton = () => {
    document.querySelector('.play-button').onclick = () => {
      _toggleElementGridNone(_initialDiv);
      _toggleElementGridNone(_mainGame);
      _toggleElementBlockNone(_menuBtn);
      _toggleMenuBtnPosition(true);
      _addingMark();
      _showMenu();
    }
  };

  const _writeError = (inputEl, errorElement) => {
    if (!inputEl.validity.valid) {
      if (inputEl.validity.valueMissing) {
        console.log('value missing');
      }
      else if (inputEl.validity.tooLong) {
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
        if (!inputElement.hasAttribute('listenerOnInput')) {
          inputElement.addEventListener('input', _writeError.bind(0, inputElement, inputElement.nextElementSibling));
          inputElement.setAttribute('listenerOnInput', 'true');
          break;
        }
      }

      if (!_submitButton.hasAttribute('listenerOnClick')) {
        _submitButton.addEventListener('click', () => {

          if (_checkValidityAndLength(_inputElements[0])) {
            console.log('h');
            player1.setName(_inputElements[0].value);
          } else if (_checkValidityAndLength(_inputElements[1])) {
            player2.setName(_inputElements[1].value);
          } else {
            for (const inputElement of _inputElements) {
              if (!inputElement.validity.valid) {
                _writeError(inputElement, inputElement.nextElementSibling);
                console.log('164');
                return;
              }
            }
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
    };
  };

  const showWinnerMessage = (playerWin = false) => {
    if (playerWin) {
      _winnerMessage.textContent = `${playerWin} won!!`;
    } else {
      _winnerMessage.textContent = `It's a tie :O`;
    }
    _toggleElementBlockNone(_winnerMessage);
    _toggleElementBlockNone(_playAgainButton);
    _toggleMenuBtnPosition();
    _playAgain();
  };

  return { initialButtonListeners, showWinnerMessage };
})();


displayController.initialButtonListeners();