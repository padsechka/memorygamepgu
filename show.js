var level = 0; // Уровень игры, начальное значение
var score = 0; // Счет игрока
var playersTurn = false; // Переменная, определяющая, чей ход: игрока или компьютера
var timer; // Таймер
var patternArray = []; // Массив, хранящий паттерн, который показывает компьютер
var userChoicesArray = []; // Массив, хранящий выборы игрока
var numPlayerClicks = 0; // Количество кликов игрока

var PLAYERS_TURN_MSG = "Ваш ход!"; // Сообщение о ходе игрока
var COMPS_TURN_MSG = "Обратите внимание на паттерн!"; // Сообщение о ходе компьютера
var LEVEL_UP_MSG = "<span class='success'>Уровень выше!</span>"; // Сообщение о переходе на следующий уровень
var GAME_OVER_MSG = "<span class='fail'>Игра окончена</span><br>Вы проиграли! Ваш итоговый счет: "; // Сообщение о завершении игры и итоговом счете

$(document).ready(function() {
    /* Нажатие кнопки "Начать" или "Заново". */
    $("#start,#start-over").click(function() {
      level = 0;
      // Отображение игрового окна соответственно - если массив выборов игрока заполнен,
      // значит, только что была сыграна игра.
      if (userChoicesArray.length != 0) {
          $("#end-game-window").slideUp(1100, function() {
              startGame();
          });
      } else {
          startGame();
      }
    });

    /* Нажатие кнопки "Выйти". */
    $("#quit").click(function() {
        level = 0;
        score = 0;
        playerTurn = false;
        clearInterval(timer);
      $("#play-window").css("display","none");
      $("#start-window").css("display","block");
    });

    /* Нажатие на игровой блок. */
    $(".game-block").mousedown(function(){
        if (playersTurn) {
            var gameBlockID = '#' + this.id;
            var highlightColor = $(this).css('border-color');
            
            // Анимация изменения цвета фона
            // Можно сделать с использованием плагина JQuery UI Color, но пока используем таймер
            $(gameBlockID).css('background-color', $(gameBlockID).css('border-color'));
            
            // Анимация возвращения к белому цвету через 400 мс
            setTimeout(function() { $(gameBlockID).css('background-color', '#FFFFFF'); }, 400);
            
            // Сравнение
            if(numPlayerClicks == (level + 1)){
                userChoicesArray[numPlayerClicks] = gameBlockID
                comparePattern();
            }else{
                userChoicesArray[numPlayerClicks] = gameBlockID
                numPlayerClicks++;
            }
        }
    });
});

function startGame() {
    $("#play-window").css("display","block");
    $("#end-game-window").css("display","none");
    $("#start-window").css("display","none");
    $("#end-game-window").css("display","none");

    alertUser(COMPS_TURN_MSG);
    displayPattern();
}
function alertUser(msg) {
    $('#notif-msg').html(msg);
}

function displayPattern() {
    var i = 0;
    var randNumber;
    var gameBlockID;
    var color;
    numPlayerClicks = 0;
    patternArray = [];
    playersTurn = false;
    level = level + 1;
    $("#level").text(level + "/20")
    $("#score").text(score)

    timer = setInterval(function(){
        randNumber = Math.floor((Math.random() * 6) + 1);
        gameBlockID = "#game-block" + randNumber;
        patternArray[i] = gameBlockID;
        color = $(gameBlockID).css("border-color");
        $(gameBlockID).css("background-color", color);

        setTimeout(function(){
          $(gameBlockID).css("background-color", "#FFF");
            i = i + 1;
            if(i == (level + 2)){
                clearInterval(timer);
                playersTurn = true;

                alertUser(PLAYERS_TURN_MSG);
                return;
            }
        }, 800);
  }, 1000);
};

function comparePattern(){
    for(var j = 0; j < (level + 2); j++){
        if(userChoicesArray[j] != patternArray[j]){
            gameOver();
            return;
        }
    }
    nextLevel();
}

function nextLevel(){
    alertUser(LEVEL_UP_MSG);
    score = score + 1.5*level*1100

    // Позволяет игроку отпраздновать успех на секунду...
    setTimeout(function() {
        alertUser(COMPS_TURN_MSG);
        displayPattern();
    }, 1000);
}

function gameOver(){
    // Показать экран завершения игры
    $('#end-game-msg').html(GAME_OVER_MSG + score);
    $('#end-game-window').slideDown(1100);

    level = 0;
    score = 0;
    playerTurn = false;

    $("#start-window").css("display","none");
}
