// DOM Selectors

const btnOpenRules = document.querySelector('.rules-button');
const btnCloseRules = document.querySelector('.modal-close');
const btnChoices = document.querySelectorAll('.choice-wrapper');
const btnRock = document.querySelector('.choice-wrapper[data-choice="rock"]');
const btnPaper = document.querySelector('.choice-wrapper[data-choice="paper"]');
const btnScissors = document.querySelector('.choice-wrapper[data-choice="scissors"]');
const modalRulesWrapper = document.querySelector('.modal-wrapper');
const modalRulesContent = document.querySelector('.modal-content');
const bgChoices = document.querySelector('.game-selection-bg');
const containerGame = document.querySelector('.game-container');

// CSS Transition Injection on page load

document.addEventListener('readystatechange', () => {
  if (document.readyState === 'complete') {
    const styleSheet = document.styleSheets[0];

    const gameSelectionBgVisible = `
      .game-selection-bg {
        transition: ease-in-out calc(var(--animation-duration) * 1.33);
      }
    `;

    const choiceWrapperDefault = `
      .choice-wrapper {
        transition: transform ease-in-out var(--animation-duration),
                    opacity ease-in-out var(--animation-duration),
                    visibility var(--animation-duration);
      }
    `;

    // TODO Remove Me
    const choiceDefault = `
      .choice {
        transition: transform ease-in-out calc(var(--animation-duration) * 0.33);
      }
    `;

    const choiceHouseDelay = `
      .choice-1.house ,
      .choice-2.house ,
      .choice-3.house {
        transition: transform ease-in-out var(--animation-duration)
                    var(--animation-duration),
                    opacity ease-in-out var(--animation-duration)
                    var(--animation-duration);
      }
    `;

    const bgTop = `
      .bg-top {
        transition: transform ease-in-out 100ms;
      }
    `;

    const bgShadow = `
      .bg-shadow {
        transition: transform ease-in-out 100ms;
      }
    `;

    const transitionModalClosed = `
      .modal-wrapper {
        transition: visibility 0ms var(--animation-duration),
                    opacity ease-in-out var(--animation-duration);
      }
    `;

    const transitionModalOpen = `
      .modal-wrapper.modal-show {
        transition: opacity ease-in-out var(--animation-duration),
                    visibility;
      }
    `

    styleSheet.insertRule(choiceDefault, styleSheet.rules.length);
    styleSheet.insertRule(gameSelectionBgVisible, styleSheet.rules.length);
    styleSheet.insertRule(choiceWrapperDefault, styleSheet.rules.length);
    styleSheet.insertRule(choiceHouseDelay, styleSheet.rules.length);
    styleSheet.insertRule(bgTop, styleSheet.rules.length);
    styleSheet.insertRule(bgShadow, styleSheet.rules.length);
    styleSheet.insertRule(transitionModalOpen, styleSheet.rules.length);
    styleSheet.insertRule(transitionModalClosed, styleSheet.rules.length);

    showInitialState();
  }
});

// Modal Event Hnadling

btnOpenRules.addEventListener('click', () => modalRulesWrapper.classList.add('modal-show'));
btnCloseRules.addEventListener('click', () => modalRulesWrapper.classList.remove('modal-show'));
modalRulesWrapper.addEventListener('click', () => {
  modalRulesWrapper.classList.remove('modal-show');
});
modalRulesContent.addEventListener('click', e => {
  e.stopPropagation();
});

// Control Game State Animation

const hideInitialBg = () => {
  bgChoices.classList.add('hidden');
};

const showInitialBg = () => {
  bgChoices.classList.remove('hidden');
};

const hideInitialChoices = () => {
  btnChoices.forEach(choice => {
    choice.classList.remove('initial');
    choice.classList.add('hidden');
  });
};

const showInitialChoices = () => {
  btnChoices.forEach(choice => {
    choice.classList.remove('hidden');
    choice.classList.add('initial');
  });
};

btnChoices.forEach(choice => {
  choice.addEventListener('transitionend', showInitialBg);
});

const hideInitialState = () => {
  btnChoices.forEach(choice => {
    choice.removeEventListener('transitionend', showInitialBg);
    choice.addEventListener('transitionend', markAnimationEnd);
  });
  bgChoices.addEventListener('transitionend', hideInitialChoices);
  hideInitialBg();
}

const showInitialState = () => {
  bgChoices.removeEventListener('transitionend', hideInitialChoices);
  btnChoices.forEach(choice => {
    choice.addEventListener('transitionend', showInitialBg);
    choice.removeEventListener('transitionend', markAnimationEnd);
  });
  showInitialChoices();
}

