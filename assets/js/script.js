let appid = '10207dcb3a245bc5201ad3e3a6420064';

document.getElementById('searchBtn').addEventListener('click', event => {
event.preventDefault();
document.getElementById('cardItem').style.visibility = 'visible';
let todayDate;

let coordinates = [];
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${document.getElementById('search').value}&appid=${appid}`)
    .then(r => r.json())
    .then(data => {
     
     coordinates.push(data.coord.lon);
     coordinates.push(data.coord.lat);

     fahrenheit = kelvinToFahrenheit(Number(data.main.temp))

     todayDate = moment.unix(data.dt).format('MM/DD/YYYY');

     document.getElementById('cityName').textContent = data.name + ' ' + todayDate;
     document.getElementById('weatherImg').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
     document.getElementById('weatherImg').alt = `${data.weather[0].main}`;
     document.getElementById('temp').textContent = fahrenheit;
     document.getElementById('humid').textContent = data.main.humidity;
     document.getElementById('windSpd').textContent = data.wind.speed

     let cityLink = document.createElement('a');
     cityLink.innerHTML = `
     <a href="#!" class="collection-item" id=${data.name}>${data.name}</a>
     `
     document.getElementById('collections').append(cityLink);
     localStorage.setItem(`${data.name}`, `${data.name}`)

     document.getElementById('search').value = '';

      fetch(`https://api.openweathermap.org/data/2.5/uvi?appid=${appid}&lat=${coordinates[1]}&lon=${coordinates[0]}`)
        .then(r => r.json())
        .then(data => {

          document.getElementById('uv').textContent = data.value;
        })
        .catch(e => console.error(e));
     
        fetch(`https://api.openweathermap.org/data/2.5/forecast?appid=${appid}&lat=${coordinates[1]}&lon=${coordinates[0]}`)
          .then(r => r.json())
          .then(({list}) => {
            
            document.getElementById('forecast').innerHTML = ''; 
            
            let heading = document.createElement('h5');
            heading.textContent = '5-Day Forecast: ';

            document.getElementById('forecast').append(heading);
            console.log(list);
            for (let i = 0; i < list.length; i++){
              console.log(list[i].dt)
            let date = moment.unix(list[i].dt).format("MM/DD/YYYY");
            
              console.log(list[i])
              if ((date === todayDate) || (i > 0 && (date === moment.unix((list[i - 1].dt)).format("MM/DD/YYYY")))) {
              
              continue;

            } else {

            console.log(list[i].weather[0].icon);
            let forecastCard = document.createElement('div');
            let tempFahr = kelvinToFahrenheit(Number(list[i].main.temp))

            forecastCard.classList = 'col s3';
            forecastCard.innerHTML = `
            <div class="card horizontal blue">
            <div class="card-content black-text">  
               <h6><strong>${moment.unix(list[i].dt).format("MM/DD/YYYY")}</strong></h6> 
               <img src="https://openweathermap.org/img/wn/${list[i].weather[0].icon}@2x.png" alt='${list[i].weather[0].description}' id='img'>
               <h6>Temp: ${tempFahr}°F</h6>
               <h6>Humidity: ${list[i].main.humidity}%</h6>
            </div>   
            </div>
            ` 

            document.getElementById('forecast').append(forecastCard); 
            }  
          }

          })

          .catch(e => console.error(e));
    })

    .catch(e => console.error(e))

})

function kelvinToFahrenheit(num){
  return parseInt((num - 273.15) * (9/5) + 32);
}