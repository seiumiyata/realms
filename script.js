document.addEventListener("DOMContentLoaded", function() {
    let currentWord = {};
    let maxGuesses = 3;
    let correctAnswers = 0;

    function startGame() {
        fetch('words.json')
            .then(response => response.json())
            .then(data => {
                currentWord = data[Math.floor(Math.random() * data.length)];
                document.getElementById("hint1").textContent = currentWord.hints[0];
                document.getElementById("hint2").textContent = currentWord.hints[1];
                document.getElementById("hint3").textContent = currentWord.hints[2];
                document.getElementById("result").textContent = "";
                document.getElementById("guess-input").value = "";
                document.getElementById("submit-btn").textContent = "送信";
                maxGuesses = 3;
            })
            .catch(error => console.error('Error loading words:', error));
    }

    function saveRanking() {
        const rankings = JSON.parse(localStorage.getItem('rankings')) || [];
        const now = new Date();
        const timestamp = now.toLocaleString();
        rankings.push({ date: timestamp, score: correctAnswers });
        rankings.sort((a, b) => b.score - a.score);
        localStorage.setItem('rankings', JSON.stringify(rankings));
        displayRanking();
    }

    function displayRanking() {
        const rankings = JSON.parse(localStorage.getItem('rankings')) || [];
        const rankingList = document.getElementById('ranking-list');
        rankingList.innerHTML = '';
        rankings.forEach((ranking, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}. ${ranking.date} - ${ranking.score} 回`;
            rankingList.appendChild(listItem);
        });
    }

    document.getElementById("submit-btn").addEventListener("click", function() {
        const userGuess = document.getElementById("guess-input").value.toLowerCase();
        if (document.getElementById("submit-btn").textContent === "次の問題") {
            startGame();
            return;
        }
        if (userGuess === currentWord.word) {
            document.getElementById("result").textContent = "おめでとうございます！正解です！";
            correctAnswers++;
            document.getElementById("submit-btn").textContent = "次の問題";
        } else {
            maxGuesses--;
            if (maxGuesses > 0) {
                document.getElementById("result").textContent = `不正解です。残りの試行回数は ${maxGuesses} 回です。`;
            } else {
                document.getElementById("result").textContent = `ゲームオーバー！正解は "${currentWord.word}" でした。`;
                saveRanking();
                correctAnswers = 0;
                document.getElementById("submit-btn").textContent = "次の問題";
            }
        }
    });

    startGame();
    displayRanking();
});
