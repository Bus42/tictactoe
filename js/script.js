var squares = document.querySelectorAll(".square");
var teamX = document.querySelector('#x');
var teamO = document.querySelector('#o');
var winners = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];//positions that will win the game
var pickedByUser = [], pickedByComputer = [];
var output = document.querySelector('#output');
var gameOver = false;
var team = '';
var empire = '<i class="fa fa-empire" aria-hidden="true"></i>';
var rebels = '<i class="fa fa-rebel" aria-hidden="true"></i>';
var computerTeam = '';
var difficulty = 'hard'; // default setting, still has difficulty taking the win sometimes. I think it's a problem with code asynchronicity
var computerWins = 0;
var userWins = 0;
var stopPicking = false;
var draws = 0;
var messageDiv = document.querySelector('#message');
var messageWrapper = document.querySelector('#messageWrapper');
var dismissBtn = document.querySelector('#dismissBtn');
var rounds = 1;
var reloader = document.querySelector('#reload');

function offense(first, second, third) {//If the computer has two of three squares in a winning set, pick the remaining square in that set
  var computerLogo = computerTeam === 'X' ? empire : rebels;
  if (pickedByComputer.includes(first) && pickedByComputer.includes(second) && squares[third].className === 'square notPickedYet') {
    squares[third].className = 'square pickedByComputer';
    squares[third].innerHTML = computerLogo;
    stopPicking = true;
    return;
  } else
    if (pickedByComputer.includes(first) && pickedByComputer.includes(third) && squares[second].className === 'square notPickedYet') {
      squares[second].className = 'square pickedByComputer';
      squares[second].innerHTML = computerLogo;
      stopPicking = true;
      return;
    } else
      if (pickedByComputer.includes(second) && pickedByComputer.includes(third) && squares[first].className === 'square notPickedYet') {
        squares[first].className = 'square pickedByComputer';
        squares[first].innerHTML = computerLogo;
        stopPicking = true;
        return;
      } else return;

}

function defense(first, second, third) {//If the computer does not have a winning offensive move, attempt to block the user
  var computerLogo = computerTeam === 'X' ? empire : rebels;
  if (pickedByUser.includes(first) && pickedByUser.includes(second) && squares[third].className === 'square notPickedYet') {
    squares[third].className = 'square pickedByComputer';
    squares[third].innerHTML = computerLogo;
    stopPicking = true;
    return;
  }
  if (pickedByUser.includes(first) && pickedByUser.includes(third) && squares[second].className === 'square notPickedYet') {
    squares[second].className = 'square pickedByComputer';
    squares[second].innerHTML = computerLogo;
    stopPicking = true;
    return;
  }
  if (pickedByUser.includes(second) && pickedByUser.includes(third) && squares[first].className === 'square notPickedYet') {
    squares[first].className = 'square pickedByComputer';
    squares[first].innerHTML = computerLogo;
    stopPicking = true;
    return;
  }
}

function dismiss() {
  messageWrapper.style.display = 'none';
  reset();
  squares.forEach(function (square) {
    square.addEventListener('click', pick);
  });
  if (computerTeam === 'X' && rounds % 2 !== 0) computerPicks();
  else if (computerTeam === 'O' && rounds % 2 === 0) computerPicks();
  else return;
}

function chooseEmpire() {
  document.querySelector('.teamPicker').style.display = 'none';
  document.querySelector('.innerWrapper').style.display = 'flex';
  output.innerHTML = '<h3>Round ' + rounds + '</h3><p>Let The Battle Begin!</p>';
  team = 'X';
  computerTeam = 'O';
}
function chooseRebels() {
  document.querySelector('.teamPicker').style.display = 'none';
  document.querySelector('.innerWrapper').style.display = 'flex';
  output.innerHTML = '<h3>Round ' + rounds + '</h3><p>Let The Battle Begin!</p>';
  team = 'O';
  computerTeam = 'X';
  computerPicks();
}

