  'use strict'

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAgujPs8WhcgE1Is1n-JsnYjfb4508_q-Y",
  authDomain: "train-b3ca9.firebaseapp.com",
  databaseURL: "https://train-b3ca9.firebaseio.com",
  projectId: "train-b3ca9",
  storageBucket: "train-b3ca9.appspot.com",
  messagingSenderId: "772731693760"
};
firebase.initializeApp(config);


var name;
var destination;
var trainTime;
var frequency;
var currTime;
var nextArrival;
var minsAway;

var database = firebase.database();


$("#submit-Btn").on("click", function(event){

	event.preventDefault();

	name = $("#train-name").val().trim();
	destination = $("#destination").val().trim();
	trainTime = $("#train-time").val().trim();
	frequency = $("#frequency").val().trim();

  database.ref("/trains").push({
  	name: name,
  	destination: destination,
  	trainTime: trainTime,
  	frequency: frequency,
  });

});

database.ref("/trains").on("child_added", function(childSnapshot) {
    currTime = moment();
    var firstTimeConverted = moment(childSnapshot.val().trainTime, "hh:mm").subtract(1, "years");
    console.log("Current time: " +moment(currTime).format("hh:mm"));

    var diffInTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("Difference in time: " +diffInTime);

    var tRemainder = diffInTime % childSnapshot.val().frequency;
    console.log(tRemainder);

    minsAway = childSnapshot.val().frequency - tRemainder;
    console.log("Minutes till train: " +minsAway);

    nextArrival = moment().add(minsAway, "minutes");
    console.log("Arrival time: " +moment(nextArrival).format("hh:mm"));

}, function(errorObject) {
  console.log("Errors handled: " +errorObject.code);
});


// Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
database.ref("/trains").on("child_added", function(childSnapshot) {

  // full list of items to the well
  $("#table-rows").append(
    '<tr>' +
    '<td>' +childSnapshot.val().name+             '</td>' +
    '<td>' +childSnapshot.val().destination+      '</td>' +
    '<td>' +childSnapshot.val().frequency+        '</td>' +
    '<td>' +moment(nextArrival).format("hh:mm")+  '</td>' +
    '<td>' +minsAway+                             '</td>' +
    '</tr>'
    );

// Handle the errors
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});























