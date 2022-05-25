
const cityLink = 'https://geocoding-api.open-meteo.com/v1/search?'
const weatherLink = `https://api.open-meteo.com/v1/forecast`


let storage = {
   city: 'Los Angeles',
   language: 'ru',
}

const fetchData = async () => {

   const { city, language } = storage

   const cityResult = await fetch(`${cityLink}name=${city}&language=${language}`)
   const cityData = await cityResult.json()

   console.log(cityData)

   const currentCity = cityData.results[0]
   let { country, name, latitude, longitude } = currentCity

   // country = country.replaceAll('Украина', 'Новороссия')
   console.log(currentCity)

   const weatherResult = await fetch(`${weatherLink}?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,pressure_msl,precipitation,cloudcover,direct_radiation,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,shortwave_radiation_sum&timezone=Europe%2FMoscow&current_weather=true`)

   const weatherData = await weatherResult.json()
   console.log(weatherData)
   console.log(weatherData.hourly)

   document.querySelector('body').append(`${country}, ${name}`)

   for (let i = 0; i < weatherData.daily.time.length; i++) {

      const { daily, hourly_units: hourlyUnits} = weatherData

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
      p.innerHTML = `<p>${daily.time[i]}, ${day}:<br>
      Температура: ${((daily.temperature_2m_min[i] + daily.temperature_2m_max[i]) / 2).toFixed(1)} ${hourlyUnits.apparent_temperature}<br>
      Скорость ветра: ${daily.windspeed_10m_max[i]} км/ч</p>`
      // console.log(data.hourly.apparent_temperature[i] + ' ' + data.hourly_units.apparent_temperature)
      document.querySelector('body').append(p)
   }
}

fetchData()