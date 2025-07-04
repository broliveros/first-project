const form = document.getElementById('weather-form');
const input = document.getElementById('city-input');
const result = document.getElementById('weather-result');
const loading = document.getElementById('loading');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const city = input.value.trim();
    console.log('[Submit] City entered:', city);
    if (city ==='') {
        result.textContent = 'Please enter a city name.';
        return;
    }

    loading.style.display = 'block';
    result.textContent = '';
    getWeather(city);
});

async function getWeather(city) {
    const apiKey = '15af2d85d2f044bbb7b21731250307'
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;

    console.log('[Fetch] URL:', url);

    try {
        const response = await fetch(url);
        console.log('[Fetch] Response OK:', response.ok);

        if (!response.ok) {
            throw new Error ('City not found or API error.');
        }

            const data = await response.json();
            console.log('[Data] Parsed JSON:', data);

            if (!data || !data.current || typeof data.current.temp_c === 'undefined') {
                throw new Error('Incomplete weather data received.');
            }

            const temp = data.current.temp_c;
            const condition = data.current.condition.text;
            const location = data.location.name;
            const country = data.location.country;

            result.innerHTML = `
            <h3>${location}, ${country}</h3>
            <p>${temp}°C - ${condition}</p>
            `;
        } catch (error) {
            console.error('[Error]', error.message);
            result.textContent = error.message;
        } finally {
            loading.style.display = 'none';
        }
     }

    
