$(document).ready(initializeApp);

function initializeApp() {
    createRandonCard();
    $('.cardArea').on('click', '.card', card_clicked);
}//end initializApp

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
var accuracy = 0;
var games_played = 0;

var statsArea = $('.stats');
var games_playedValue = $('.games-played .value');
var attemptsValue = $('.attempts .value');
var accuracyValue = $('.accuracy .value');
//audio should define outside document.ready
//1 to make it gloable
// = getElementById inside document.ready
// if no definition inside .ready. it will find audio 
//before DOM load.
var audio = document.getElementById("myAudio");

var resetButton = $('#reset');
resetButton.on("click", function () {
    reset();
});

function reset() {
    // games_played++;
    reset_stats();
    $('.reveal').removeClass('reveal');
}//end reset()

function reset_stats() {
    matches = 0;
    attempts = 0;
    accuracy = 0;
    match_counter = 0;
    //total_possible_matches = 2;
    display_stats();
    $('.cardArea').on('click', '.card', card_clicked);
}//end reset_stats()

function display_stats() {
    console.log("in display func matches, attempts, accuracy", matches, attempts, accuracy);
   
    games_playedValue.empty();
    games_playedValue.text(games_played);

    attemptsValue.empty();
    attemptsValue.text(attempts);

    accuracyValue.empty(); 
    // console.log('type of accuracy ', typeof(accuracy));-> number
    //accuracy = (((accuracy) * 100).toFixed(2)).toString()  + "%";
    accuracy = Math.round((accuracy) * 100)  ;
    accuracyValue.text(accuracy+ "%");
    
    console.log("in display func matches, attempts, accuracy", matches, attempts, accuracy);
}//end display

//==============  createRandonCard --------------------
function createRandonCard() {
    var cardSrcArr = ["images/elmo.jpg", "images/Abby.png", "images/bert.png", 
                      "images/bigBird.png", "images/Cookie.png", "images/Count.png", 
                      "images/Ernie.png", "images/Oscar.png", "images/Prairie.png"
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
}//end createRandonCard
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

    var image = $("<div>").addClass('image');
    card.append(image);

    var imageElement = $("<img>").addClass('pic').attr('src', picture);
    image.append(imageElement);

    var back = $("<div>").addClass('coveringSide');
    card.append(back);
    var backImage = $("<img>").attr('src', 'images/card-back.jpg').attr('alt', 'back');
    back.append(backImage);
    return container;
}//end creatNewCard
//------------------------createRandonCard end
//later on if use jQuery this. don't need to use $() to wrap. otherwise it need to use [0] to select the element itselfß
function card_clicked() {
    console.log('in car_clicked');
    // true - assign first_card_clicked equal to the html DOM Element that was clicked, return
   var clickedCard = $(this); 
   if(clickedCard.hasClass('reveal')) {
        return;
    }
    
    if (first_card_clicked === null) {
        first_card_clicked = clickedCard;
        console.log('first card click ? ', first_card_clicked);
        imgElement = clickedCard.find('.image img');
        imgsrcFirst = imgElement.attr('src');
        //change cardback to  front =================================
        first_card_clicked.addClass('reveal');
        //===========================================================
        console.log('first card image src ', imgsrcFirst);
        return;
    }
    //when use this without $() jQuery wraper. use else if (second_card_clicked == null) {
    else {
        if(first_card_clicked === clickedCard){
            return;
        }
        second_card_clicked = clickedCard;
        attempts++;
        games_played++;

        console.log(('attempts'), attempts);
        console.log('second card click ? ', second_card_clicked);
        imgElement = clickedCard.find('.image img');
        imgsrcSecond = imgElement.attr('src');

        second_card_clicked.addClass('reveal');
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
            console.log("both card null ", first_card_clicked, second_card_clicked);

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
            setTimeout(flipback, 1000);
            // Be wary of waiting programmatically but not being able to control the user from clicking on cards while the program waits execute the reset of the code
            // Show card back on both elements that are flipped over

            return;
        }
        display_stats();
    }
}//end card_clicked

function flipback() {
    console.log('in flipback func');
    console.log('at the end attemps: ', attempts);
    console.log('at the end matches ', matches);
    accuracy = matches / attempts;
    console.log('matchs ', matches);
    console.log('accuracy', accuracy);

    first_card_clicked.removeClass('reveal');
    second_card_clicked.removeClass('reveal');
    first_card_clicked = null;
    second_card_clicked = null;
    console.log('in flipback func card set null', first_card_clicked, second_card_clicked);
    display_stats(); 
    //user has 4 times to play 
    if (attempts == 4) {
        //unclick all card
        $('.cardArea').off("click");
        
        //use model to show the result
        popUp();
    }
}//flipback()

function popUp() {
    $('#modelShadow').css('display', 'block');
    setTimeout(function() {
        $('#modelShadow').css('display', 'none');
    } ,4000);
}// end popUp()