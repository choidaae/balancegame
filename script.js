/* --- 1. 데이터 저장 --- */
const questions = [
    { question: "📑 책갈피가 없을 땐", choiceA: "👉 책 모서리 접으면 간단하지", choiceB: "🚫 새 책느낌 지켜!, 절대 접지 않는다" },
    { question: "🔁 읽었던 책을 다시 볼 기회가 있다면", choiceA: "📖 다시 읽는다 (새로 느껴져서 좋아)", choiceB: "🙅 한 번 본 책을 왜 또 봐?" },
    { question: "☕ 책 읽는 중간에 방해받으면", choiceA: "😅 괜찮아, 다시 이어 읽으면 되지", choiceB: "😤 아, 지금은 읽을 타이밍이 아닌가? 다음에 읽어야지." },
    { question: "💬 명대사를 만나면", choiceA: "✍️ 밑줄 긋고 기록", choiceB: "💭 그냥 마음에만 담아둔다" },
    { question: "🧺 책 읽다 졸리면", choiceA: "😴 졸리면 그냥 잔다 (독서=수면제)", choiceB: "☕이야기 흐름 지켜! 끝까지 버틴다" },
    { question: "📚 책 고를 때", choiceA: "🎲 감으로 고른다 (표지, 제목, 느낌!)", choiceB: "🔍 리뷰/추천 꼼꼼히 보고 고른다" },
    { question: "💦 책에 물이나 얼룩이 묻었다면", choiceA: "😭 마음의 상처, 새로 사고 싶다", choiceB: "😅 추억의 흔적이라 생각한다" },
    { question: "🏷️ 책에 이름을 쓸 때", choiceA: "✒️ 꼭 적는다 (내 소중한 책이니까)", choiceB: "🫣 절대 안 적는다 (깨끗해야 해)" },
    { question: "🧠 등장인물이 많을 때", choiceA: "📋 메모하거나 표시해둔다", choiceB: "😵 그냥 감으로 기억한다" },
    { question: "🎁 친구가 내게 책을 빌려달라 하면", choiceA: "😊 기꺼이 빌려준다", choiceB: "🤔 세게 접으면 안돼... 살짝 망설인다" }
];
const results = [
    { min: 0, max: 2, emoji: "💔", headline: "“책은 같이 읽지만… 마음은 평행선 📚💫”", description: "너희는 완전 정반대 독서짝꿍!\n한 명은 책 모서리 접고, 한 명은 접는 사람 보면 기절하는 타입 😂\n하지만 이런 조합이 제일 재밌지! 매번 토론 아닌 토크쇼 개장!" },
    { min: 3, max: 5, emoji: "💛", headline: "“다르지만 묘하게 통하는 독서 친구 🌈”", description: "둘 다 책은 좋아하지만, 접근 방식이 달라.\n한 명은 ‘책은 신성한 존재’, 다른 한 명은 ‘책은 생활 속 친구’.\n그래도 이야기하다 보면 서로의 취향 존중해주는 이상적인 독서 듀오!" },
    { min: 6, max: 8, emoji: "💚", headline: "“같이 책 고르고 같이 힐링하는 찐독서메이트 🍃”", description: "책 고를 때, 펼칠 때, 심지어 책 읽는 자세까지 비슷함 😆\n도서관 가면 둘 다 같은 코너에서 마주칠 확률 98%!" },
    { min: 9, max: 10, emoji: "💞", headline: "“독서 소울메이트 발견! 💫📖”", description: "이 정도면 거의 책 속에서도 만나야 할 운명이야.\n둘 다 책 넘기는 타이밍도, 책에 손 베이는 손가락마디도 똑같을 듯 !\n서로 책장 구경하다가 “이거 나도 읽었는데!”를 10번 이상 외칠 조합 😍" }
];


/* --- 2. DOM 요소 가져오기 --- */
const appContainer = document.getElementById('app'); 
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');

// [추가] 진행 상태 바 요소
const progressBar = document.getElementById('progress-bar');

const startButton = document.getElementById('start-button');
const choiceAButton = document.getElementById('choice-a');
const choiceBButton = document.getElementById('choice-b');
const retryButton = document.getElementById('retry-button');

const playerTurnText = document.getElementById('player-turn');
const questionNumberText = document.getElementById('question-number');
const questionText = document.getElementById('question-text');

const resultEmoji = document.getElementById('result-emoji');
const resultHeadline = document.getElementById('result-headline');
const matchCountText = document.getElementById('match-count-text');
const resultDescription = document.getElementById('result-description');


