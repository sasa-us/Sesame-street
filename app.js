$(document).ready(initializeApp);

function initializeApp() {
    console.log('unclick pasue, clockflag is ', clockflag);
    createRandonCard();
    eventHandler();
} //end initializApp
function eventHandler() {
    // $('.cardArea').on('click', '.card', card_clicked);
    $('.start-btn').on('click', closeWelcomeModal);
    $('#reset').on("click", reset);
    $('#togglePauseClock').on("click", togglePauseClock);
}

var imgElement;
var imgsrcFirst;
var imgsrcSecond;
var wrongTimes = 0;

var first_card_clicked = null;
var second_card_clicked = null;
var total_possible_matches = 3;
var match_counter = 0;

var matches = 0;
var attempts = 0;
var remains = 10;
var accuracy = 0;
var games_played = 0;

var statsArea = $('.stats');
var games_playedValue = $('.games-played .value');

var remainsValue = $('.remains .value');
var accuracyValue = $('.accuracy .value');

var audio = document.getElementById("myAudio");
// 0 is runing --> after click should be stop
//click pause -> flag change to 1
var clockflag = 0;
var timerflag = 0;

//------------------createRandonCard -------------------->
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

function createNewCard(picture) {
    var container = $("<div>").addClass('cardContainer cardContainer-hover mouse-pointer');
    var card = $("<div>").addClass('card');
    container.append(card);

    var image = $("<div>").addClass('card-face image card-face-hover');
    card.append(image);

    var imageElement = $("<img>").addClass('pic').attr('src', picture);
    image.append(imageElement);

    var back = $("<div>").addClass('card-face coveringSide card-face-hover');
    card.append(back);
    var backImage = $("<img>").attr('src', 'assets/images/card-back.png').attr('alt', 'back');
    back.append(backImage);
    return container;
} //end creatNewCard

function card_clicked() {
    // true - assign first_card_clicked equal to the html DOM Element that was clicked, return
    var clickedCard = $(this);
    if (clickedCard.hasClass('is-flipped')) {
        // alert('hi');
 
        clickedCard.addClass('shakeme');
        setTimeout(() => {clickedCard.removeClass('shakeme')}, 500);
        return;
        //after action implement it should remove shakeme again
    }

    //click 1st card
    if (first_card_clicked === null) {
        first_card_clicked = clickedCard;
        console.log('first card click ? ', first_card_clicked);
        imgElement = clickedCard.find('.image img');
        imgsrcFirst = imgElement.attr('src');
        //change cardback to  front =================================
        first_card_clicked.addClass('is-flipped');
        return;
    }
    //when use this without $() jQuery wraper. use else if (second_card_clicked == null) {

    //click 2nd card. and compare immediately
    else {
        if (first_card_clicked === clickedCard) {
            // clickedCard.addClass('shakeme');
            // alert('hi');
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

        second_card_clicked.addClass('is-flipped');
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
                winModal();
                //disable all card when win
                disableCardClick();
                //disable start function or hide start 

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
            setTimeout(flipback, 700);
            return;
        }
    }
} //end card_clicked


function flipback() {
    //put back ability to click cards
    $('.cardArea').on('click', '.card', card_clicked);
    console.log('in flipback func');
    console.log('at the end attemps: ', attempts);
    console.log('at the end matches ', matches);
    accuracy = matches / attempts;
    console.log('matchs ', matches);
    console.log('accuracy', accuracy);

    first_card_clicked.removeClass('is-flipped');
    second_card_clicked.removeClass('is-flipped');
    first_card_clicked = null;
    second_card_clicked = null;
    display_stats();

    checkwin();
} //flipback()

function checkwin() {
    if (remains == 0) {
        //unclick all card
        // $('.cardArea').off("click");
        disableCardClick();
        //time pause effect 
       

        //use model to show the result
        popUploseModal();
        $('.cardArea').on('click', timeoutModal);
    }
}

function disableCardClick() {
    $('.cardArea').off("click");
    $('.cardContainer').removeClass("cardContainer-hover");
    $('.card-face').removeClass('.card-face-hover');
    $('.cardContainer').removeClass('mouse-pointer');
    $('.cardContainer').addClass('mouse-not-allowed');

    togglePauseClock();
    $('#togglePauseClock').hide();
    $('main').addClass('de-emphasized');
}

