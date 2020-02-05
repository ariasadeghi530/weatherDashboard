let appid = '10207dcb3a245bc5201ad3e3a6420064';

document.getElementById('searchBtn').addEventListener('click', event => {
event.preventDefault();
let coordinates = [];
  fetch(`http://api.openweathermap.org/data/2.5/weather?q=${document.getElementById('search').value}&appid=${appid}`)
    .then(r => r.json())
    .then(data => {
      console.log(data)
     coordinates.push(data.coord.lon);
     coordinates.push(data.coord.lat);
     fahrenheit = kelvinToFahrenheit(Number(data.main.temp))
     document.getElementById('cityName').textContent = data.name;
     document.getElementById('temp').textContent = fahrenheit;
     document.getElementById('humid').textContent = data.main.humidity;
     document.getElementById('windSpd').textContent = data.wind.speed
      fetch(`http://api.openweathermap.org/data/2.5/uvi?appid=${appid}&lat=${coordinates[1]}&lon=${coordinates[0]}`)
        .then(r => r.json())
        .then(data => {
          console.log(data);
          document.getElementById('uv').textContent = data.value;
        })
        .catch(e => console.error(e));
     
     console.log(coordinates)
    })
    .catch(e => console.error(e))

    document.getElementById('search').value = '';
})

function kelvinToFahrenheit(num){
  return parseInt((num - 273.15) * (9/5) + 32);
}