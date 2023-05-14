import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import ExpensesTable from './ExpensesTable'
import Expence from './Expense';
import formatDate from './utils';

type OptionType = {
  [key: string]: string[];
};

const options: OptionType = {
  alimentacao: ["hortifruti","mercado","padaria","rest / comer na rua leo","restaurante / comer fora"],
  casa: ["cachorro",  "condominio",  "consertos da casa",  "doacoes",  "empregada",  "piraque",  "taxa: iptu / tx incendio",  "utilitarios"],
  educacao: [
    "cursos",
    "livros",
    "viagem"
  ],
  "escola filhos": [
    "Atividades extras",
    "mensalidade",
    "natacao"
  ],
  "gastos pessoais": [
    "antivirus / site",
    "cabelereiro",
    "carol",
    "cashback",
    "fraude",
    "ir",
    "loteria",
    "milhas",
    "presentes leo",
    "presentes casa",
    "reembolso sulamerica",
    "restaurante / festa",
    "roupas leo",
    "roupas luisa",
    "saque",
    "saude",
    "taxa cartao",
    "to be defined"
  ],
  "lazer": [
    "ativides com a luisa",
    "brinquedos",
    "eletronicos",
    "festa e aniversario",
    "gastos excessivos",
    "programa de pontos - livelo",
    "restaurante",
    "streeeming",
    "viagem"
  ],
  "saude": [
    "academia",
    "farmacia leo",
    "farmacia casa",
    "fisioterapia",
    "medicos e exames",
    "plano de saude"
  ],
  "transporte": [
    "estacionamento / pedagio leo",
    "estacionamento / pedagio carol",
    "estacionamento / pedagio casa",
    "gasolina leo",
    "gasolina casa",
    "gastos extras",
    "ipva",
    "manutencao cronos",
    "seguro carro cronos",
    "seguro carro palio"
  ]

};

const contas: string[] = ['casa', 'leo'];


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


  const generateCsv = () => {
    console.log('processing list of expences ' + expenses.map( val =>[val.data.toLocaleDateString(), val.description, val.location, val.category, val.subcategory, val.conta]));
    const csvData = [];
    csvData.push(['Date', 'Description','valor','Location','selectedCategory','selectedOption','conta']);
    const aux : any[] = expenses.map( val => [val.data.toLocaleDateString(), val.description, val.valor, val.location, val.category, val.subcategory, val.conta]);
    const concatenated = csvData.concat(aux);
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(concatenated);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    const csvBuffer = XLSX.write(workbook, {
      bookType: 'csv',
      type: 'array',
    });
    const blob = new Blob([csvBuffer], { type: 'text/csv' });
    const filename:string = formatDate(date) + '-gastos.csv';
    FileSaver.saveAs(blob, filename);
  };
      
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
      <button onClick={addToList}>Add</button>
      <button onClick={generateCsv}>Download CSV</button>
      <ExpensesTable expenses = {expenses} />
    </div>
    
  );
};


export default App;