function computerPicks() {
  var computerLogo = computerTeam === 'X' ? empire : rebels;
  if (stopPicking) return;
  if (squares[4].className === 'square notPickedYet' && difficulty != 'easy') {// everybody knows the center is the most coveted square!
    squares[4].className = 'square pickedByComputer';
    squares[4].innerHTML = computerLogo;
    stopPicking = true;
    return;
  } else {

    if (difficulty === 'hard') {//utilize offensive and defensive algorithms
      /** Add steps here to increase difficulty
        If pickedByUser contains 2 of 3 of a set of winners and the third of that
        set is available then have computer pick the remaining number in that set
      */

      winners.forEach(function (winner) {//check all offensive combinations first
        if (stopPicking) return;
        offense(winner[0], winner[1], winner[2]);
      });

      winners.forEach(function (winner) {//use defense if no offensive win is available
        if (stopPicking) return;
        defense(winner[0], winner[1], winner[2]);
      });
    }

    if (!stopPicking) {//choose random square
      var whatsLeft = document.querySelectorAll('.notPickedYet');
      var compPick = whatsLeft[Math.floor(Math.random() * whatsLeft.length)];
      compPick.className = 'square pickedByComputer';//computer picks a square
      compPick.innerHTML = computerLogo;
      stopPicking = true;
      return;
    }
  }
}

function reset() {
  squares.forEach(function (eachSquare) {
    eachSquare.className = 'square notPickedYet';
    eachSquare.innerHTML = '';
  });
  gameOver = false;

}

function collectPicks() {
  pickedByUser = [];//clear array
  pickedByComputer = [];//clear array
  for (var i = 0; i < squares.length; i++) {
    if (squares[i].className === 'square pickedByUser') {//collect squares picked by user
      pickedByUser.push(i);
    }
    if (squares[i].className === 'square pickedByComputer') {//collect squares picked by computer
      pickedByComputer.push(i);
    }
  }
}

function nextRound() {
  var userTeam = team === 'X' ? 'Galactic Empire' : 'Rebel Alliance';
  var compTeam = computerTeam === 'X' ? 'Galactic Empire' : 'Rebel Alliance';
  messageWrapper.style.display = 'block';
  squares.forEach(function (square) {
    square.removeEventListener('click', pick);
  });
  rounds++;
  output.innerHTML = '<h3>Round ' + rounds + '</h3><p>' + userTeam + ': ' + userWins + '</p><p>' + compTeam + ': ' + computerWins + '</p><p>Draws: ' + draws + '</p>';
  gameOver = true;
  stopPicking = false;
}

function checkForWinner() {
  var userTeam = team === 'X' ? 'The Galactic Empire' : 'The Rebel Alliance';
  var compTeam = computerTeam === 'X' ? 'The Galactic Empire' : 'The Rebel Alliance';
  winners.forEach(function (winner) {
    if (pickedByUser.includes(winner[0]) && pickedByUser.includes(winner[1]) && pickedByUser.includes(winner[2])) {
      userWins++;
      messageDiv.innerHTML = "<h1>" + userTeam + " wins the Battle!</h1>";
      nextRound();
      return;
    }
    if (pickedByComputer.includes(winner[0]) && pickedByComputer.includes(winner[1]) && pickedByComputer.includes(winner[2])) {
      computerWins++;
      messageDiv.innerHTML = "<h1>" + compTeam + " wins the battle!</h1>";
      nextRound();
      return;
    }
    var whatsLeft = document.querySelectorAll('.notPickedYet');
    if (!gameOver && whatsLeft.length < 1) {
      draws++;
      messageDiv.innerHTML = "<h1>The battle is a draw.</h1>";
      nextRound();
      return;
    }
  });
}

function pick() {
  var userLogo = team === 'X' ? empire : rebels;
  if (this.className != 'square notPickedYet') return;
  stopPicking = false;
  this.className = "square pickedByUser";
  this.innerHTML = userLogo;
  collectPicks();
  checkForWinner();
  if (gameOver) return;
  computerPicks();
  collectPicks();
  checkForWinner();
  if (gameOver) return;
}

squares.forEach(function (square) {
  square.addEventListener('click', pick);
});
teamX.addEventListener('click', chooseEmpire);
teamO.addEventListener('click', chooseRebels);
dismissBtn.addEventListener('click', dismiss);
reloader.addEventListener('click', function () {
  window.location.reload(false);
});