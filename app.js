// const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode&daily=apparent_temperature_max,sunrise,sunset,uv_index_max,windspeed_10m_max&timezone=Asia%2FSingapore`


// fetching current position
navigator.geolocation.getCurrentPosition(positionSuccess , positionFailure)

// function when we succesfully fetch position details
function positionSuccess({coords}){
    getWeather(coords.latitude, coords.longitude, Intl.DateTimeFormat().resolvedOptions().timeZone)

}


// function when we cannot fetch location details
function positionFailure(){
    console.log("Please grant location access to fetch weather details...")
}






// ----------------------------------function to fetch weather details---------------
function getWeather(lat , lon , timeZone){
    console.log(lat)
    console.log(lon)
    console.log(timeZone)

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,sunrise,sunset,uv_index_max,windspeed_10m_max&timezone=${timeZone}`)
    .then(response =>{
        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
    }).then(data =>{
        // console.log(data)
        updateWeatherDetails(data)
    })
    // .catch(err=>{
    //     console.log('Error :' + err)
    // })

}




// -----function to update weather details
function updateWeatherDetails(data){
    console.log("The data that i am receiving as a parameter")
    console.log(data.daily)
    // console.log(hourly/)
    console.log(data.hourly)
    updateDaily(data.daily)
    updateHourly(data.hourly) 
    updateOther(data.daily)
    updateMain(data.daily)
    document.querySelector("body").classList.remove("blurred")

}


// function that updates daily content 
function updateDaily(data){

    let forecast__items = document.querySelector(".forceast--items");

    let forecast__item = document.querySelector(".forecast--item")

    // map which stores values for each weathercode

    let map = new Map()

    map.set(0,"Clear sky")
    map.set(1,"Mainly clear")
    map.set(2,"Partly cloudy")
    map.set(3,"Overcast")
    map.set(45,"Foggy")
    map.set(48,"Foggy")
    map.set(51,"Light Drizzle")
    map.set(53,"Moderate Drizzle")
    map.set(55,"Dense Drizzle")
    map.set(56,"Freezing Drizzle")
    map.set(57,"Freezing Drizzle")
    map.set(61,"Slight Rain")
    map.set(63,"Moderate Rain")
    map.set(65,"Dense Rain")
    map.set(66,"Freezing rain")
    map.set(67,"Freezing rain")
    map.set(71,"Snow Fall")
    map.set(73,"Snow Fall")
    map.set(75,"Snow Fall")
    map.set(77,"Snow Grains")
    map.set(80,"Rain Showers")
    map.set(81,"Rain Showers")
    map.set(82,"Rain Showers")
    map.set(85,"Snow Showers")
    map.set(86,"Snow Showers")
    map.set(95,"Thunderstorm")
    map.set(96,"Thunderstorms with hail")
    map.set(99,"Thunderstorms with hail")
    

    let desiredLength = data.weathercode.length;
    forecast__items.innerHTML = '';
    for(let i = 0;i<desiredLength;i++){
        let forecast__item_clone = forecast__item.cloneNode(true)
        // targetting day--section--field
        let forecast__item__day = forecast__item_clone.querySelector(".forecast--item-day")
        if(i === 0){
            forecast__item__day.innerHTML = "Today"
        }else if(i === 1){
            forecast__item__day.innerHTML = "Tomorrow"
        }
        else{
            forecast__item__day.innerHTML = getDayOfWeek(data.time[i])
        }
        // targeting maximum temperature
        let max__temp_field = forecast__item_clone.querySelector(".temp--values-max");
        // targeting minimum temperature
        let min__temp_field = forecast__item_clone.querySelector(".temp--values-min");

        // maximum temperature gettting
        max__temp_field.innerHTML = data.temperature_2m_max[i];
        // minimum temperature getting
        min__temp_field.innerHTML = data.temperature_2m_min[i]; 
        // getting weatherCode
        let weatherCode = data.weathercode[i]
        // getting image 
        let img = forecast__item_clone.querySelector("img")
        // setting imageSource
        img.src = `./images/${weatherCode}.png`
        // setting weather description
        let weather__description = forecast__item_clone.querySelector("#weather--description")
        
        weather__description.innerHTML = map.get(weatherCode)

        forecast__items.appendChild(forecast__item_clone)

    }
}

// function to get day of the week based on a date
function getDayOfWeek(dateString) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const date = new Date(dateString);
  const dayOfWeekIndex = date.getDay();
  const dayOfWeek = daysOfWeek[dayOfWeekIndex];
  return dayOfWeek;
}

// function that updates hourly content
function updateHourly(data){
    let today__items = document.querySelector(".today--items");
    let today__item = today__items.querySelector(".today--item");

    let arr = filter(data)
    today__items.innerHTML = ""

    for(let i = 0;i<arr.length;i=i+4){
        // cloning today item
        let today__item_clone = today__item.cloneNode(true)

        // targetting today item time
        let today__item__time = today__item_clone.querySelector(".today--item--time");
        today__item__time.innerHTML = getTimeFromDateTime(data.time[i]) 

        // targetting today item icon
        let today__item__icon = today__item_clone.querySelector(".today--icon"); 

        // updating image source of the icon
            // getting weatherCode
            let weatherCode = data.weathercode[i]
        today__item__icon.img = `./images/${weatherCode}.png`

        //  getting temperature value
        let today__temp__value = today__item_clone.querySelector(".today--temp--value");
        today__temp__value.innerHTML = data.temperature_2m[i]

        today__items.appendChild(today__item_clone);





    }


}


// function that updates main content 
function updateMain(data){
    let place__description__section = document.querySelector(".place--description--section")

    let temp__value = place__description__section.querySelector("#temp--value")

    let temp__description__value = place__description__section.querySelector("#temp--description--value")

    let main_icon = place__description__section.querySelector('#main--icon');

    weatherCode = data.weathercode[0]
    main_icon.src = `./images/${weatherCode}.png`

     let map = new Map()

    map.set(0,"Clear sky")
    map.set(1,"Mainly clear")
    map.set(2,"Partly cloudy")
    map.set(3,"Overcast")
    map.set(45,"Foggy")
    map.set(48,"Foggy")
    map.set(51,"Light Drizzle")
    map.set(53,"Moderate Drizzle")
    map.set(55,"Dense Drizzle")
    map.set(56,"Freezing Drizzle")
    map.set(57,"Freezing Drizzle")
    map.set(61,"Slight Rain")
    map.set(63,"Moderate Rain")
    map.set(65,"Dense Rain")
    map.set(66,"Freezing rain")
    map.set(67,"Freezing rain")
    map.set(71,"Snow Fall")
    map.set(73,"Snow Fall")
    map.set(75,"Snow Fall")
    map.set(77,"Snow Grains")
    map.set(80,"Rain Showers")
    map.set(81,"Rain Showers")
    map.set(82,"Rain Showers")
    map.set(85,"Snow Showers")
    map.set(86,"Snow Showers")
    map.set(95,"Thunderstorm")
    map.set(96,"Thunderstorms with hail")
    map.set(99,"Thunderstorms with hail")

    temp__description__value.innerHTML = map.get(weatherCode)

    let max_temp = data.temperature_2m_max[0]
    let min_temp = data.temperature_2m_min[0]

    let avg_temp = (max_temp+min_temp)/2

    temp__value.innerHTML = avg_temp.toFixed(2)

}

// function that gets time from a datetimestring
function getTimeFromDateTime(dateTimeString) {
  const time = dateTimeString.split("T")[1];
  return time;
}


// function that filters hourly array and gives only thaqt day's time array
function filter(data){
    let timeArray = data.time;
    let resultantArray = []
    resultantArray.push(timeArray[0])

    for(let i = 1;i<24;i++){
        if(getTimeFromDateTime(timeArray[i]) === "00:00" ){
            break;
        }else{
            resultantArray.push(timeArray[i])
        }
    }
    // console.log(resultantArray)
    return resultantArray
}



function updateOther(data){
    let other__forecast__items = document.querySelector(".other--forecast--items");
    
    // targetting real feel value
    let real__feel__value = other__forecast__items.querySelector(".real--feel--value");
    // targetting wind value
    let wind__value = other__forecast__items.querySelector(".wind--value");
    // targetting uv value
    let uv__value = other__forecast__items.querySelector(".uv--value");
    // sunrise value
    let sunrise__value = other__forecast__items.querySelector(".sunrise--value");
    // sunset value
    let sunset__value = other__forecast__items.querySelector(".sunset--value");

    real__feel__value.innerHTML = data.apparent_temperature_max[0]

    wind__value.innerHTML =data.windspeed_10m_max[0]

    uv__value.innerHTML = data.uv_index_max[0]

    sunrise__value.innerHTML = getTimeFromDateTime(data.sunrise[0]) 

    sunset__value.innerHTML = getTimeFromDateTime(data.sunset[0])
}