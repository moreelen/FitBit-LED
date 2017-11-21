window.onload = function(){
  // VARIABLES
  var heartBeat = 0;

  // BINDINGS
  const messagesArea = document.getElementById('messages');
  const loadButton = document.getElementById('load');
  const showData = document.getElementById('showData');
  const sky = document.getElementById('sky');

  // FUNCTIONS

  // Create a star.
  function createStar(){
    console.log('create star');
    for (var i = 0; i < heartBeat.length; i++){
      var left = spliceTime(heartBeat[i].time);
      var star = document.createElement("div");
      star.className = "star";
      star.id = i;
      star.style.bottom = heartBeat[i].value + "px";
      star.style.left = left + "%";
      console.log(star);
      sky.appendChild(star);
    }
  }

  // Transform time value into x coordinate.
  function spliceTime(time){
    time = time.split(":");
    time = time[0] + time[1];
    time = (time / 2459) * 100;
    return time;
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
