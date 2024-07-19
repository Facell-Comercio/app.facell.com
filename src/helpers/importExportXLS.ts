import * as XLSX from 'xlsx';

function trim_headers(ws: XLSX.WorkSheet) {
  if (!ws || !ws['!ref']) return;
  var ref = XLSX.utils.decode_range(ws['!ref']);
  for (var C = ref.s.c; C <= ref.e.c; ++C) {
    var cell = ws[XLSX.utils.encode_cell({ r: ref.s.r, c: C })];
    if (cell.t == 's') {
      cell.v = cell.v.trim();
      if (cell.w) cell.w = cell.w.trim();
    }
  }
}

// export const exportToExcel = (data: any, name: string) => {
//   // Iterar entre os objetos do array e converter strings de data em objetos Date
//   const formattedData = data.map((row: any) => {
//     const newRow = { ...row };
//     Object.keys(newRow).forEach((key) => {
//       if (typeof newRow[key] === 'string' && !isNaN(Date.parse(newRow[key]))) {
//         newRow[key] = new Date(newRow[key]).toLocaleDateString('pt-BR');
//       }
//     });
//     return newRow;
//   });

//   const workbook = XLSX.utils.book_new();
//   const worksheet = XLSX.utils.json_to_sheet(formattedData);
//   XLSX.utils.book_append_sheet(workbook, worksheet, 'Planilha1');
//   setTimeout(() => {
//     XLSX.writeFile(workbook, `${name.toUpperCase()}.xlsx`);
//   }, 100);
// };

export const exportToExcel = (data: any, name: string) => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Planilha1');
  setTimeout(() => {
    XLSX.writeFile(workbook, `${name.toUpperCase()}.xlsx`);
  }, 100);
};

export const importFromExcel = (
  data: any,
  type:
    | 'string'
    | 'buffer'
    | 'base64'
    | 'binary'
    | 'file'
    | 'array'
    | undefined = 'buffer'
) => {
  const workbook = XLSX.read(data, { type });
  const worksheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[worksheetName];
  trim_headers(worksheet);
  return XLSX.utils.sheet_to_json(worksheet);
};

//@ts-ignore
export function excelDateToJSDate(serial) {
  // Ponto de início (1900 ou 1904)
  const baseDate = new Date(1900, 0, 1); // 1 de janeiro de 1900
  const days = serial - 2; // Ajuste para o bug do Excel que considera 1900 como ano bissexto
  return new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000);
}
