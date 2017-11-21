$(function(){
  // VARIABLES
  var heartBeat = 0;

  // BINDINGS
  const messagesArea = $('messages');
  const loadButton = $('load');
  const showData = $('showData');
  const $sky = $('sky');

  // FUNCTIONS

  // Create a star.
  function createStar(){
    console.log('create star');
    for (var i = 0; i < heartData.length; i++){
      console.log(i);
      // $sky.append("<div class='star' id='" + id + "'></div>");
    }
  }

  // EVENT HANDLERS
  loadButton.on('click.load', function(e) {
    console.log('load button pressed');
    e.preventDefault();
    e.stopPropagation();

    fetch('https://fitbit-rosa.herokuapp.com/data')
    .then(response => response.json())
    .then((data) => {
      // console.log(data);
      heartBeat = data;
    });
  });

  showData.on('click.data', function() {
    console.log('show button pressed');
    console.log(heartBeat);
    createStar();
  });

});
