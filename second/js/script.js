
const cityLink = 'https://geocoding-api.open-meteo.com/v1/search?'
const weatherLink = `https://api.open-meteo.com/v1/forecast`

const dateInfo = document.querySelector('.date-info')
const cityTitle = document.querySelector('.city-title')
const cityTemperature = document.querySelector('.city-temperature')

const days = document.querySelectorAll('.day')
const button = document.querySelector('.open-daily-forecast')


let query = {
   city: 'Луганск',
   language: 'ru',
}

function getImage(weathercode) {
 
   switch (weathercode) {
      case 0: // Чистое небо (ясно)
      case 1: // Преимущественно ясно
         return "weather_icon_full_sun.svg"
      case 2: // Переменная облачность
         return "weather_icon_partly_cloudy.svg"
      case 3: // Пасмурно
      case 45: // Туман
         return "weather_icon_full_clouds.svg"
      case 48: // Изморозь
         return "weather_icon_rime_fog.png"
      case 51: // Морось (легкая)
      case 53: // Морось (умеренная)
      case 55: // Морось (сильная)
         return "weather_icon_sun_rain_clouds.svg"
      case 56: // Ледяная морось (легкая)
      case 57: // Ледяная морось (сильная)
      case 61: // Дождь (легкий)
      case 63: // Дождь (умеренный)
      case 66: // Ледяной дождь (легкий)
         return "weather_icon_cloud_slight_rain.svg"
      case 65: // Дождь (сильный)
      case 67: // Ледяной дождь (сильный)
      case 80: // Ливень (легкий)
      case 81: // Ливень (умеренный)
      case 82: // Ливень (сильный)
         return "weather_icon_rainy.svg"
      case 71: // Снегопад (легкий)
      case 73: // Снегопад (умеренный)
      case 75: // Снегопад (сильный)
      case 77: // Снежные зерна (легкий)
      case 85: // Снег (легкий)
      case 86: // Снег (сильный)
         return "weather_icon_rime_fog.png" // Необходимо заменить
      case 95: // Гроза (легкая или умеренная)
      case 96: // Гроза с градом (легкая)
      case 99: // Гроза с градом (сильная)
         return "weather_icon_thunder.svg"
      default:
         return "sun_loading.svg"
   }
}

const fetchData = async () => {

   const { city, language } = query
   const cityResult = await fetch(`${cityLink}name=${city}&language=${language}`)
   const cityData = await cityResult.json()

   const currentCity = cityData.results[0]
   let { country, name, latitude, longitude } = currentCity

   cityTitle.textContent = name

   const weatherResult = await fetch(`${weatherLink}?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,pressure_msl,precipitation,cloudcover,direct_radiation,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,shortwave_radiation_sum&timezone=Europe%2FMoscow&current_weather=true`)
   const weatherData = await weatherResult.json()

   // document.querySelector('body').append(`${country}, ${name}`)

   const { current_weather, daily, hourly, hourly_units: hourlyUnits} = weatherData
   current_weather.temperature = Math.round(current_weather.temperature)
   cityTemperature.textContent = `${current_weather.temperature > 0 ? '+' + current_weather.temperature : '-' + current_weather.temperature}°`

   console.log(hourly)

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

// Функция открытия списка (display)

function openForecast() {
   days.forEach(day => {
      day.classList.toggle('day-open')
   })
}

// Функция показа списка (opacity)

function showForecast() {
   setTimeout(() => {days.forEach(day => {
      day.classList.toggle('day-visible')
   })}, 150)
}

button.addEventListener('click', openForecast)
button.addEventListener('click', showForecast)