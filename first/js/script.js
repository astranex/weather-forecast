const link = 'http://api.weatherstack.com/current?access_key=67aa02db45170b4a48de0428f1480177'

// language = ru русский язык API поддерживается только на профессиональном тарифном плане

const root = document.querySelector('#root')
const popup = document.querySelector('#popup')
const textInput = document.querySelector('#text-input')
const form = document.querySelector('#form')
const close = document.querySelector('#close')

let storage = {
   city: 'Luhansk',
   temperature: 0,
   observationTime: '00:00 AM',
   isDay: 'yes',
   description: '',

   properties: {
      cloudcover: {},
      humidity: {},
      windSpeed: {},
      pressure: {},
      uvIndex: {},
      visibility: {},

   }
}

const fetchData = async () => {
   // Перед круглыми скобками пишем async (значит асинхронная функция)
   const query = localStorage.getItem('query') || storage.city
   const result = await fetch(`${link}&query=${query}`) // Через & можем указать параметр
   const data = await result.json()

   // console.log(data.current.feelslike)
   // console.log(data.request.language)
   // console.log(data)

   const { 
      current: { 
         cloudcover, 
         temperature, 
         humidity, 
         observation_time: observationTime, // Присваиваем новое название переменной в стиле camelCase
         pressure, 
         uv_index: uvIndex, 
         visibility, 
         is_day: isDay, 
         weather_descriptions: description, 
         wind_speed: windSpeed 
      }, // Мы берём значения для этих переменных из одноименных свойств объекта data (подобъекта current)
      location: { name }, // Берём имя из одноименного свойства вложенного объекта location объекта data
    } = data //// Деструктуризация

   storage = {
      ...storage,
      city: name,
      // feelslike: feelslike, // Сетаем для одноименного параметра storage его аналог из data // Одноименное слово можно не писать дважды
      temperature,
      // observationTime: observation_time, // В js принято писать стилем camelCase, поэтому необходимо присвоить значение объектного словосочетания нашей переменной, но ещё проще задать будущее название переменной ещё при деструктуризации
      
      observationTime: observationTime.replaceAll(/AM|PM/gm, ''), // Для русского языка можно убрать AM и PM
      // observationTime,

      isDay,
      description: description[0], // Всегда берём нулевой элемент массива description из объекта data

      properties: {
         cloudcover: {
            title: "Облачность",
            // title: "Cloudcover",
            value: `${cloudcover}%`,
            icon: "cloud.png",
          },
          humidity: {
            title: "Влажность",
            // title: "Humidity",
            value: `${humidity}%`,
            icon: "humidity.png",
          },
          windSpeed: {
            title: "Скорость ветра",
            // title: "Wind Speed",
            value: `${windSpeed} км/ч`,
            icon: "wind.png",
          },
          pressure: {
            title: "Давление",
            // title: "Pressure",
            value: `${pressure} мб`,
            icon: "gauge.png",
          },
          uvIndex: {
            title: "УФ-индекс",
            // title: "UV-index",
            value: `${uvIndex}-й уровень`,
            icon: "uv-index.png",
          },
          visibility: {
            title: "Видимость",
            // title: "Visibility",
            value: `${visibility} км`,
            icon: "visibility.png",
          },
   
      }

   }

   renderComponent()

   // console.log('data', data)
   // console.log('1', feelslike)
   // console.log('2', cloudcover)
   // console.log('3', temperature)
   // console.log('name', name)

}

function getImage(description) {
   const value = description.toLowerCase()
 
   switch (value) {
     case "overcast":
       return "overcast.png"
     case "partly cloudy":
       return "partly.png"
     case "fog":
       return "fog.png"
     case "sunny":
       return "sunny.png"
     case "cloud":
       return "cloud.png"
     case "clear":
      return "clear.png"
     default:
       return "the.png"
   }
}

function getDescription(description) {
   const value = description.toLowerCase()

   switch (value) {
      case "overcast":
        return "Пасмурно"
      case "partly cloudy":
        return "Переменная облачность"
      case "fog":
        return "Туманно"
      case "sunny":
        return "Солнечно"
      case "cloud":
        return "Облачно"
      case "clear":
         return "Ясно"
      case "light rain shower":
         return "Лёгкий ливень"
      case "moderate or heavy rain shower":
         return "Умеренный или сильный ливень"
      default:
        return description
    }
}

function renderProperty(properties) {

   // console.log(properties)
   return Object.values(properties).map(({ title, value, icon }) => { // Сразу в мапе деструктуризируем
      // console.log(title, value, icon) // С помощью Object.entries возвращаем массив свойств необходимого объекта и работаем с ним через map
 
      return `<div class="property">
               <div class="property-icon">
               <img src="./img/icons/${icon}" alt="">
               </div>
               <div class="property-info">
               <div class="property-info__value">${value}</div>
               <div class="property-info__description">${title}</div>
               </div>
            </div>`
      }).join('')
}

function markup() {
   const { city,  description, observationTime, temperature, isDay, properties } = storage // Деструктуризация, создаём локальные переменные и берём значения из одноименных свойств объекта

   const containerClass = isDay === 'yes' ? 'is-day' : ''

   return `<div class="container ${containerClass}">
            <div class="top">
            <div class="city">
               <div class="city-subtitle">Погода в городе</div>
                  <div class="city-title" id="city">
                  <span>${city}</span>
               </div>
            </div>
            <div class="city-info">
               <div class="top-left">
               <img class="icon" src="./img/weather/${getImage(description)}" alt="" />
               <div class="description">${getDescription(description)}</div>
            </div>
            <div class="top-right">
               <div class="city-info__subtitle">По состоянию на ${observationTime}</div>
               <div class="city-info__title">${temperature}°</div>
            </div>
            </div>
         </div>
         <div id="properties">${renderProperty(properties)}</div>
         </div>`
}

function renderComponent() {
   root.innerHTML = markup() // Вставляем заранее подготовленную вёрстку markup в приложение
   
   const city = document.querySelector('#city')
   city.addEventListener('click', togglePopupClass)
}

function togglePopupClass() {
   popup.classList.toggle('active')
}

// function googleTranslateElementInit() {
//    new google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: 'ru'}, 'google_translate_element');
//  }

function handleInput(e) {
   storage = {
      ...storage, // storage равняется одъекту storage, в котором свойство city равно e.target.value
      city: e.target.value
   }
}

function handleSubmit(e) {
   e.preventDefault()

   const value = storage.city
   if (!value) return null // Если city не задано, возвращаем null

   localStorage.setItem('query', value)
   fetchData()
   togglePopupClass()
}

form.addEventListener('submit', handleSubmit)
textInput.addEventListener('input', handleInput)
close.addEventListener('click', togglePopupClass)

fetchData()