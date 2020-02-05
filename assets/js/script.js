

document.getElementById('searchBtn').addEventListener('click', event => {
  event.preventDefault();

  fetch(`http://api.openweathermap.org/data/2.5/weather?q=${document.getElementById('search').value}&appid=10207dcb3a245bc5201ad3e3a6420064`)
    .then(r => r.json())
    .then(data => {
      console.log(data);
    })
    .catch(e => console.error(e))

    document.getElementById('search').value = '';
})