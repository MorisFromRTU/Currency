import React, { useState } from 'react';
import './CurrencyForm.css';
import axios from 'axios';

const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getTwoYearsBefore = () => {
    const today = new Date();
    const year = today.getFullYear() - 2 ;
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

function CurrencyForm() {
  const [startDate, setStartDate] = useState(getTwoYearsBefore());
  const [endDate, setEndDate] = useState(getCurrentDate());
  const [selectedCurrency, setSelectedCurrency] = useState('Доллар США');

  const handleStartDateChange = (event) => {
    const newDate = event.target.value
    if (newDate < getCurrentDate()){
        setStartDate(newDate);
    }else{
        setStartDate(getCurrentDate());
    }
    
    const twoYearsAfter = new Date(event.target.value);
    twoYearsAfter.setFullYear(twoYearsAfter.getFullYear() + 2);
    
    const maxEndDate = twoYearsAfter.toISOString().split('T')[0];
    if (maxEndDate < getCurrentDate()){
        setEndDate(maxEndDate);
    }
  };

  const handleEndDateChange = (event) => {
    const newDate = event.target.value
    if (newDate < getCurrentDate()){
        setEndDate(newDate);
    }else{
        setEndDate(getCurrentDate());
    }
    
    
  };

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };


  const handleSubmit = (event) => {
    event.preventDefault();
  
    const formData = {
      startDate: startDate,
      endDate: endDate,
      selectedCurrency: selectedCurrency
    };
  
    // Отправляем данные на бэкенд методом POST
    axios.post('http://localhost:8000/exchange/fetch_exchange_rates/', formData)
      .then(response => {
        // Выводим ответ от сервера в консоль для отладки
        console.log('Response from server:', response.data);
  
        const responseData = response.data;
  
        axios.get(responseData.url)
          .then(getResponse => {
            console.log('Response from GET request:', getResponse.data);
          })
          .catch(getError => {
            console.error('Error fetching data from backend:', getError);
          });
      })
      .catch(error => {
        console.error('Error sending data to backend:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-label">
        <label htmlFor="startDate">Выберите начало периода</label>
        <input type="date" id="startDate" value={startDate} onChange={handleStartDateChange}/>
      </div>
      <div className="form-label">
        <label htmlFor="endDate">Выберите окончания периода</label>
        <input type="date" id="endDate" value={endDate} onChange={handleEndDateChange} min={startDate} max={endDate} />
      </div>
      <div className="form-label">
        <label htmlFor="selectedCurrency">Выберите валюту</label>
        <select id="selectedCurrency" value={selectedCurrency} onChange={handleCurrencyChange} className="form-select">
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
      <h3>{selectedCurrency}</h3>
    </form>
  );
}


export default CurrencyForm;
    