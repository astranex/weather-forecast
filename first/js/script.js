const link = 'http://api.weatherstack.com/current?access_key=910defd469584ba0a43b99f57618d0a6'

// language = ru русский язык API поддерживается только на профессиональном тарифном плане

const root = document.querySelector('#root')

let storage = {
   city: 'Luhansk',
   feelslike: 0,
   cloudcover: 0,
   temperature: 0,
   humidity: 0,
   observationTime: '00:00 AM',
   pressure: 0,
   uvIndex: 0,
   visibility: 0,
   isDay: 'yes',
   description: '',
   windSpeed: 0,
}

const fetchData = async () => { // Перед круглыми скобками пишем async (значит асинхронная функция)
   const result = await fetch(`${link}&query=${storage.city}`) // Через & можем указать параметр
   const data = await result.json()

   // console.log(data.current.feelslike)
   // console.log(data.request.language)
   // console.log(data)

   const { 
      current: { 
         feelslike, 
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
      location: { name }, // Берём имя из одноименного свойства подобъекта location объекта data
    } = data //// Деструктуризация

   storage = {
      ...storage,
      // feelslike: feelslike, // Сетаем для одноименного параметра storage его аналог из data // Одноименное слово можно не писать дважды
      feelslike,
      cloudcover,
      temperature,
      humidity,
      // observationTime: observation_time, // В js приянто писать стилем camelCase, поэтому необходимо присвоить значение объектного словосочетания нашей переменной, но ещё проще задать будущее название переменной ещё при деструктуризации
      observationTime,
      pressure,
      uvIndex,
      visibility,
      isDay,
      description: description[0], // Всегда берём нулевой элемент массива description изи объекта data
      windSpeed,
   }

   renderComponent()

   // console.log('data', data)
   // console.log('1', feelslike)
   // console.log('2', cloudcover)
   // console.log('3', temperature)
   // console.log('name', name)

}

const getImage = (description) => {
   const value = description.toLowerCase();
 
   switch (value) {
     case "partly cloudy":
       return "partly.png";
     case "cloud":
       return "cloud.png";
     case "fog":
       return "fog.png";
     case "sunny":
       return "sunny.png";
     case "cloud":
       return "cloud.png";
     default:
       return "the.png";
   }
}

const markup = () => {
   const { city,  description, observationTime, temperature, isDay } = storage // Деструктуризация, создаём локальные переменные и берём значения из одноименных свойств объекта

   const containerClass = isDay === 'yes' ? 'is-day' : ''

   return `<div class="container ${containerClass}">
            <div class="top">
            <div class="city">
               <div class="city-subtitle">Сегодня в городе</div>
                  <div class="city-title" id="city">
                  <span>${city}</span>
               </div>
            </div>
            <div class="city-info">
               <div class="top-left">
               <img class="icon" src="./img/${getImage(description)}" alt="" />
               <div class="description">${description}</div>
            </div>
            <div class="top-right">
               <div class="city-info__subtitle">По состоянию на ${observationTime}</div>
               <div class="city-info__title">${temperature}°</div>
            </div>
            </div>
         </div>
         <div id="properties"></div>
         </div>`
}

const renderComponent = () => {
   root.innerHTML = markup() // Вставляем заранее подготовленную вёрстку markup в приложение
}

fetchData()