function pauseCardClick() {
    $('.cardArea').off("click");
    $('.cardContainer').removeClass("cardContainer-hover");
    $('.card-face').removeClass('.card-face-hover');
    $('.cardContainer').removeClass('mouse-pointer');
    $('.cardContainer').addClass('mouse-not-allowed');

    $('main').addClass('de-emphasized');
}
function recoverPauseCardClick() {
    // $('.cardArea').off("click");
    $('.cardArea').on('click', '.card', card_clicked);
    $('.cardContainer').addClass("cardContainer-hover");
    $('.card-face').addClass('.card-face-hover');
    $('.cardContainer').addClass('mouse-pointer');
    $('.cardContainer').removeClass('mouse-not-allowed');

    $('main').removeClass('de-emphasized');
}

function frozenCardArea() {
    $('.cardArea').off("click");
    $('.cardArea').on('click', timeoutModal);

}
//----------------------below are Modal ----------------------------->
function winModal() {
    $('#win-modelShadow').css('display', 'block');
    setTimeout(function () {
        $('#win-modelShadow').css('display', 'none');
    }, 4000);
}

function popUploseModal() {
    $('#modelShadow').css('display', 'block');
    setTimeout(function () {
        $('#modelShadow').css('display', 'none');
    }, 4000);
} // end popUp()

function timeoutModal() {
    $('#timeout-modelShadow').css('display', 'block');
    setTimeout(function () {
        $('#timeout-modelShadow').css('display', 'none');
    }, 4000);
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
    var seconds = (time - 1) - minutes * 60;
    if (seconds < 10) $('#time').html(minutes + ':0' + seconds);
    else $('#time').html(minutes + ':' + seconds);
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
        changeClock();
        changeTimer();
        // togglePauseClock();
    }
}

//-------------------------------below Timer --------------------------------------->
function togglePauseClock() {
    // $('#timeout-modelShadow').css('display', 'none');
    // $('.cardArea').on('click', '.card', card_clicked);
    toggleFlag();
    
    changeClock();
    changeTimer();
}

function toggleFlag() {
    // debugger;
    if (clockflag == 1 && timerflag == 1) {
        clockflag = 0;
        timerflag = 0;
    } else if (clockflag == 0 && timerflag == 0) {
        clockflag = 1;
        timerflag = 1;
    }
    console.log('after reset and start', clockflag);
}

function changeClock() {
    // debugger;
    console.log('clockflag is ', clockflag)
     // pause
     if (clockflag == 1) {
        pauseCardClick();
        // $('.cardArea').off("click");
        $('#clock').attr('src', 'assets/images/stopclock.jpg');
        $('#togglePauseClock').text('start');
    } 
    //click again
    else if (clockflag == 0) {
        recoverPauseCardClick();
        // $('.cardArea').on('click', '.card', card_clicked);
        $('#clock').attr('src', 'assets/images/Clock.gif');
        $('#togglePauseClock').text('pause');
    }
}

function changeTimer() {
    console.log('timer flag is ', timerflag);
    if (timerflag == 1) {
        stopTimer();
    } else if (timerflag == 0) {
        startTimer();
    }
}
var counter = null;

function stopTimer() {
    // stop the time
    clearInterval(counter);
}

function startTimer() {
    timer();
    counter = setInterval(timer, 1000);
}

var time = 61; //miao
function timer() {
    time--;
    if (time <= 0) {
        $('#timer').html('0:00');
        timeoutModal();
        $('#clock').attr('src', 'assets/images/stopclock.jpg');
        disableCardClick();
        $('.cardArea').on('click', timeoutModal);

        stopTimer();
        return;
    }

    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;
    if (seconds < 10) {
        $('#timer').html(minutes + ':0' + seconds);
    } else {
        $('#timer').html(minutes + ':' + seconds);
    }
}

// -------------------  reset & display result ---------------------->
function reset() {
    createRandonCard();
    reset_stats();
    $('.is-flipped').removeClass('is-flipped');
    $('main').removeClass('de-emphasized');
    $('#togglePauseClock').show();
} //end reset()

function reset_stats() {
    initialTimer();
    initialResult();
    display_stats();
}

function initialResult() {
    matches = 0;
    attempts = 0;
    accuracy = 0;
    remains = 10;
    match_counter = 0;
    first_card_clicked = null;
    second_card_clicked = null;
}

function initialTimer() {
    $('#timer').html('1:00');
    time = 61;
    clockflag = 1;
    timerflag = 1;
    stopTimer();

    console.log('after reset time flag is ', timerflag);
    $('.cardArea').off("click");
    $('#clock').attr('src', 'assets/images/stopclock.jpg');
    $('#togglePauseClock').text('Start');
}

function display_stats() {
    console.log("in display func matches, attempts, accuracy", matches, attempts, accuracy);

    games_playedValue.empty();
    games_playedValue.text(games_played);

    remainsValue.empty();
    remainsValue.text(remains);

    accuracyValue.empty();
    accuracyValue.text(Math.round((accuracy) * 100) + "%");
} //end display