// DOM Selectors

const btnOpenRules = document.querySelector(".rules-button");
const btnCloseRules = document.querySelector(".modal-close");
const btnChoices = document.querySelectorAll(".choice-wrapper");
const btnRock = document.querySelector('.choice-wrapper[data-choice="rock"]');
const btnPaper = document.querySelector('.choice-wrapper[data-choice="paper"]');
const btnScissors = document.querySelector(
  '.choice-wrapper[data-choice="scissors"]'
);
const modalRulesWrapper = document.querySelector(".modal-wrapper");
const modalRulesContent = document.querySelector(".modal-content");
const bgChoices = document.querySelector(".game-selection-bg");
const containerGame = document.querySelector(".game-container");
const scoreCounter = document.querySelector(".score-points");
const containerResult = document.querySelector(".result-prompt");
const btnResult = document.querySelector(".result-prompt button");
const roundResult = document.querySelector(".result-prompt h3");

// Set score in local storage

if (!localStorage.getItem("score")) localStorage.setItem("score", 0);
let score = localStorage.getItem("score");
scoreCounter.textContent = score;

// CSS Transition Injection on page load

document.addEventListener("readystatechange", () => {
  if (document.readyState === "complete") {
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

    // const choiceHouseDelay = `
    //   .choice-1.house ,
    //   .choice-2.house ,
    //   .choice-3.house {
    //     transition: transform ease-in-out var(--animation-duration)
    //                 var(--animation-duration),
    //                 opacity ease-in-out var(--animation-duration)
    //                 var(--animation-duration);
    //   }
    // `;

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
    `;

    const transitionResultPrompt = `
      .result-prompt {
        transition: opacity ease-in-out var(--animation-duration),
                    transform ease-in-out var(--animation-duration),
                    visibility var(--animation-duration);
      }
    `;

    styleSheet.insertRule(choiceDefault, styleSheet.rules.length);
    styleSheet.insertRule(gameSelectionBgVisible, styleSheet.rules.length);
    styleSheet.insertRule(choiceWrapperDefault, styleSheet.rules.length);
    // styleSheet.insertRule(choiceHouseDelay, styleSheet.rules.length);
    styleSheet.insertRule(bgTop, styleSheet.rules.length);
    styleSheet.insertRule(bgShadow, styleSheet.rules.length);
    styleSheet.insertRule(transitionModalOpen, styleSheet.rules.length);
    styleSheet.insertRule(transitionModalClosed, styleSheet.rules.length);
    styleSheet.insertRule(transitionResultPrompt, styleSheet.rules.length);

    showInitialState();
  }
});

// Modal Event Hnadling

btnOpenRules.addEventListener("click", () =>
  modalRulesWrapper.classList.add("modal-show")
);
btnCloseRules.addEventListener("click", () =>
  modalRulesWrapper.classList.remove("modal-show")
);
modalRulesWrapper.addEventListener("click", () => {
  modalRulesWrapper.classList.remove("modal-show");
});
modalRulesContent.addEventListener("click", (e) => {
  e.stopPropagation();
});

// Control Game State Animation

const hideInitialBg = () => {
  bgChoices.classList.add("hidden");
};

const showInitialBg = () => {
  bgChoices.classList.remove("hidden");
};

const hideInitialChoices = () => {
  btnChoices.forEach((choice) => {
    choice.classList.remove("initial");
    choice.classList.add("hidden");
  });
};

const showInitialChoices = () => {
  btnChoices.forEach((choice) => {
    choice.classList.remove("hidden");
    choice.classList.add("initial");
  });
};

btnChoices.forEach((choice) => {
  choice.addEventListener("transitionend", showInitialBg);
});

const hideInitialState = () => {
  btnChoices.forEach((choice) => {
    choice.addEventListener(
      "transitionend",
      () => {
        markAnimationEnd("choiceEnd");
      },
      { once: true }
    );
  });
  bgChoices.addEventListener("transitionend", hideInitialChoices, {
    once: true,
  });
  hideInitialBg();
};

const showInitialState = () => {
  btnChoices.forEach((choice) => {
    choice.addEventListener("transitionend", showInitialBg, { once: true });
  });
  showInitialChoices();
};

// Choice Event Hnadling

btnChoices.forEach((choice) => {
  choice.addEventListener("click", () => {
    const choiceHouse = computerPlay();
    const choicePlayer = choice.dataset.choice.toLowerCase();

    const tagPlayer = document
      .querySelector(`.choice-wrapper[data-choice="${choicePlayer}"]`)
      .cloneNode(true);
    const tagHouse = document
      .querySelector(`.choice-wrapper[data-choice="${choiceHouse}"]`)
      .cloneNode(true);

    tagHouse.classList.add("hidden");
    tagPlayer.classList.add("hidden");

    hideInitialState();

    tagPlayer.addEventListener(
      "transitionend",
      () => {
        markAnimationEnd("tagPlayerTransition");
      },
      { once: true }
    );

    tagHouse.addEventListener(
      "transitionend",
      () => {
        markAnimationEnd("tagHouseTransition");
      },
      { once: true }
    );

    window.addEventListener("animation_end", (e) => {
      switch (e.detail.name) {
        case "choiceEnd":
          tagPlayer.classList.remove("hidden", "initial");
          tagPlayer.classList.add("chosen");
          break;
        case "tagPlayerTransition":
          tagHouse.classList.remove("hidden", "initial");
          tagHouse.classList.add("house");
          break;
        case "tagHouseTransition":
          tagHouse.classList.add("round-prompt");
          tagPlayer.classList.add("round-prompt");
          tagHouse.addEventListener(
            "transitionend",
            () => {
              markAnimationEnd("tagHouseEnd");
            },
            { once: true }
          );
          break;
        case "tagHouseEnd":
          containerResult.classList.remove("hidden");
          break;
      }
    });

    containerGame.appendChild(tagHouse);
    containerGame.appendChild(tagPlayer);

    if (choiceHouse === choicePlayer) {
      roundResult.textContent = "DRAW";
    } else if (playRound(choicePlayer, choiceHouse)) {
      roundResult.textContent = "YOU WIN";
      scoreCounter.textContent = ++score;
      localStorage.setItem("score", score);
    } else {
      roundResult.textContent = "YOU LOSE";
      scoreCounter.textContent = --score;
      localStorage.setItem("score", score);
    }
  });
});

// Restart Round

btnResult.addEventListener("click", () => {
  tempRevert();
});

// Game Logic

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

const markAnimationEnd = (name) => {
  const event = new CustomEvent("animation_end", {
    detail: {
      name: name,
    },
  });
  window.dispatchEvent(event);
};

// TEMP FUNCTIONS

const tempRevert = () => {
  const tagHouse = document.querySelectorAll(".house");
  const tagPlayer = document.querySelectorAll(".chosen");
  const tags = [tagHouse, tagPlayer];
  tags.forEach((tagList) => {
    tagList.forEach((tag) => {
      tag.addEventListener(
        "transitionend",
        () => {
          tag.parentNode.removeChild(tag);
        },
        { once: true }
      );
      tag.classList.remove("round-prompt", "house");
      tag.classList.add("hidden");
    });
  });
  containerResult.addEventListener("transitionend", () => {
    showInitialState();
    containerResult.removeEventListener("transitionend", () => {
      showInitialState();
    });
  });
  containerResult.classList.add("hidden");
};
