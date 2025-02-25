
import axios from 'axios'

class PNRController {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = 'https://pnr-status-indian-railway.p.rapidapi.com';
    this.headers = {
      'X-RapidAPI-Key': this.apiKey,
      'X-RapidAPI-Host': 'pnr-status-indian-railway.p.rapidapi.com'
    };
  }

  async getPNRStatus(pnr) {
    const options = {
      method: 'GET',
      url: `${this.apiUrl}/pnr-check/${pnr}`,
      headers: this.headers
    };

    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default PNRController;
// module.exports = PNRController;
