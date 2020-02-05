let appid = '10207dcb3a245bc5201ad3e3a6420064';

document.getElementById('searchBtn').addEventListener('click', event => {
event.preventDefault();
document.getElementById('cardItem').style.visibility = 'visible';

let coordinates = [];
  fetch(`http://api.openweathermap.org/data/2.5/weather?q=${document.getElementById('search').value}&appid=${appid}`)
    .then(r => r.json())
    .then(data => {
     
     coordinates.push(data.coord.lon);
     coordinates.push(data.coord.lat);

     fahrenheit = kelvinToFahrenheit(Number(data.main.temp))

     document.getElementById('cityName').textContent = data.name + ' ' + moment.unix(data.dt).format('MM/DD/YYYY');
     document.getElementById('temp').textContent = fahrenheit;
     document.getElementById('humid').textContent = data.main.humidity;
     document.getElementById('windSpd').textContent = data.wind.speed

     let cityLink = document.createElement('a');
     cityLink.innerHTML = `
     <a href="#!" class="collection-item" id=${data.name}>${data.name}</a>
     `
     document.getElementById('collections').append(cityLink);

     document.getElementById('search').value = '';

      fetch(`http://api.openweathermap.org/data/2.5/uvi?appid=${appid}&lat=${coordinates[1]}&lon=${coordinates[0]}`)
        .then(r => r.json())
        .then(data => {

          document.getElementById('uv').textContent = data.value;
        })
        .catch(e => console.error(e));
     
        fetch(`http://api.openweathermap.org/data/2.5/forecast?appid=${appid}&lat=${coordinates[1]}&lon=${coordinates[0]}`)
          .then(r => r.json())
          .then(({list}) => {
            console.log(list)
            for (let i = 1; i < 6; i++){
            let forecastCard = document.createElement('div');
            forecastCard.classList = 'col s2';
            forecastCard.innerHTML = `
            <div class="card small blue">
               <h6>${moment.unix(list[(i * 5) + 3].dt).format("MM/DD/YYYY")}</h6>    
            </div>
            ` 
            document.getElementById('forecast').append(forecastCard); 
            }          
          })
          .catch(e => console.error(e));
    })
    .catch(e => console.error(e))


})

function kelvinToFahrenheit(num){
  return parseInt((num - 273.15) * (9/5) + 32);
}