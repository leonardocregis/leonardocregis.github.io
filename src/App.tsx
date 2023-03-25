import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

interface FormState {
  date: Date;
  description: string;
  valor: number;
  location: string;
}

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
  const [formState, setFormState] = useState<FormState>({
    date: new Date(),
    description: '',
    valor: 0,
    location: '',
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
    setSelectedOption("");
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleDateChange = (date: Date) => {
    setFormState({ ...formState, date });
  };

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setFormState({
          ...formState,
          location: `https://www.google.com/maps?q=${latitude},${longitude}`,
        });
      });
    }
  }, [formState]);



  const addToList = () =>{
    const entry : Expence = { 
      data: formState.date, 
      description: formState.description,
      valor: formState.valor,
      location: formState.location,
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
        selected={formState.date}
        onChange={handleDateChange}
        dateFormat="yyyy/MM/dd"
      />

      <label htmlFor="description">Description:</label>
      <input
        id="description"
        name="description"
        type="text"
        value={formState.description}
        onChange={handleFormChange}
      />

      <label htmlFor="location">Location:</label>
      <input
        id="location"
        name="location"
        type="text"
        value={formState.location}
        onChange={handleFormChange}
        readOnly
      />

      {formState.location && (
        <a href={formState.location} target="_blank" rel="noreferrer">
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
