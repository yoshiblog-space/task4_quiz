'use strict';


{ 
  const htmlBody = document.getElementById('body');
  const quizTitle = document.getElementById('status');
  const quizSentence = document.getElementById('sentence');
  const startButton = document.getElementById('start');
  const quizProperty =document.getElementById('property');
  const ansButton = document.getElementById('answer');
  let quizProbrems =[];
  let ansData = [];
  let selectAns;
  let numProbrem = 0;
  let numRight = 0;

  //データ取得中の画面表示設定
  const waitDisplay = () => {
    quizTitle.textContent = '取得中';
    quizSentence.textContent = '少々お待ちください';
    startButton.classList.add('nondisplay');
  };

  //終了画面の表示
  const endDisplay = () =>  {
    quizTitle.textContent = `あなたの正解数は${numRight}です！`; 
    quizSentence.textContent = '再度チャレンジしたい場合は以下をクリック！';
    const homeButton = document.createElement('button');
    homeButton.textContent = 'ホームに戻る';
    homeButton.addEventListener('click', () =>{
      location.reload();
    });
    htmlBody.appendChild(homeButton);
  }

  //答え合わせ＋次の問題へ
  const checkAns = (selectAns, correctAns) =>{
    if(correctAns === selectAns){
      numRight++;
      numProbrem++;
      quizDisplay(numProbrem,quizProbrems);
    }else{
      numProbrem++;
      quizDisplay(numProbrem,quizProbrems);
    }
  }

  //回答表示設定
  const ansSet = (quizProbrem) => {
    console.log(quizProbrem);
    const correctAns = quizProbrem.correct_answer;
    console.log(correctAns);
    //回答を一旦配列へ
    ansData[0] = quizProbrem.correct_answer;
    quizProbrem.incorrect_answers.forEach((incorrectans,idx) => {
      ansData[idx+1] = incorrectans
    });

    //truefalseと選択式の回答表示を設定

    const ansBoolean = ansData[0] === 'True' || ansData[0] === 'False';
    if(ansBoolean){
      const trueBtn = document.createElement('button');
      trueBtn.classList.add('btn');
      trueBtn.addEventListener('click', () => {
        selectAns = trueBtn.textContent;
        checkAns(selectAns, correctAns);
      });
      const falseBtn = document.createElement('button');
      falseBtn.classList.add('btn');
      falseBtn.addEventListener('click', () => {
        selectAns = falseBtn.textContent;
        checkAns(selectAns, correctAns);
      });

      trueBtn.textContent = 'true';
      falseBtn.textContent = 'false';

      ansButton.appendChild(trueBtn);
      ansButton.appendChild(falseBtn);
    }else{
      //選択式はシャッフル設定

      for(let i = ansData.length; i > 0 ; i--){
        const selectBtn = document.createElement('button');
        selectBtn.classList.add('btn');
        selectBtn.innerHTML = ansData.splice(Math.floor(Math.random() * ansData.length), 1)[0];
        selectBtn.addEventListener('click', () => {
          selectAns = selectBtn.textContent;
          checkAns(selectAns, correctAns);
        });

        ansButton.appendChild(selectBtn);
      }
    }
  };


  //問題表示設定
  const quizDisplay = ((numProbrem,quizProbrems) => {
    while (quizProperty.firstChild){
      quizProperty.removeChild(quizProperty.firstChild);
    }
    while (ansButton.firstChild){
      ansButton.removeChild(ansButton.firstChild);
    }


    if(numProbrem === quizProbrems.length){
      endDisplay();
    }else{
      quizTitle.textContent = `第${numProbrem + 1}問`
      const quizCategory = document.createElement('h3');
      const quizDifficulty = document.createElement('h3');
      quizCategory.textContent = `[ジャンル] ${quizProbrems[numProbrem].category}`;
      quizDifficulty.textContent = `[難易度]${quizProbrems[numProbrem].difficulty}`;
      quizProperty.appendChild(quizCategory);
      quizProperty.appendChild(quizDifficulty);
      quizSentence.innerHTML = quizProbrems[numProbrem].question; 
      ansSet(quizProbrems[numProbrem]);
    }
  });

  //クイズデータの取得
  const quizSet = (json => {
    const responseCode = json.response_code;
    if(responseCode === 0){
      quizProbrems =json.results;
      quizDisplay(numProbrem, quizProbrems);
    }else{
      quizTitle.textContent = '取得エラー';
      quizSentence.textContent = 'API設定を確認してください';   
    }
  });

  //スタートボタン押下設定
  startButton.addEventListener('click', () => {
    fetch('https://opentdb.com/api.php?amount=10')
      .then((response) => {
        if(response.ok){
          return response.json();
        }else{
          throw new Error();
        }
      })
      .then((json) => {
        quizSet(json);
        return;
      });

    waitDisplay();
 
  });

}