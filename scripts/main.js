// globals
let allPersons = [];
let total_clicks = 0;
let correct_clicks = 0;

const MAX_PERSONS_DISPLAY = 4;

$.ajax({
    url: 'https://willowtreeapps.com/api/v1.0/profiles/',
    ifModified: true,
    dataType: 'json',
    success: function(people) {
    	 allPersons = people;
       let vm = new ViewModel();
       vm.updateQuizPeople();
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

// Model
let Person = function(data) {

	var self = this;
  this.id = data.id;
	this.firstName = ko.observable(data.firstName);
	this.lastName = ko.observable(data.lastName);
	this.jobTitle = data.jobTitle;
	this.imgSrc = ko.observable(data.headshot.url);
  this.cssClass = ko.observable("");

  this.fullName = ko.pureComputed(function() {
    return this.firstName() + " " + this.lastName();
  }, this);

};
// ViewModel
let ViewModel = function() {
  let self = this;
  const randomValues = new Set();
  self.quizPeople = ko.observableArray([]);
  self.currentPerson = ko.observable();

  self.updateQuizPeople = function() {
    randomValues.clear();
    // get 4 unique random indices
    while (randomValues.size < MAX_PERSONS_DISPLAY) {
      let random = getRandomInt(allPersons.length);
      // do not show people with no picture
      if (allPersons[random].headshot.url) {
        randomValues.add(random);
      }
    }
    for (let item of randomValues) {
      self.quizPeople.push(new Person(allPersons[item]));
    }
    let random = getRandomInt(MAX_PERSONS_DISPLAY);
    self.currentPerson(self.quizPeople()[random]);
  };

  self.checkAnswer = function(clickedPerson) {
    total_clicks++;
    if (clickedPerson.id === self.currentPerson().id) {
      correct_clicks++;
      clickedPerson.cssClass("overlay-green");
    }
    else {
      clickedPerson.cssClass("overlay-red");
    }
  };
};
