import { isAfter, isBefore, isEqual } from "date-fns";

export function checkEmail(email: string) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

export function checkCPF(cpf: string) {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]+/g, "");

  // Verifica se o CPF tem 11 dígitos
  if (cpf.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpf)) return false;

  // Valida o primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  // Valida o segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
}

export function isBetweenDate(
  date: Date | string,
  from: Date | string,
  to: Date | string,
  inclusivity = "()"
) {
  if (!["()", "[]", "(]", "[)"].includes(inclusivity)) {
    throw new Error("Inclusivity parameter must be one of (), [], (], [)");
  }

  const isBeforeEqual = inclusivity[0] === "[",
    isAfterEqual = inclusivity[1] === "]";

  return (
    (isBeforeEqual
      ? isEqual(from, date) || isBefore(from, date)
      : isBefore(from, date)) &&
    (isAfterEqual ? isEqual(to, date) || isAfter(to, date) : isAfter(to, date))
  );
}
