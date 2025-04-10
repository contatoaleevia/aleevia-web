export const GENDER_OPTIONS = [
  { value: 'Homem Cis', label: 'Homem Cis' },
  { value: 'Mulher Cis', label: 'Mulher Cis' },
  { value: 'Mulher Trans', label: 'Mulher Trans' },
  { value: 'Homem Trans', label: 'Homem Trans' },
  { value: 'Não Binário', label: 'Não Binário' },
  { value: 'Prefiro não dizer', label: 'Prefiro não dizer' },
  { value: 'Outros', label: 'Outros' }
];

export const ERROR_MESSAGES = {
  required: 'Este campo é obrigatório.',
  email: 'Por favor, insira um e-mail válido.',
  minlength: 'Este campo deve ter pelo menos 8 caracteres.',
  mismatch: 'As senhas não coincidem.',
  invalidCpf: 'CPF inválido.'
};

export const STEP_TITLES = {
  1: 'Dados pessoais',
  2: 'Dados profissionais',
  3: 'Social',
  4: 'Finalizar'
}; 