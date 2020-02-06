
//API key
let appid = '10207dcb3a245bc5201ad3e3a6420064';

// get cities from local storage and render under search
function renderCities() {
  for (let i = 0; i < localStorage.length; i++) {

    let city = localStorage.getItem(localStorage.key(i));
    let cityListItem = document.createElement('a');
    cityListItem.innerHTML = `
       <a href="#!" class="collection-item" id=${city}>${city}</a>
       `;

    document.getElementById('collections').append(cityListItem);

  }
}

//convert temp to fahrenheit
function kelvinToFahrenheit(num) {
  return parseInt((num - 273.15) * (9 / 5) + 32);
}

// render search history
renderCities();

// search bar click event
document.getElementById('searchBtn').addEventListener('click', event => {

  event.preventDefault();
  
  document.getElementById('cardItem').style.visibility = 'visible';

//variable to store date to be used later in click event
  let todayDate;

  // empty array to store lon and lat to be used later in click event
  let coordinates = [];

  //first fetch for current weather
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${document.getElementById('search').value}&appid=${appid}`)
    .then(r => r.json())
    .then(data => {

      //add coordinates to array
      coordinates.push(data.coord.lon);
      coordinates.push(data.coord.lat);

      //convert temp to fahrenheit
      fahrenheit = kelvinToFahrenheit(Number(data.main.temp))

      //use moment.js to convert unix date 
      todayDate = moment.unix(data.dt).format('MM/DD/YYYY');

      // fill card with current weather
      document.getElementById('cityName').textContent = data.name + ' ' + todayDate;
      document.getElementById('weatherImg').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      document.getElementById('weatherImg').alt = `${data.weather[0].main}`;
      document.getElementById('temp').textContent = fahrenheit;
      document.getElementById('humid').textContent = data.main.humidity;
      document.getElementById('windSpd').textContent = data.wind.speed

      // add latest search to search history
      let cityLink = document.createElement('a');
      cityLink.innerHTML = `
     <a href="#!" class="collection-item" id=${data.name}>${data.name}</a>
     `;

      document.getElementById('collections').append(cityLink);
      //set in local storage
      localStorage.setItem(`${data.name}`, `${data.name}`)
      //clear search bar
      document.getElementById('search').value = '';

      // second fetch request for uv index
      fetch(`https://api.openweathermap.org/data/2.5/uvi?appid=${appid}&lat=${coordinates[1]}&lon=${coordinates[0]}`)
        .then(r => r.json())
        .then(data => {

          document.getElementById('uv').textContent = data.value;
        })
        .catch(e => console.error(e));

      //third fetch for 5 day forecast
      fetch(`https://api.openweathermap.org/data/2.5/forecast?appid=${appid}&lat=${coordinates[1]}&lon=${coordinates[0]}`)
        .then(r => r.json())
        .then(({ list }) => {
          
          //clear old forecast
          document.getElementById('forecast').innerHTML = '';

          //create new cards
          let heading = document.createElement('h5');
          heading.textContent = '5-Day Forecast: ';

          document.getElementById('forecast').append(heading);
          
          //iterate through array of hourly forecast
          for (let i = 0; i < list.length; i++) {
           
            //set date at current index
            let date = moment.unix(list[i].dt).format("MM/DD/YYYY");

            // if the date is same as current date, or same as last checked date, or not at first index, then go to next iteration
            if ((date === todayDate) || (i > 0 && (date === moment.unix((list[i - 1].dt)).format("MM/DD/YYYY")))) {

              continue;
              
              //otherwise list out that day's info
            } else {

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


//click event for search history
document.getElementById('collections').addEventListener("click", event => {
  document.getElementById('search').value = localStorage.getItem(event.target.id);
  document.getElementById('search').click();
})

//click event for clear history
document.getElementById('removeBtn').addEventListener('click', event => {
  event.preventDefault();

  //clear local storage
  localStorage.clear();
  
  //remove searches from screen
  document.getElementById('collections').innerHTML = '';
  renderCities();
})

