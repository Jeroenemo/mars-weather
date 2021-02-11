export default class MarsWeather {
  static getWeather() {
    return fetch(`https://api.nasa.gov/insight_weather/?api_key=${process.env.API_KEY}&feedtype=json&ver=1.0`)
      .then(function() {
      if(!response.ok) {
        throw Error(response.status);
      }
      return response.json();
    })
    .catch(function(error) {
      return Error(error);
    })
  }
}


