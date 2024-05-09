import React, { Component } from 'react';
import './CurrencyForm.css';
import axios from 'axios';

class CurrencyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {

      startDate: this.getTwoYearsBefore(),
      endDate: this.getCurrentDate(),
      selectedCurrency: 'Доллар США',
      currencyOptions: {}
    };
  }

  componentDidMount() {
    axios.get('http://localhost:8000/exchange/fetch_exchange_rates/')
      .then(response => {
        const data = response.data;
        const currencyArray = Object.entries(data);
        console.log(currencyArray[0][1])
        this.setState({ currencyOptions: currencyArray[0][1] });
      })
      .catch(error => {
        console.error('Error fetching data from backend:', error);
      });
  }

  getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getTwoYearsBefore() {
    const today = new Date();
    const year = today.getFullYear() - 2;
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  handleStartDateChange = (event) => {
    const newDate = event.target.value;
    if (newDate < this.getCurrentDate()) {
      this.setState({ startDate: newDate });
    } else {
      this.setState({ startDate: this.getCurrentDate() });
    }

    const twoYearsAfter = new Date(event.target.value);
    twoYearsAfter.setFullYear(twoYearsAfter.getFullYear() + 2);

    const maxEndDate = twoYearsAfter.toISOString().split('T')[0];
    if (maxEndDate < this.getCurrentDate()) {
      this.setState({ endDate: maxEndDate });
    }
  };

  handleEndDateChange = (event) => {
    const newDate = event.target.value;
    if (newDate < this.getCurrentDate()) {
      this.setState({ endDate: newDate });
    } else {
      this.setState({ endDate: this.getCurrentDate() });
    }
  };

  handleCurrencyChange = (event) => {
    this.setState({ selectedCurrency: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const formData = {
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      selectedCurrency: this.state.selectedCurrency
    };

    axios.post('http://localhost:8000/exchange/fetch_exchange_rates/', formData)
      .then(response => {
        console.log('Response from server:', response.data);
        const responseData = response.data;
      })
      .catch(error => {
        console.error('Error sending data to backend:', error);
      });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="form-container">
        <div className="form-label">
          <label htmlFor="startDate">Выберите начало периода</label>
          <input type="date" id="startDate" value={this.state.startDate} onChange={this.handleStartDateChange} />
        </div>
        <div className="form-label">
          <label htmlFor="endDate">Выберите окончания периода</label>
          <input type="date" id="endDate" value={this.state.endDate} onChange={this.handleEndDateChange} min={this.state.startDate} max={this.state.endDate} />
        </div>
        <div className="form-label">
          <label htmlFor="selectedCurrency">Выберите валюту</label>
          <select id="selectedCurrency" value={this.state.selectedCurrency} onChange={this.handleCurrencyChange} className="form-select">
            <option value="Доллар США">Доллар США</option>
            <option value="ЕВРО">ЕВРО</option>
            <option value="Фунт стерлингов">Фунт стерлингов</option>
            <option value="Японская йена">Японская йена</option>
            <option value="Турецкая лира">Турецкая лира</option>
            <option value="Индийская рупия">Индийская рупия</option>
            <option value="Китайский юань Жэньминьби">Китайский юань Жэньминьби</option>
          </select>
        </div>
        <button type="submit" className="form-button">Показать данные</button>
        
        
          {Object.keys(this.state.currencyOptions).map(key => <div key={key}>{key}:::{this.state.currencyOptions[key]}</div>)}
          

      </form>
    );
  }
}

export default CurrencyForm;
