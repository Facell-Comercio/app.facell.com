import * as XLSX from 'xlsx';

export const exportToExcel = (data: any, name: string) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, name.charAt(0).toUpperCase() + name.slice(1).toLowerCase());
    setTimeout(() => {
      XLSX.writeFile(workbook, `${name.toLowerCase()}.xlsx`)
    }, 100);
  };