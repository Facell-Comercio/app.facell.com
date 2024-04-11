import * as XLSX from 'xlsx';

const exportToExcel = (data: any, name: string) => {
    // Criar uma nova planilha
    const workbook = XLSX.utils.book_new();
    console.log("APARENTEMENTE FUNCIONOU");
    
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Adicionar a planilha ao livro
    XLSX.utils.book_append_sheet(workbook, worksheet, name.charAt(0).toUpperCase() + name.slice(1).toLowerCase());

    // Converter o livro em um blob
    const wbBlob = new Blob([XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })], {
      type: 'application/octet-stream'
    });

    // Criar um URL para o blob
    const blobURL = URL.createObjectURL(wbBlob);

    // Criar um link temporário para o download
    const link = document.createElement('a');
    link.href = blobURL;
    link.setAttribute('download', `${name.toLowerCase()}.xlsx`);
    document.body.appendChild(link);

    // Clicar no link para iniciar o download automaticamente
    link.click();

    // Remover o link depois que o download for iniciado
    setTimeout(() => {
      URL.revokeObjectURL(blobURL);
      document.body.removeChild(link);
    }, 100);
  };

  export default{
    exportToExcel
  }