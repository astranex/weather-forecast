
const cityLink = 'https://geocoding-api.open-meteo.com/v1/search?'
const weatherLink = `https://api.open-meteo.com/v1/forecast`

const dateInfo = document.querySelector('.date-info')
const cityTitle = document.querySelector('.city-title')
const cityTemperature = document.querySelector('.city-temperature')

const days = document.querySelectorAll('.day')
const button = document.querySelector('.open-daily-forecast')

function openForecast() {
   days.forEach(day => {
      day.classList.toggle('day-open')
   })
}

function showForecast() {
   setTimeout(days.forEach(day => {
      day.classList.toggle('day-visible')
   }), 1000)
}
   

button.addEventListener('click', openForecast)
button.addEventListener('click', showForecast)

let storage = {
   city: 'Москва',
   language: 'ru',
}

const fetchData = async () => {

   const { city, language } = storage

   const cityResult = await fetch(`${cityLink}name=${city}&language=${language}`)
   const cityData = await cityResult.json()

   // console.log(cityData)

   const currentCity = cityData.results[0]
   let { country, name, latitude, longitude } = currentCity

   // country = country.replaceAll('Украина', 'Новороссия')
   // console.log(currentCity)

   cityTitle.textContent = name

   const weatherResult = await fetch(`${weatherLink}?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,pressure_msl,precipitation,cloudcover,direct_radiation,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,shortwave_radiation_sum&timezone=Europe%2FMoscow&current_weather=true`)

   const weatherData = await weatherResult.json()
   console.log(weatherData)
   console.log(weatherData.hourly)

   // document.querySelector('body').append(`${country}, ${name}`)

   const { current_weather, daily, hourly_units: hourlyUnits} = weatherData
   current_weather.temperature = current_weather.temperature.toFixed()
   cityTemperature.textContent = `${current_weather.temperature > 0 ? '+' + current_weather.temperature : '-' + current_weather.temperature}°`

   for (let i = 0; i < weatherData.daily.time.length; i++) {

      const days = [
         'Воскресенье',
         'Понедельник',
         'Вторник',
         'Среда',
         'Четверг',
         'Пятница',
         'Суббота'
       ]

      const date = new Date(daily.time[i])
      const day = days[date.getDay()]

      daily.time[i] = daily.time[i]
         .split('-')
         .reverse()
         .join('.') 
      // Преобразовываю дату в привычный вид

      const p = document.createElement('p')
      // p.innerHTML = `<p>${daily.time[i]}, ${day}:<br>
      // Температура: ${((daily.temperature_2m_min[i] + daily.temperature_2m_max[i]) / 2).toFixed(1)} ${hourlyUnits.apparent_temperature}<br>
      // Скорость ветра: ${daily.windspeed_10m_max[i]} км/ч</p>`
      // // console.log(data.hourly.apparent_temperature[i] + ' ' + data.hourly_units.apparent_temperature)
      // document.querySelector('body').append(p)
   }
}

fetchData()