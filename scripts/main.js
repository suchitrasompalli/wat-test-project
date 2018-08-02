// globals
let allPersons = [];
let firstNameMatPersons = [];

const MAX_PERSONS_DISPLAY = 5;

$.ajax({
    url: 'https://willowtreeapps.com/api/v1.0/profiles/',
    ifModified: true,
    dataType: 'json',
    success: function(people) {
    	 allPersons = people;
       getMatPersons();
       let vm = new ViewModel();
       vm.defaultUpdate();
       ko.applyBindings(vm);
    },
    fail: function(data) {
    	alert( "error" );
  	}
});

// Generates a random number between 0 and max -1
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getMatPersons() {
  allPersons.forEach(function(person) {
      var patt = new RegExp("Mat");
      if (patt.test(person.firstName)) {
        firstNameMatPersons.push(person);
      }
  });
}

// Model
let Person = function(data) {

	var self = this;
  self.id = data.id;
	self.firstName = ko.observable(data.firstName);
	self.lastName = ko.observable(data.lastName);
	self.jobTitle = data.jobTitle;
	self.imgSrc = ko.observable(data.headshot.url);
  self.cssClass = ko.observable("");

  self.fullName = ko.pureComputed(function() {
    return this.firstName() + " " + this.lastName();
  }, this);

};

// ViewModel
let ViewModel = function() {
  let self = this;
  const randomValues = new Set();
  self.menu = ko.observableArray(["Play", "Team Play", "Mike Search", "M*"]);
  self.quizPeople = ko.observableArray([]);
  self.currentPerson = ko.observable();
  self.total_clicks = ko.observable(0);
  self.correct_clicks = ko.observable(0);

  self.defaultUpdate = function() {
    randomValues.clear();
    // get 4 unique random indices
    while (randomValues.size < MAX_PERSONS_DISPLAY) {
      let random = getRandomInt(allPersons.length);
      // do not show people with no picture
      if (allPersons[random].headshot.url) {
        randomValues.add(random);
      }
    }
    self.quizPeople([]);
    for (let item of randomValues) {
      self.quizPeople.push(new Person(allPersons[item]));
    }
    let random = getRandomInt(MAX_PERSONS_DISPLAY);
    self.currentPerson(self.quizPeople()[random]);
  };

  self.teamUpdate = function() {
    randomValues.clear();
    // get 4 unique random indices
    while (randomValues.size < MAX_PERSONS_DISPLAY) {
      let random = getRandomInt(allPersons.length);
      // do not show people with no picture
      if ((allPersons[random].headshot.url) && (allPersons[random].jobTitle)) {
        randomValues.add(random);
      }
    }
    self.quizPeople([]);
    for (let item of randomValues) {
      self.quizPeople.push(new Person(allPersons[item]));
    }
    let random = getRandomInt(MAX_PERSONS_DISPLAY);
    self.currentPerson(self.quizPeople()[random]);
  };

  self.matUpdate = function() {
    randomValues.clear();
    // get unique random indices
    while (randomValues.size < MAX_PERSONS_DISPLAY) {
      let randomNumber = getRandomInt(firstNameMatPersons.length);
      // do not show people with no picture
      if ((firstNameMatPersons[randomNumber].headshot.url)) {
        randomValues.add(randomNumber);
      }
    }
    self.quizPeople([]);
    for (let item of randomValues) {
      self.quizPeople.push(new Person(firstNameMatPersons[item]));
    }
    let randomNumber = getRandomInt(MAX_PERSONS_DISPLAY);
    self.currentPerson(self.quizPeople()[randomNumber]);
  };

  self.checkAnswer = function(clickedPerson) {
    self.total_clicks(self.total_clicks()+1);
    if (clickedPerson.id === self.currentPerson().id) {
      self.correct_clicks(self.correct_clicks()+1);
      clickedPerson.cssClass("overlay-green");
    }
    else {
      clickedPerson.cssClass("overlay-red");
    }
  };
};