// Choice Event Hnadling

btnChoices.forEach(choice => {
  choice.addEventListener('click', () => {

    const choiceHouse = computerPlay();
    const choicePlayer = choice.dataset.choice.toLowerCase();

    const tagPlayer = document
          .querySelector(`.choice-wrapper[data-choice="${choicePlayer}"]`)
          .cloneNode(true);
    const tagHouse = document
          .querySelector(`.choice-wrapper[data-choice="${choiceHouse}"]`)
          .cloneNode(true);

    tagHouse.classList.add('hidden');
    tagPlayer.classList.add('hidden');

    hideInitialState();

    containerGame.appendChild(tagHouse);
    containerGame.appendChild(tagPlayer);

    window.addEventListener('animation_end', () => {
      tagHouse.classList.remove('hidden', 'initial');
      tagHouse.classList.add('house');
      tagPlayer.classList.remove('hidden', 'initial');
      tagPlayer.classList.add('chosen');
    });

    if (choiceHouse === choicePlayer) {
      console.log(`It's a Draw! Player Chose ${choicePlayer}, Computer Chose ${choiceHouse}`);
    } else if (playRound(choicePlayer, choiceHouse)) {
      console.log(`Player Win! Player Chose ${choicePlayer}, Computer Chose ${choiceHouse}`);
    } else {
      console.log(`Player Lose! Player Chose ${choicePlayer}, Computer Chose ${choiceHouse}`);
    }

  });
});










function computerPlay() {
  let choice = Math.floor(Math.random() * 3 + 1);
  switch (choice) {
    case 1:
      return "rock";
    case 2:
      return "paper";
    case 3:
      return "scissors";
  }
}

function playRound(playerSelection, computerSelection) {
  let playerWin = false;
  switch (playerSelection) {
    case "rock":
      if (computerSelection === "scissors") {
        playerWin = true;
      }
      break;
    case "paper":
      if (computerSelection === "rock") {
        playerWin = true;
      }
      break;
    case "scissors":
      if (computerSelection === "paper") {
        playerWin = true;
      }
      break;
  }
  return playerWin;
}

// Custom Event Handler for animationEnd

const animationEnd = new CustomEvent('animation_end');

const markAnimationEnd = () => {
  window.dispatchEvent(animationEnd);
}

// function capitalize(word) {
//   return word.replace(/^[a-z]/, (c) => c.toUpperCase());
// }

// function game() {
//   let round = 0;
//   let playerScore = 0;

//   while (1) {
//     const computerSelection = computerPlay();
//     let playerSelection = prompt("Choose Your Weapon! Rock | Paper | Scissors");
//     let playerWin = false;

//     while (
//       playerSelection.toLowerCase() !== "rock" &&
//       playerSelection.toLowerCase() !== "paper" &&
//       playerSelection.toLowerCase() !== "scissors"
//     ) {
//       playerSelection = prompt(
//         "Invalid Choice!\nChoose Your Weapon! Rock | Paper | Scissors"
//       );
//     }

//     playerSelection = capitalize(playerSelection.toLowerCase());

//     playerWin = playRound(playerSelection, computerSelection);

//     if (playerWin) {
//       console.log(`You Win! ${playerSelection} beats ${computerSelection}`);
//       alert(`You Win! ${playerSelection} beats ${computerSelection}`);
//       playerScore++;
//     } else if (playerSelection === computerSelection) {
//       console.log(`Draw! Both players chose ${playerSelection}`);
//       alert(`Draw! Both players chose ${playerSelection}`);
//     } else {
//       console.log(`You Lose! ${computerSelection} beats ${playerSelection}`);
//       alert(`You Lose! ${computerSelection} beats ${playerSelection}`);
//     }

//     round++;
//   }

//   if (playerScore > 2) {
//     console.log(`You Win The Game!!\nYou Won ${playerScore} rounds out of 5!`);
//     alert(`You Win The Game!!\nYou Won ${playerScore} rounds out of 5!`);
//   } else {
//     console.log(
//       `You Lose The Game!!\nYou Lost ${5 - playerScore} rounds out of 5!`
//     );
//     alert(`You Lose The Game!!\nYou Lost ${5 - playerScore} rounds out of 5!`);
//   }
// }

// game();

// TEMP FUNCTIONS

const tempRemoveInitial = () => {
  btnChoices.forEach(choice => {
    choice.classList.remove('initial');
  });
};

const tempRemoveGame = () => {
  document.querySelectorAll('.chosen').forEach(one => {
    one.parentElement.removeChild(one);
  });
  document.querySelectorAll('.house').forEach(two => {
    two.parentElement.removeChild(two);
  });
};
