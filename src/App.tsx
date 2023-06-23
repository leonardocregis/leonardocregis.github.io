import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ExpensesTable from './ExpensesTable'
import Expence from './Expense';
import generateCsv from './utils';
import {contas, estructure, tipoPgs} from './categories';

type OptionType = {
  [key: string]: string[];
};

const options: OptionType = estructure;

const App: React.FC = () => {
  
  useEffect (() => {
    getCurrentLocaction();

  },[]);
  
  const [counter, setCounter] = useState<number>(0);
  const [date, setDate] = useState<Date>(new Date());
  const [valor, setValor] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedConta, setSelectedConta ] = useState<string>("casa");
  const [selectedTipoPg, setSelectedTipoPg] = useState<string>("dinheiro");
  const [expenses, setExpenses] = useState<Expence[]>([]);

  const handleValor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValor(event.target.value);
  };


  const handleLocation = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value);
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
    setSelectedOption("");
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };


  const handleDateChange = (date: Date) => {
    setDate( date );
  };

  const handleContaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedConta(event.target.value);
  };

  const handleTipoPgChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTipoPg(event.target.value);
  };

  const getCurrentLocaction =  () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation(
          `https://www.google.com/maps?q=${latitude},${longitude}`
        );
      });
    }
  };
  
  const addToList = () => {

    const newListOfExpenses = expenses;
    const newCounter = counter +1;
    const expence : Expence = { 
      id: newCounter,
      data: date, 
      description: description,
      valor: valor,
      location: location,
      category: selectedCategory,
      subcategory: selectedOption,
      conta: selectedConta,
    }
    
    newListOfExpenses.push(expence);
    setExpenses(newListOfExpenses);
    setCounter(newCounter);
    console.log(expenses);
  }
   
  return (
    <div>
      <label htmlFor="date">Date:</label>
      <DatePicker
        id="date"
        name="date"
        selected={date}
        onChange={handleDateChange}
        dateFormat="yyyy/MM/dd"
      />

      <label htmlFor="description">Description:</label>
      <input
        id="description"
        name="description"
        type="text"
        value= {description}
        onChange={handleDescriptionChange}
      />

      <label htmlFor="valor">Valor:</label>
      <input
        id="valor"
        name="valor"
        type="text"
        value={valor}
        onChange={handleValor}
      />

      <label htmlFor="location">Location:</label>
      <input
        id="location"
        name="location"
        type="text"
        value={location}
        onChange={handleLocation}
      />

      {location && (
        <a href={location} target="_blank" rel="noreferrer">
          View on Google Maps
        </a>
      )}
      <div>
        <label htmlFor="category-select">Category:</label>
        <select id="category-select" value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">Select a category</option>
          {Object.keys(options).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {selectedCategory && (
          <div>
            <label htmlFor="option-select">Option:</label>
            <select id="option-select" value={selectedOption} onChange={handleOptionChange}>
              <option value="">Select an option</option>
              {options[selectedCategory].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div>
        <label htmlFor="conta-select">Conta:</label>
        <select id="conta-select" value={selectedConta} onChange={handleContaChange}>
          <option value="">Select a conta</option>
          {Object.keys(contas).map((conta) => (
            <option key={conta} value={parseInt(conta)}>
              {contas[parseInt(conta)]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="tipo-pg-select">Tipo Pagamento:</label>
        <select id="tipo-pg-select" value={selectedTipoPg} onChange={handleTipoPgChange}>
          <option value="">Select a tipo pagamento</option>
          {Object.keys(tipoPgs).map((tipoPg) => (
            <option key={tipoPg} value={parseInt(tipoPg)}>
              {tipoPgs[parseInt(tipoPg)]}
            </option>
          ))}
        </select>
      </div>

      <button onClick={addToList}>Add</button>
      <button onClick={() => { 
        console.log('generating');
        generateCsv(expenses, date);

      }}>Download CSV</button>
      <ExpensesTable expenses = {expenses} />
    </div>
    
  );
};


export default App;
