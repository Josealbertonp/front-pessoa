/**
 * Formata o CPF para o formato "xxx.xxx.xxx-xx"
 * 
 * @param {string} cpf - CPF a ser formatado, pode incluir ou não caracteres especiais.
 * @returns {string} O CPF formatado.
 */
export const formatCPF = (cpf) => {
    return cpf
        .replace(/\D/g, '')  // Remove caracteres não numéricos
        .replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
        .slice(0, 14);
};

/**
 * Valida um CPF.
 * 
 * @param {string} cpf - CPF a ser validado.
 * @returns {boolean} Retorna true se o CPF for válido, caso contrário, retorna false.
 */
export const isValidCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;

    let sum = 0;
    let rest;
    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf[i - 1]) * (11 - i);
    }
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cpf[9])) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf[i - 1]) * (12 - i);
    }
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cpf[10])) return false;

    return true;
};

/**
 * Valida um endereço de e-mail.
 * 
 * @param {string} email - O e-mail a ser validado.
 * @returns {boolean} Retorna true se o e-mail for válido, caso contrário, retorna false.
 */
export const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
};

/**
 * Formata uma data no formato "dd/mm/yyyy".
 * 
 * @param {string} date - Data no formato "yyyy-mm-dd".
 * @returns {string} Data formatada no formato "dd/mm/yyyy".
 */
export const formatDate = (date) => {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
};

/**
 * Converte uma data para o formato "yyyy-mm-dd" para edição.
 * 
 * @param {string} date - Data no formato "dd/mm/yyyy".
 * @returns {string} Data formatada no formato "yyyy-mm-dd".
 */
export const formatDateForEdit = (date) => {
    if (!date) return '';
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
};
