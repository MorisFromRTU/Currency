import React, { Component } from 'react';
import axios from 'axios';
import './CurrencyList.css';
class CurrencyList extends Component {
  state = {
    currencies: [] 
  };

  componentDidMount() {
    axios.get('http://localhost:8000/exchange/get_currencies/')
      .then(response => {
        const currenciesArray = Object.keys(response.data).map(key => ({
          code: key,
          name: response.data[key]
        }));
        this.setState({ currencies: currenciesArray });
      })
      .catch(error => {
        console.error('Error fetching currencies:', error);
      });
  }

  render() {
    return (
      <div className="currency-list-container">
        <h2 className="currency-list-header">Список валют</h2>
        <ul className="currency-list">
          {this.state.currencies.map(currency => (
            <li key={currency.code} className="currency-item">
              <strong>{currency.code}</strong>: {currency.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default CurrencyList;