/* --- 3. 게임 상태 변수 --- */
let currentPlayer = 1; 
let currentQuestionIndex = 0; 
let player1Answers = []; 
let player2Answers = []; 


/* --- 4. 핵심 기능 함수 --- */

function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

// [추가] 진행 상태 바 생성 함수
function createProgressBar() {
    progressBar.innerHTML = '';
    for (let i = 0; i < questions.length; i++) {
        const item = document.createElement('div');
        item.classList.add('progress-item');
        
        // 질문 번호 (1, 2, 3...)
        const number = document.createElement('div');
        number.classList.add('progress-number');
        number.innerText = i + 1;
        
        // 결과 (O/X)가 표시될 곳
        const result = document.createElement('div');
        result.classList.add('progress-result');
        result.id = `progress-result-${i}`;
        
        item.appendChild(number);
        item.appendChild(result);
        progressBar.appendChild(item);
    }
}

// [추가] 진행 상태 바 업데이트 함수
function updateProgressBar(index) {
    // 현재 질문(index)의 결과(O/X)를 표시할 요소를 찾음
    const resultElement = document.getElementById(`progress-result-${index}`);
    
    // 두 플레이어의 답변을 비교
    if (player1Answers[index] === player2Answers[index]) {
        resultElement.innerText = 'O';
        resultElement.classList.add('match'); // style.css의 .match (초록색)
    } else {
        resultElement.innerText = 'X';
        resultElement.classList.add('mismatch'); // style.css의 .mismatch (빨간색)
    }
}

// [수정] 게임 시작 함수
function startGame() {
    startButton.blur(); // [추가] '시작하기' 버튼 포커스 즉시 제거
    currentPlayer = 1;
    currentQuestionIndex = 0;
    player1Answers = [];
    player2Answers = [];
    
    createProgressBar(); 
    
    showScreen(gameScreen);
    showQuestion();

    appContainer.classList.add('player-1-active');
    appContainer.classList.remove('player-2-active');
}

// 질문 표시 함수 (수정 없음)
function showQuestion() {
    const question = questions[currentQuestionIndex];
    playerTurnText.innerText = `Player ${currentPlayer}의 차례`;
    questionNumberText.innerText = `${currentQuestionIndex + 1} / ${questions.length}`;
    questionText.innerText = question.question;
    choiceAButton.innerText = question.choiceA;
    choiceBButton.innerText = question.choiceB;
}

// [수정] 선택지 처리 함수
function handleChoice(choice) {
    // [수정] 클릭 즉시 버튼 포커스를 제거하여 'sticky hover' 현상 방지
    // (함수 맨 위로 이동)
    choiceAButton.blur();
    choiceBButton.blur();

    if (currentPlayer === 1) {
        player1Answers.push(choice);
        currentPlayer = 2;
        appContainer.classList.remove('player-1-active');
        appContainer.classList.add('player-2-active');
        showQuestion(); 
    } else {
        player2Answers.push(choice);
        updateProgressBar(currentQuestionIndex);

        currentQuestionIndex++;
        
        if (currentQuestionIndex < questions.length) {
            currentPlayer = 1;
            appContainer.classList.remove('player-2-active');
            appContainer.classList.add('player-1-active');
            showQuestion();
        } else {
            setTimeout(showResult, 500); 
        }
    }
    
    // [수정] 기존 위치의 blur() 호출은 함수 맨 위로 이동했습니다.
}

function showResult() {
    let matchCount = 0;
    for (let i = 0; i < questions.length; i++) {
        if (player1Answers[i] === player2Answers[i]) {
            matchCount++;
        }
    }
    const result = results.find(r => matchCount >= r.min && matchCount <= r.max);
    matchCountText.innerText = `두 사람의 일치 개수는 ${matchCount}개!`;
    resultEmoji.innerText = result.emoji;
    resultHeadline.innerText = result.headline;
    resultDescription.innerHTML = result.description.replace(/\n/g, '<br>'); 
    appContainer.classList.remove('player-1-active', 'player-2-active');
    showScreen(resultScreen);
}

// [수정] 게임 다시 시작 함수
function restartGame() {
    retryButton.blur(); // [추가] '다시하기' 버튼 포커스 즉시 제거
    appContainer.classList.remove('player-1-active', 'player-2-active');
    showScreen(startScreen);
}


/* --- 5. 이벤트 리스너 연결 --- */
document.addEventListener('DOMContentLoaded', () => {
    startButton.addEventListener('click', startGame);
    retryButton.addEventListener('click', restartGame);
    choiceAButton.addEventListener('click', () => handleChoice('A'));
    choiceBButton.addEventListener('click', () => handleChoice('B'));
    showScreen(startScreen);

});
