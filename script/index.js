const API_KEY = 'DEMO_KEY';
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`;

const previousWeatherButton = document.querySelector('.show-previous-weather-button');
const previousWeather = document.querySelector('.previous-weather');
const currentSolElement = document.querySelector('[data-current-sol]');
const currentDateElement = document.querySelector('.date__day');
const currentTempHighElement = document.querySelector('[data-current-temp-high]');
const currentTempLowElement = document.querySelector('[data-current-temp-low]');
const windSpeedElement = document.querySelector('[data-wind-speed]');
const windDirectionArrow = document.querySelector('.wind__arrow');
const windDirectionText = document.querySelector('[data-wind-direction-text]');

previousWeatherButton.addEventListener('click', e =>{
    previousWeather.classList.toggle('show-weather');
})

let selectedSolIndex;

getWeather().then(sols => {
    selectedSolIndex = sols.length -1;
    displaySelectedSol(sols);
    console.log(sols);

});

function displaySelectedSol(sols) {
    const selectedSol = sols[selectedSolIndex];
    currentSolElement.innerText = selectedSol.sol;
    currentDateElement.innerText = displayDate(selectedSol.date);
    currentTempHighElement.innerText = displayTemperature(selectedSol.maxTemp);
    currentTempLowElement.innerText = displayTemperature(selectedSol.minTemp);
    windSpeedElement.innerText = displaySpeed(selectedSol.windSpeed);
    windDirectionArrow.style.setProperty('--direction', `${selectedSol.windDirectionDegrees}deg`);
    windDirectionText.innerText = selectedSol.windDirectionCardinal;
}

function displayDate(date){
    return date.toLocaleDateString(undefined, {day: 'numeric', month: 'long'})
}

function displayTemperature(temp){
    return Math.round(temp);
}

function displaySpeed(speed){
    return Math.round(speed);
}

function getWeather(){
    return fetch(API_URL).then(res => res.json()).then(data =>{
        const {
            sol_keys,
            validity_checks,
            ...solData
        } = data
        
       return Object.entries(solData).map(([sol,data]) =>{
            return{
                sol: sol,
                minTemp: data.AT.mn,
                maxTemp: data.AT.mx,
                windSpeed: data.HWS.av,
                windDirectionDegrees: data.WD.most_common?.compass_degrees,
                windDirectionCardinal: data.WD.most_common.compass_point,
                date: new Date(data.First_UTC)
            }
        })
       
    })
}