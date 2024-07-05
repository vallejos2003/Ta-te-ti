let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

const cells = document.querySelectorAll("td");

cells.forEach((cell) => {
  cell.addEventListener("click", handleClick);
});

function handleClick(event) {
  const cellIndex = parseInt(event.target.getAttribute('data-cell-index'));

  if (board[cellIndex] !== "" || !gameActive) {
    return;
  }

  fetchQuestion().then(question => {
    if (question) {
      showQuestionModal(question, cellIndex);
    } else {
      alert('No se pudo obtener una pregunta. Inténtalo de nuevo.');
    }
  });
}

function fetchQuestion() {
  return fetch('questions.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al obtener la pregunta');
      }
      return response.json();
    })
    .then(data => data[Math.floor(Math.random() * data.length)])
    .catch(error => {
      console.error('Error:', error);
    });
}

function showQuestionModal(question, cellIndex) {
  const modal = $('#questionModal');
  const questionText = document.getElementById('questionText');
  const answersDiv = document.getElementById('answers');

  questionText.textContent = question.Pregunta;
  answersDiv.innerHTML = '';

  for (let i = 1; i <= 3; i++) {
    const answerButton = document.createElement('button');
    answerButton.classList.add('btn', 'btn-outline-primary', 'btn-block', 'my-2');
    answerButton.textContent = question[`Respuesta${i}`];
    answerButton.onclick = () => handleAnswerClick(i, question.Verdadera, cellIndex);
    answersDiv.appendChild(answerButton);
  }

  modal.modal('show');
}

function handleAnswerClick(selectedAnswer, correctAnswer, cellIndex) {
  $('#questionModal').modal('hide');

  if (selectedAnswer === correctAnswer) {
    board[cellIndex] = currentPlayer;
    document.querySelector(`[data-cell-index='${cellIndex}']`).textContent = currentPlayer;
    if (checkWin()) {
      alert(`¡Jugador ${currentPlayer} ha ganado!`);
      gameActive = false;
    } else if (!board.includes("")) {
      alert('¡Empate!');
      gameActive = false;
    }
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  } else {
    alert('Respuesta incorrecta. Pierdes tu turno.');
  }
}

function checkWin() {
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // horizontales
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // verticales
    [0, 4, 8],
    [2, 4, 6]  // diagonales
  ];

  for (let condition of winConditions) {
    let [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }
  return false;
}

