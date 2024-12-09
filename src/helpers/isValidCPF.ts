export function isValidCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]/g, ""); // Remove caracteres não numéricos
  
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false; // Verifica tamanho e repetição
  
    const calcDigit = (cpf: string, factor: number) =>
      cpf
        .slice(0, factor - 1)
        .split("")
        .reduce((sum, num, idx) => sum + parseInt(num) * (factor - idx), 0);
  
    const checkDigit = (sum: number) => (sum * 10) % 11 % 10;
  
    const digit1 = checkDigit(calcDigit(cpf, 10));
    const digit2 = checkDigit(calcDigit(cpf, 11));
  
    return digit1 === parseInt(cpf[9]) && digit2 === parseInt(cpf[10]);
  }