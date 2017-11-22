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
      var bottom = transformHeart(heartBeat[i].value);

      var star = document.createElement("div");
      star.className = "star";
      star.id = i;
      star.style.bottom = bottom + "%";
      star.style.left = left + "%";
      sky.appendChild(star);
    }
  }

  // Transform time value into x coordinate.
  function spliceTime(time){
    time = time.split(":"); // Split out the hours/minutes/seconds.
    time = (parseInt(time[0]) * 60) + parseInt(time[1]); // Add minutes together.
    time = (time / 1440) * 100; // Percentage of minutes in a day.
    return time;
  }

  // Transform heartrate into y coordinate.
  function transformHeart(beat){
    beat = ((parseInt(beat) - 45) / 70) * 100;
    return beat;
  }

  // Grab data.
  function getData(e){
    // e.preventDefault();
    // e.stopPropagation();

    fetch('https://fitbit-rosa.herokuapp.com/data')
    .then(response => response.json())
    .then((data) => {
      // console.log(data);
      heartBeat = data;
    });
    return false;
  }

  // EVENT HANDLERS
  loadButton.addEventListener('click', (e) => {
    console.log('load button pressed');

  });

  showData.addEventListener('click', (e) => {
    console.log('show button pressed');
    getData();
    console.log(heartBeat);
    createStar();
  });

}

// TODO: Add
