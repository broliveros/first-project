const form = document.getElementById('weather-form');
const input = document.getElementById('city-input');
const result = document.getElementById('weather-result');

form.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevents the page from refreshing
    const city = input.value.trim();
    if(city === '') {
        result.textContent = 'Please enter a city name.';
        return;
    }

    getWeather(city);
});

async function getWeather(city) {
    const apiKey = `15af2d85d2f044bbb7b21731250307`
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('City not found');
    
        const data = await response.json();
        const temp = data.current.temp_c;
        const condition = data.current.condition.text;

        result.innerHTML = `
        <h3>${data.location.name}, ${data.location.country}</h3>
        <p>${temp}°C - ${condition}</p>
            `;
    } catch (error) {
        result.textContent = error.message;
    }
}