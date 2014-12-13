
//var intervalLength = 20;
var intervalLength = 5;
var intervalsPerCreate = 50;
var moveSize = 30;
var width = $('#mainBox').outerWidth();
var height = $('#mainBox').outerHeight(); 
var goodImages = ["http://i.imgur.com/ltE24Vk.png", "http://i.imgur.com/IM7iQb0.png", "http://i.imgur.com/jscoEV3.png"];
var badImages = ["http://i.imgur.com/aHmsJeu.png", "http://i.imgur.com/axxrI3N.png"];
var song;
var endSong;
var level = 0;
function Game(){
  playSong();
  var fruits = [];
  var bombs = [];
  var score = 0;
  var lives = 3;
  updateScore();
  var interval = setInterval(function() {
    gameLoop();
  }, intervalLength);
  
  this.reset = function (){
    fruits = [];
    bombs = [];
    $('.things').remove();
    score = 0;
    lives = 3;
    updateScore();
  };
  this.stop = function(){
    clearInterval(interval);
    clearInterval(interval2);
    
  };
  function gameLoop(){
    moveThings();
    var matchedThings = getOverlappedElements();
    matchedThings.each(handleHit);
    /*if ( matchedThings.length > 0 ) {
      console.log('overlap');
      
    }*/
    
  }
  function handleHit() {
    if ($(this).hasClass('fruit')) {
      removeFruit($(this));
      score += 10;
      if ( score == ((level + 1) * 100 )) {
        level += 1;
        updateLevel(level);
      }
    } else if ($(this).hasClass('bombs')) {
      removeBomb($(this));
      lives -= 1;
    }
    updateScore();
    if ( lives === 0 ) {
      loss();
    }
  }
  function updateLevel(str) {
    $('#level').text("Level " + str + " passed!");
    setTimeout(function(){
      $('#level').text('');
    }, 2000);
  }
  function loss(){
    stopSong();
    playEndSong();
    alert("Game over! Your score is " + score);
    game.stop();
  }
  function updateScore(){
    $('#score span').text(score);
    $('#lives span').text(lives);
  }
  function moveThings () {
    $('.things').each(function(){
      var currentPos = $(this).css('top');
      var posNumber = parseInt(currentPos);
      var newPosNumber = posNumber + 1;
      if ( newPosNumber <= (height - 20) ) {
        var newPos = newPosNumber;
        $(this).css('top', newPos);  
      } else {
        if ($(this).hasClass('fruit')){
          removeFruit($(this));  
        } else  if ($(this).hasClass('bombs')){
          removeBomb($(this));
        }
        
      }
    });
  }
  function getOverlappedElements() {
    return $('#cat').overlaps($('.things'));
    
  }
  function removeFruit (fruit) {
    fruit.remove();
    fruits.splice(fruits.indexOf(fruit));
  }
  
  function removeBomb (bomb) {
    bomb.remove();
    bombs.splice(bombs.indexOf(bomb));
  }
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function createFruit() {
    if ( fruits.length < 10 ) {
      var randomGood = getRandomInt(0, goodImages.length);
      var rand = getRandomInt(0, (width - 20));
      var newDiv = $("<div class='fruit things'><img src=" + goodImages[randomGood] + "</div>");
      newDiv.css('left', rand);
      fruits.push(newDiv);
      $('#mainBox').append(newDiv);
    }
  }
  
  function createBomb() {
    if ( bombs.length < 3 ) {
      var randomBad = getRandomInt(0, badImages.length);
      var rand = getRandomInt(0, (width - 20));
      var newDiv = $("<div class='bombs things'><img src=" + badImages[randomBad] + "</div>");
      newDiv.css('left', rand);
      bombs.push(newDiv);
      $('#mainBox').append(newDiv);
    }
  }

  createFruit();

  var interval2 = setInterval(function(){
    var random = getRandomInt(0, 4);
    if ( random === 0 ) {
      createBomb();
    } else {
      createFruit(); 
    }
  }, intervalLength * intervalsPerCreate); 
}

function move(direction){
  var current = $('#cat').css("left");
  var newPosition = parseInt(current) + direction;
  if(newPosition > 0 && newPosition < (width - 20)){
    $('#cat').css("left", newPosition);
  }
}

$(document).keydown(function(event){
  switch(event.which) {
    case 37:
      move(0 - moveSize);
      break;
    case 39:
      move(moveSize);
      break;
  }
});
function playSong() {
  song = $('<audio id="song" autoplay="false" style="display:none;" preload="false"><source src="http://5vforest.net/nyan-small.mp3" type="audio/mpeg"></audio>');
  $('body').append(song);
}

function playEndSong() {
  endSong = $('<audio autoplay="false" style="display:none;" preload="false"><source src="http://5vforest.net/Wha-Wha.mp3" type="audio/mpeg"></audio>');
  $('body').append(endSong);
}
function stopSong() {
  song.remove();
}
window.addEventListener('deviceorientation', function(eventData) {
  var tiltLR;
  if (!window.orientation || window.orientation === 180 || window.orientation === 0) {
    tiltLR = eventData.gamma;  
  } else {
    tiltLR = eventData.beta;      
  }
  if(tiltLR < -10 && tiltLR > -20){
    move(0 - moveSize);
  }  
  else if(tiltLR > 10 && tiltLR < 20){
    move(moveSize);
  } 
  else if(tiltLR <= -20){
    move(0 - moveSize * 2);
  }  
  else if(tiltLR >= 20){
    move(moveSize * 2);
  }   
}, false);

var game;
$('#startGame').click(function(){
  
  if (game) {
    game.reset();  
  } else {
    game = new Game();
    
  }
});
