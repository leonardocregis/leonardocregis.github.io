import Expense from "./Expense";
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';


const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // months are zero-based
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, '0');
  
    return `${day}-${month}-${year}-${hours}`;
  };

  const generateCsv = (expenses: Expense[], date: Date) => {
    console.log('processing list of expences [' + expenses.map( val =>[val.data.toLocaleDateString(), val.description, val.location, val.category, val.subcategory, val.conta]) + ']');
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


export default generateCsv;