export const normalizeNumberOnly = (value: string | undefined) => {
    if (!value) return ''
    return value.replace(/[\D]/g, '')
}

export const normalizePhoneNumber = (value: string | undefined) => {
    if (!value) return ''

    return value.replace(/[\D]/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})(\d+?)/, '$1')
}

export const normalizeCnpjNumber = (value: string | undefined) => {
    if (!value) return ''
    const pureValue = value.replace(/[\D]/g, '')
    if (pureValue.length <= 11) {
        return pureValue
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                .replace(/(-\d{2})\d+?$/, '$1')
    }
    return pureValue
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1')
}

export const normalizeCepNumber = (value: string | undefined) => {
    if (!value) return ''
    return value.replace(/\D/g, "")
        .replace(/^(\d{5})(\d{3})/, "$1-$2")
        .replace(/(-\d{3})(\d+?)/, '$1')
        .substring(0, 9)
}

export const normalizePercentual = (value: string | undefined) => {
    if (!value) return '0.00%'
    const valueMultiplicado = parseFloat(value)
    if(isNaN(valueMultiplicado)){
        return '0.00%'
    }
    return valueMultiplicado.toLocaleString("pt-BR", { style: "percent", minimumFractionDigits: 2 });
}