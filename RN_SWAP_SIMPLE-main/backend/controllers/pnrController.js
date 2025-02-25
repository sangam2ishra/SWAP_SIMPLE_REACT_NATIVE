import axios from 'axios';

class PNRController {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = 'https://irctc-indian-railway-pnr-status.p.rapidapi.com'; // Updated API URL
    this.headers = {
      'x-rapidapi-key': this.apiKey,  // Changed the header key
      'x-rapidapi-host': 'irctc-indian-railway-pnr-status.p.rapidapi.com'  // Updated the host
    };
  }

  async getPNRStatus(pnr) {
    const options = {
      method: 'GET',
      url: `${this.apiUrl}/getPNRStatus/${pnr}`,  // Updated endpoint
      headers: this.headers
    };

    try {
      const response = await axios.request(options);
      // console.log("Here let See!!");
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching PNR status:', error);
      throw error;
    }
  }
}

export default PNRController;
