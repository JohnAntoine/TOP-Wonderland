function computerPlay() {
  let choice = Math.floor((Math.random() * 3) + 1);
  switch (choice) {
    case 1:
      return "Rock";
    case 2:
      return "Paper";
    case 3:
      return "Scissors";
  }
}


function playRound(playerSelection, computerSelection) {
  let playerWin = false;

  switch (playerSelection) {
    case "Rock":
      if (computerSelection === "Scissors") {
        playerWin = true;
      }
      break;
    case "Paper":
      if (computerSelection === "Rock") {
        playerWin = true;
      }
      break;
    case "Scissors":
      if (computerSelection === "Paper") {
        playerWin = true;
      }
      break;
  }

  return playerWin;
}

function capitalize(word) {
  return word.replace(/^[a-z]/, c => c.toUpperCase());
}


function game() {
  let round = 0;
  let playerScore = 0;

  while (round < 5) {
    const computerSelection = computerPlay();
    let playerSelection = prompt('Choose Your Weapon! Rock | Paper | Scissors');
    let playerWin = false;

    while (playerSelection.toLowerCase() !== 'rock' &&
      playerSelection.toLowerCase() !== 'paper' &&
      playerSelection.toLowerCase() !== 'scissors') {
      playerSelection = prompt('Invalid Choice!\nChoose Your Weapon! Rock | Paper | Scissors');
    }

    playerSelection = capitalize(playerSelection.toLowerCase());

    playerWin = playRound(playerSelection, computerSelection);

    if (playerWin) {
      console.log(`You Win! ${playerSelection} beats ${computerSelection}`);
      alert(`You Win! ${playerSelection} beats ${computerSelection}`);
      playerScore++;
    } else if (playerSelection === computerSelection) {
      console.log(`Draw! Both players chose ${playerSelection}`);
      alert(`Draw! Both players chose ${playerSelection}`);
    } else {
      console.log(`You Lose! ${computerSelection} beats ${playerSelection}`);
      alert(`You Lose! ${computerSelection} beats ${playerSelection}`);
    }

    round++;
  }

    if (playerScore > 2) {
        console.log(`You Win The Game!!\nYou Won ${playerScore} rounds out of 5!`)
        alert(`You Win The Game!!\nYou Won ${playerScore} rounds out of 5!`)
    } else {
        console.log(`You Lose The Game!!\nYou Lost ${5 - playerScore} rounds out of 5!`)
        alert(`You Lose The Game!!\nYou Lost ${5 - playerScore} rounds out of 5!`)
    }
}

game();
