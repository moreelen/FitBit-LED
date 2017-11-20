// window.addEventListener('DOMContentLoaded', () => {
//   const messagesArea = document.getElementById('messages');
//   const loadButton = document.getElementById('load');
//   loadButton.addEventListener('click', () => {
//     messagesArea.innerText = 'Loading...';
//     function reqListener() {
//       messagesArea.innerText = 'Done!!';
//     }
//
//     const oReq = new XMLHttpRequest();
//     oReq.addEventListener('load', reqListener);
//     oReq.open('GET', 'https://fitbit-rosa.herokuapp.com/token');
//     oReq.send();
//   });
// });

window.onload = function(){

    const messagesArea = document.getElementById('messages');
    // const authButton = document.getElementById('auth');
    const loadButton = document.getElementById('load');
    // authButton.addEventListener('click', (e) => {
    //   e.preventDefault();
    //   messagesArea.innerText = 'Loading...';
    //   function reqListener() {
    //     messagesArea.innerText = 'Done!!';
    //   }
    //
    //   const oReq = new XMLHttpRequest();
    //   oReq.addEventListener('load', reqListener);
    //   oReq.open('GET', 'https://fitbit-rosa.herokuapp.com/token');
    //   oReq.send();
    // });

    loadButton.addEventListener('click', (e) => {
      console.log('load button pressed');
      e.preventDefault();
      e.stopPropagation();

      // function reqListener(data) {
      //   console.log('data', data);
      // }
      //
      // const oReq = new XMLHttpRequest();
      // oReq.addEventListener('load', reqListener);
      // oReq.open('GET', '/data');
      // oReq.send();

      fetch('https://fitbit-rosa.herokuapp.com/data')
      .then(response => response.json())
      .then(function(data) {
        console.log('data', data);
      });
    });




  var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    angles = d3.range(0, 2 * Math.PI, Math.PI / 200);

  var path = svg.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .attr("fill", "none")
    .attr("stroke-width", 10)
    .attr("stroke-linejoin", "round")
    .selectAll("path")
    .data(["cyan", "magenta", "yellow"])
    .enter().append("path")
    .attr("stroke", function(d) { return d; })
    .style("mix-blend-mode", "darken")
    .datum(function(d, i) {
      return d3.radialLine()
          .curve(d3.curveLinearClosed)
          .angle(function(a) { return a; })
          .radius(function(a) {
            var t = d3.now() / 1000;
            return 200 + Math.cos(a * 8 - i * 2 * Math.PI / 3 + t) * Math.pow((1 + Math.cos(a - t)) / 2, 3) * 32;
          });
      });

      d3.timer(function() {
        path.attr("d", function(d) {
          return d(angles);
        });
      });
}
