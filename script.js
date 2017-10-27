$(document).ready(function () {


  var kalkulator = {
    mainScreen: $('#main-screen'),
    lowerScreen: $('#lower-screen'),
    dot: $('#dot'),
    plus: $('#plus'),
    button: $('.button'),
    minus: $('#minus'),
    multi: $('#multi'),
    fixed: $('#fixed'),
    percent: $('#percent'),
    divide: $('#divide'),
    memorySign: '',
    signsArr: ['+', '-', '*', '/'],
    maxLenToReached: 0,

    //create events at the beginning
    addEvent: function () {
      this.button.on('click', this.putScreen);
    },

    //animation to show when button was pressed
    pressButton: function (elem) {
      elem.addClass('clicked');

      //this part is for removing class 'clicked' after animation ends.
      setTimeout(function () {
        $('.clicked').removeClass('clicked');
      }, 110);
    },

    //function to put pressed buttons on screen
    putScreen: function () {
      //animate button
      kalkulator.pressButton($(this));

      //setting limit for number of letters
      kalkulator.maxLenToReached = kalkulator.mainScreen.text().length;

      //mainScreen nie dłuższy niż 20 znaków,
      if (kalkulator.maxLenToReached < 20 || $(this).text() === '.00' || $(this).text() === 'CE') {

        //depending of what was pressed, different results
        kalkulator.getAction($(this).text());

      } else {
        //when there is too many numbers on screen, error will be shown
        kalkulator.showError();
      }

    },

    //round number to 2 numbers after the point
    fixedNumber: function () {

      //value to hold main screen value that is set 2 number after point
      var screenVal = parseFloat(kalkulator.mainScreen.text()).toFixed(2);

      //assign upper variable to main and lower screen
      this.mainScreen.text(screenVal);

      //replace last number with round up version
      this.lowerScreen.text(this.lowerScreen.text().replace(/[0-9]*[.]\)?[0-9]+$/, screenVal));
    },


    //this function will show result in main window
    showResult: function () {

      //main screen has result assigned
      this.mainScreen.text(eval(this.lowerScreen.text()));

      //lower screen has to be equal to main screen, as it made some errors
      this.lowerScreen.text(this.mainScreen.text());
    },

    //function to add pressed button to both, main and lower, screen
    addBoth: function (value) {
      kalkulator.mainScreen.append(value);
      kalkulator.lowerScreen.append(value);
    },

    //this function is handling instances, where user wants to press different sign than he pressed.
    //when he decided that he likes to multiply instead of add, etc.
    signHandler: function (handler) {

      //this is just for multiply, if handler (pressed button) is X, then he should add * (instead of X)
      var specialHandler = handler;
      if (handler === 'X') {
        specialHandler = '*';
      }

      //if main screen has just a sign that is in signsArr (*-+/), then...
      if (this.signsArr.indexOf(this.mainScreen.text()) >= 0) {

        //replace last sign (+-*/) in lower screen to ''
        this.lowerScreen.text(this.lowerScreen.text().replace(/[+\-*\/]$/, ''));

        //clear main screen
        this.mainScreen.text('');

        //add sign to both screens
        this.addBoth(specialHandler);

        //if main screen has a number value..
      } else if (parseFloat(this.mainScreen.text())) {

        //..clear upper screen (as it would add another sign to already existing sign)
        this.clearScreen(this.mainScreen);

        //add sign to both screens
        this.addBoth(specialHandler);
      }
    },


    getAction: function (that) {

      switch (that) {
        case '.':
          //if there isn't any dots, add dot
          if (this.mainScreen.text().indexOf('.') === -1) {
            this.addBoth(that);
          }
          break;
        case '+':
          this.signHandler(that);
          break;
        case '-':
          this.signHandler(that);
          break;
        case '/':
          this.signHandler(that);
          break;
        case 'X':
          this.signHandler(that);
          break;
        case '.00':
          //if main screen has a number, then make it 2 number after the dot
          if (parseFloat(this.mainScreen.text())) {
            this.fixedNumber();
          }
          break;
        case '=':
          this.showResult();
          break;
        case '%':

          //if main screen is a number, divide it by 100
          if (parseFloat(this.mainScreen.text())) {
            this.mainScreen.text(parseFloat(this.mainScreen.text())/100);
          }
          break;
        case 'CE':

          //clear both screens
          this.clearScreen(this.mainScreen);
          this.clearScreen(this.lowerScreen);
          break;
        default: //it's for pressing numbers
          //if main screen content is just just a sign, then remove this sign from upper screen
          //and place number here (removed sign will still be visible in lower screen)
          if (this.signsArr.indexOf(this.mainScreen.text()) !== -1) {
            this.mainScreen.text('');
          }
          this.addBoth(that);
      }
    },

    //clear both screens
    clearScreen: function (elem) {
      elem.text('');
    },

    //i thought I will make more error messages but it's handled differently.
    showError: function () {
      $('#error').text('Za dużo znaków. Jeżeli chcesz zaokrąglić liczbę, wciśnij \".00\". Jeśli zamieniłeś kalkulator w cegłe, wciśnij \"CE\"').removeClass('hide-error');
      this.hideError();
      },

    //after showing error, remove it after 2 sec.
    hideError: function() {
      setTimeout(function () {
        $('#error').addClass('hide-error')
      }, 2000);
    }

  };

  //to start all events
  kalkulator.addEvent();

});