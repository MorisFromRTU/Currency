import React, { Component } from 'react';
import CurrencyList from './components/CurrencyList';
import CurrencyForm from './components/CurrencyForm';
import './App.css';
class App extends Component {
  state = {
    isCurrencyListVisible: false,
    isCurrencyFormVisible: false 
  };

  toggleCurrencyList = () => {
    this.setState(prevState => ({
      isCurrencyListVisible: !prevState.isCurrencyListVisible
    }));
  };

  toggleCurrencyForm = () => {
    this.setState(prevState => ({
      isCurrencyFormVisible: !prevState.isCurrencyFormVisible
    }));
  };

  render() {
    const { isCurrencyListVisible, isCurrencyFormVisible } = this.state;

    return (
      <div className="container">
        <div className="block">
          <button className="toggle_button" onClick={this.toggleCurrencyList}>
            {isCurrencyListVisible ? 'Скрыть список валют' : 'Показать список валют'}
          </button>
          {isCurrencyListVisible && <CurrencyList />}
        </div>

        <div className="block">
          <button className="toggle_button" onClick={this.toggleCurrencyForm}>
            {isCurrencyFormVisible ? 'Скрыть курс валют' : 'Показать курс валют'}
          </button>
          {isCurrencyFormVisible && <CurrencyForm />}
        </div>
      </div>

    );
  }
}

export default App;
