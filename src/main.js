import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import MarsWeather from './services/mars_service.js';
import RoverPhoto from './services/rover_photo_service.js';

const displayPressure = (weatherResponse) => {
    if( 'PRE' in weatherResponse.validity_checks[weatherResponse.sol_keys[6]] && weatherResponse.validity_checks[weatherResponse.sol_keys[6]].PRE.valid === true){    
      $('.showWeatherPressure').append(`<li> Insight Sol ${weatherResponse.sol_keys[6]}: ${weatherResponse[weatherResponse.sol_keys[6]].PRE.av} Pa. </li>`)
      $('.showWeatherPressure').append(`<li> This Sol corresponds to earth date: ${weatherResponse[weatherResponse.sol_keys[6]].First_UTC.slice(0, 10)} </li>`)
    } else {
      $('.showWeatherPressure').append(`Sorry, this data is not currently available`)
      }
    }

const displayTemperature = (weatherResponse) => {
    if( 'AT' in weatherResponse.validity_checks[weatherResponse.sol_keys[6]] && weatherResponse.validity_checks[weatherResponse.sol_keys[6]].AT.valid === true) {
        $('.showWeatherTemperature').append(`<li> Insight Sol ${weatherResponse.sol_keys[6]}: ${weatherResponse[weatherResponse.sol_keys[6]].AT.av} degrees Fahrenheit. </li>`)
      } else {
        $('.showWeatherTemperature').append(`<li> Sorry, the data for Sol ${weatherResponse.sol_keys[6]} is not currently available </li>`)
      }
    }

  const displayPhoto = (response) => {
  $('.rover-photo').append(`<img src=${response.photos[1].img_src}></img>`);
  $('.rover-photo').append(`<img src=${response.photos[14].img_src}></img>`);
  $('.rover-photo').append(`<img src=${response.photos[18].img_src}></img>`);
  $('.rover-photo').append(`<p> Photos from Curiosity rover. Sol: ${response.photos[0].sol} (days since Curiosity landing), equivalent to sol ${parseInt(response.photos[0].sol) - 2241} on Insight rover.</p>`)
  }

const displayErrors = (error) => {
  $('.show-errors').text(`${error}`)
}

$(document).ready(function() {  
  MarsWeather.getWeather()
  .then(function(weatherResponse){
    if(weatherResponse instanceof Error) {
      throw Error(`NASA Weather API ${weatherResponse.message}`);
    }
    displayPressure(weatherResponse);
    displayTemperature(weatherResponse);
    return RoverPhoto.getPhoto(parseInt(weatherResponse.sol_keys[6]) + 2241);
  })
  .then(function(imageResponse) {
    if (imageResponse instanceof Error) {
      throw Error(`NASA Image API ${imageResponse.message}`);
    }
    displayPhoto(imageResponse);
  })
  .catch(function(error) {
    displayErrors(error.message)
  })
  $('#pressure').on('click', function() {
    $('#pressure-readings').toggle();
  });
  $('#temperature').on('click', function() {
    $('#temperature-readings').toggle();
  });
  $('#photo').on('click', function () {
    $('.rover-photo').toggle();
  });
});