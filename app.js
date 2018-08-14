$(document).ready(initializeApp);

function initializeApp() {
    createRandonCard();

    eventHandler();
    // $('.cardArea').on('click', '.card', card_clicked);
} //end initializApp
function eventHandler() {
    $('.cardArea').on('click', '.card', card_clicked);
    $('.start-btn').on('click', closeWelcomeModal);
    $('#reset').on("click", reset);
    //     reset(); 
}
var imgElement;
var imgsrcFirst;
var imgsrcSecond;
var wrongTimes = 0;

var first_card_clicked = null;
var second_card_clicked = null;
var total_possible_matches = 2;
var match_counter = 0;

var matches = 0;
var attempts = 0;
var remains = 4;
var accuracy = 0;
var games_played = 0;

var statsArea = $('.stats');
var games_playedValue = $('.games-played .value');
//var attemptsValue = $('.attempts .value');
var remainsValue = $('.remains .value');
var accuracyValue = $('.accuracy .value');

var audio = document.getElementById("myAudio");

var resetButton = $('#reset');

function reset() {
    stopTimer();
    startTimer();
    reset_stats();
    $('.reveal').removeClass('reveal');
} //end reset()

function reset_stats() {
    matches = 0;
    attempts = 0;
    accuracy = 0;
    remains = 4
    match_counter = 0;
    //total_possible_matches = 2;
    display_stats();
    $('.cardArea').on('click', '.card', card_clicked);
} //end reset_stats()

function display_stats() {
    console.log("in display func matches, attempts, accuracy", matches, attempts, accuracy);

    games_playedValue.empty();
    games_playedValue.text(games_played);
    
    remainsValue.empty();
    remainsValue.text(remains);

    accuracyValue.empty();
    accuracyValue.text(Math.round((accuracy) * 100) + "%");
} //end display

//==============  createRandonCard --------------------
function createRandonCard() {
    var cardSrcArr = ["assets/images/elmo.jpg", "assets/images/Abby.png", "assets/images/bert.png",
        "assets/images/bigBird.png", "assets/images/Cookie.png", "assets/images/Count.png",
        "assets/images/Ernie.png", "assets/images/Oscar.png", "assets/images/Prairie.png"
    ];

    //copy array so original arr won't be changed  concat make double of original card
    var copy = cardSrcArr.slice().concat(cardSrcArr);
    var randomizedArray = [];
    while (copy.length) {
        var randomIndex = Math.floor(Math.random() * copy.length);
        var randomElement = copy[randomIndex];
        randomizedArray.push(randomElement);
        copy.splice(randomIndex, 1);
        //cut 1 from array. then go into while , this time copy.length will minus 1.
        //while loop will run until it be 0 ( cut all ) while(0): means condition will always be false
        // code in while(0) will never get executed. 
    }
    console.log('randomizedArray', randomizedArray);

    //clear html of all card, then createNewCard() create new card and append each one to html
    $(".cardArea").empty();
    for (var i = 0; i < randomizedArray.length; i++) {
        var container = createNewCard(randomizedArray[i]);
        //append element to page
        $(".cardArea").append(container);
    }
} //end createRandonCard
/*
      <div class="cardContainer">
        <div class="card">
          <div class='image'>
             <img class='pic' src="images/Abby.png" alt="Abby"> 
          </div>
          <div class='coveringSide'>
            <img src="images/card-back.jpg" alt="back">
          </div>
        </div>
      </div>
*/

function createNewCard(picture) {
    var container = $("<div>").addClass('cardContainer');
    var card = $("<div>").addClass('card');
    container.append(card);

    var image = $("<div>").addClass('card-face image');
    card.append(image);

    var imageElement = $("<img>").addClass('pic').attr('src', picture);
    image.append(imageElement);

    var back = $("<div>").addClass('card-face coveringSide');
    card.append(back);
    var backImage = $("<img>").attr('src', 'assets/images/card-back.png').attr('alt', 'back');
    back.append(backImage);
    return container;
} //end creatNewCard

