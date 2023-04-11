import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

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

interface Expence {
  data: Date,
  description: String,
  valor: Number,
  location: String,
  category: String, 
  subcategory: String
}


const listOfExpences: Expence[] = [];

const App: React.FC = () => {
  
  useEffect (() => {
    getCurrentLocaction();

  },[]);
  
  const [date, setDate] = useState<Date>(new Date());
  const [valor, setValor] = useState<number>(0.0);
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleValor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValor(Number(event.target.value));
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
  
  const addToList = () =>{
    const entry : Expence = { 
      data: date, 
      description: description,
      valor: valor,
      location: location,
      category: selectedCategory,
       subcategory: selectedOption
    }
    listOfExpences.push(entry);
    console.log(listOfExpences);
  }

  const generateCsv = () => {
    console.log('processing list of expences ' + listOfExpences.map( val =>[val.data.toLocaleDateString(), val.description, val.location, val.category, val.subcategory]));
    const csvData = [];
    csvData.push(['Date', 'Description','valor','Location','selectedCategory','selectedOption']);
    const aux : any[] = listOfExpences.map( val => [val.data.toLocaleDateString(), val.description, val.valor, val.location, val.category, val.subcategory]);
    const concatenated = csvData.concat(aux);
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(concatenated);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    const csvBuffer = XLSX.write(workbook, {
      bookType: 'csv',
      type: 'array',
    });
    const blob = new Blob([csvBuffer], { type: 'text/csv' });
    FileSaver.saveAs(blob, 'data.csv');
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

      <label htmlFor="description">Valor:</label>
      <input
        id="valor"
        name="valor"
        type="number"
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
      <button onClick={addToList}>Add</button>
      <button onClick={generateCsv}>Download CSV</button>
    </div>
    
  );
};


export default App;
