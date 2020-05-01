const API_KEY = 'pDczkRYHON09nXHUmsCsPCqZ7Epjyt8yEChvfhnK';
//const API_KEY = 'DEMO_KEY';
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

const previousSolContainer = document.querySelector('.previous-days');
const previousSolTemplate = document.querySelector('[data-previous-sol-template]');

const unitToggle = document.querySelector('.unit__toggle');
const metricRadio = document.querySelector('#cel');
const imperialRadio = document.querySelector('#fah');

previousWeatherButton.addEventListener('click', e =>{
    previousWeather.classList.toggle('show-weather');
})

let selectedSolIndex;
function isMetric(){
    return metricRadio.checked;
}

getWeather().then(sols => {
    selectedSolIndex = sols.length -1;
    displaySelectedSol(sols);
    displayPreviousSols(sols);
    updateUnits();

    unitToggle.addEventListener('click', e =>{
        let notMetric = !isMetric();
        metricRadio.checked = notMetric;
        imperialRadio.checked = !notMetric;
        updateUnits();
        displaySelectedSol(sols);
       
    })

    metricRadio.addEventListener('change', ()=>{
        updateUnits();
        displaySelectedSol(sols);
    })

    imperialRadio.addEventListener('change', ()=>{
        updateUnits();
        displaySelectedSol(sols);
    })
    

});

function displaySelectedSol(sols) {
    const selectedSol = sols[selectedSolIndex];
    currentSolElement.innerText = selectedSol.sol;
    currentDateElement.innerText = displayDate(selectedSol.date);
    currentTempHighElement.innerText = displayTemperature(selectedSol.maxTemp);
    currentTempLowElement.innerText = displayTemperature(selectedSol.minTemp);
    windSpeedElement.innerText = displaySpeed(selectedSol.windSpeed);
    windDirectionArrow.style.setProperty('--direction', `${selectedSol.windDirectionDegrees}deg`);
   // windDirectionText.innerText = selectedSol.windDirectionCardinal;
}

function displayPreviousSols(sols){
    previousSolContainer.innerHTML = ' ';
    sols.forEach((solData,index) => {
        const solContainer = previousSolTemplate.content.cloneNode(true);
        solContainer.querySelector('[data-sol]').innerText = solData.sol;
        solContainer.querySelector('[data-date]').innerText = displayDate(solData.date);
        solContainer.querySelector('[data-temp-high]').innerText = displayTemperature(solData.maxTemp);
        solContainer.querySelector('[data-temp-low]').innerText = displayTemperature(solData.minTemp);
        
        solContainer.querySelector('[data-select-button]').addEventListener('click', () =>{
            selectedSolIndex = index;
            displaySelectedSol(sols);
        })
        previousSolContainer.appendChild(solContainer);
    });
}

function displayDate(date){
    return date.toLocaleDateString(undefined, {day: 'numeric', month: 'long'})
}

function displayTemperature(temp){
    
    if(!metricRadio.checked)
        return Math.round(temp * 1.8 +32);
    
   
    return Math.round(temp);
}

function displaySpeed(speed){
    if(!metricRadio.checked)
        return Math.round(speed * (1/1.609));


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
                windDirectionDegrees: data.WD.most_common.compass_degrees,
                windDirectionCardinal: data.WD.most_common.compass_point,
                date: new Date(data.First_UTC)
            }
        })
       
    })
}

function updateUnits(){
    const tempUnits = document.querySelectorAll('[data-temp-unit]');
    const speedUnits = document.querySelectorAll('[data-speed-unit]');

    tempUnits.forEach(curr =>{
        curr.innerText = metricRadio.checked ? 'C':'F';
    });

    speedUnits.forEach(curr =>{
        curr.innerText = metricRadio.checked ? 'Km/h':'Mph';
    });

}