const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // months are zero-based
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, '0');
  
    return `${day}-${month}-${year}-${hours}`;
  };

export default formatDate;