function card_clicked() {
    // true - assign first_card_clicked equal to the html DOM Element that was clicked, return
    var clickedCard = $(this);
    if (clickedCard.hasClass('reveal')) {
        // debugger;
        shakecard();
        return;
    }

    //click 1st card
    if (first_card_clicked === null) {
        first_card_clicked = clickedCard;
        console.log('first card click ? ', first_card_clicked);
        imgElement = clickedCard.find('.image img');
        imgsrcFirst = imgElement.attr('src');
        //change cardback to  front =================================
        first_card_clicked.addClass('reveal is-flipped');
        return;
    }
    //when use this without $() jQuery wraper. use else if (second_card_clicked == null) {

    //click 2nd card. and compare immediately
    else {
        if (first_card_clicked === clickedCard) {
            shakecard();
            return;
        }
        second_card_clicked = clickedCard;
        attempts++;
        remains--;
        games_played++;

        console.log(('attempts'), attempts);
        console.log('second card click ? ', second_card_clicked);
        imgElement = clickedCard.find('.image img');
        imgsrcSecond = imgElement.attr('src');

        second_card_clicked.addClass('reveal is-flipped');
        console.log('second card image src ', imgsrcSecond);

        //=======================compare two card src
        // 1. match
        if (imgsrcFirst == imgsrcSecond) {
            match_counter++;

            matches++;
            accuracy = matches / attempts;
            console.log('matchs ', matches);
            console.log('accuracy', accuracy);
            first_card_clicked = null;
            second_card_clicked = null;
            display_stats();

            //check if match_counter is equivalent to total_possible_matches=2
            if (match_counter == total_possible_matches) {
                console.log("win");
                audio.play();
                //disable all card when win
                $('.cardArea').off("click");
                console.log('in card_clicked attemps: ', attempts);
                console.log('card_clicked matches ', matches);
            } else {
                console.log('card_clicked attemps: ', attempts);
                console.log('card_clicked matches ', matches);
                return;
            }
        }

        // 2 two card not match
        else if (first_card_clicked !== second_card_clicked) {
            //make cards not clickable. either remove the click handler or
            //put some property class on it make it unclick
            $('.cardArea').off("click");
            setTimeout(flipback, 1000);
            // Be wary of waiting programmatically but not being able to control the user from clicking on cards while the program waits execute the reset of the code
            // Show card back on both elements that are flipped over

            return;
        }
    }
} //end card_clicked

function shakecard() {
    first_card_clicked.addClass('shakeme');
}

function flipback() {
    //put back ability to click cards
    $('.cardArea').on('click', '.card', card_clicked);
    console.log('in flipback func');
    console.log('at the end attemps: ', attempts);
    console.log('at the end matches ', matches);
    accuracy = matches / attempts;
    console.log('matchs ', matches);
    console.log('accuracy', accuracy);

    first_card_clicked.removeClass('reveal is-flipped');
    second_card_clicked.removeClass('reveal is-flipped');
    first_card_clicked = null;
    second_card_clicked = null;
    display_stats();
    //user has 4 times to play 
    //if (attempts == 4) {
    if (remains == 0) {
        //unclick all card
        $('.cardArea').off("click");

        //use model to show the result
        popUploseModal();
        $('.cardArea').on('click', alertModal);
    }
} //flipback()

function popUploseModal() {
    $('#modelShadow').css('display', 'block');
    setTimeout(function () {
        $('#modelShadow').css('display', 'none');
    }, 4000);
} // end popUp()

function alertModal() {
    alert('time out, please click reset to play');
}




function closeWelcomeModal() {
    $("#modal").toggleClass("closed");
    $("#modal-overlay").toggleClass("closed");
    createGoModal();
}

function createGoModal() {
    $('#go-modelShadow').css('display', 'block');
    startGo();
}
var countDownInterval;
var countDownNumber;

function startGo() {
    countDownNumber = 4;
    $('#go-modelBody').html('<div class="countdown">3</div>');
    $('.countdown').animate({
        fontSize: 120,
        marginTop: 102,
        opacity: 0
    });
    countDownInterval = setInterval(countDown, 750);

    //populate timer
    var minutes = Math.floor(time / 60);
    var seconds = (time-1) - minutes * 60;
    if(seconds < 10)$('#time').html(minutes+':0'+seconds);
    else $('#time').html(minutes+':'+seconds);
}

function countDown() {
    countDownNumber--;
    console.log(countDownNumber);

    if (countDownNumber > 1) {
        $('#go-modelBody').html('<div class="countdown">' + (countDownNumber - 1) + '</div>');
    } else if (countDownNumber == 1) {
        $('#go-modelBody').html('<div class="countdown">GO</div>');
    }
    $('.countdown').animate({
        fontSize: 120,
        marginTop: 102,
        opacity: 0
    });
    if (countDownNumber == 0) {
        $('#go-modelShadow').css('display', 'none');
        clearInterval(countDownInterval);
        //startGame();
        // createRandonCard();
        startTimer(); 
    }
}

function startTimer() {
    changeClock();
    timer();
	counter = setInterval(timer, 1000);
}
var time = 301; //miao

function timer(){   
    time--;
    if (time <= 0)
    {
        $('#timer').html('0:00');
        stopTimer();
        return;
    }
    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;
    if(seconds < 10) {
        $('#timer').html(minutes+':0'+seconds);
    }
    else {
        $('#timer').html(minutes+':'+seconds);
    }
}

function changeClock() {
    $('#clock').attr('src', 'assets/images/Clock.gif');
}

function stopTimer() {
    alert('stop timer');
    debugger;
    $('#clock').attr('src', 'assets/images/stopclock.jpg');
	clearInterval(counter);
}




