window.onload = function(){
  // VARIABLES
  var heartBeat = 0;

  // BINDINGS
  const messagesArea = document.getElementById('messages');
  const loadButton = document.getElementById('load');
  const showData = document.getElementById('showData');

  // FUNCTIONS

  // Create a star.
  function createStar(){
    console.log('create star');
    for (var i = 0; i < heartData.length; i++){
      console.log(i)
    }
  }

  // EVENT HANDLERS
  loadButton.addEventListener('click', (e) => {
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

  showData.addEventListener('click', (e) => {
    console.log('show button pressed');
    console.log(heartBeat);
    createStar();
  });

}
