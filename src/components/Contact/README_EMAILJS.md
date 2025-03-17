# Configuração do EmailJS para o Formulário de Contato

Para que o formulário de contato funcione corretamente e envie emails reais, siga estas instruções para configurar o EmailJS:

## Passo 1: Criar uma conta no EmailJS

1. Acesse [EmailJS](https://www.emailjs.com/) e crie uma conta gratuita.
2. Faça login na sua conta.

## Passo 2: Adicionar um serviço de email

1. No painel do EmailJS, vá para "Email Services" e clique em "Add New Service".
2. Escolha o provedor de email que você deseja usar (Gmail, Outlook, etc.).
3. Siga as instruções para conectar sua conta de email.
4. Anote o "Service ID" gerado.

## Passo 3: Criar um template de email

1. No painel do EmailJS, vá para "Email Templates" e clique em "Create New Template".
2. Dê um nome ao seu template (ex: "Formulário de Contato").
3. Crie o conteúdo do seu email. Você pode usar as seguintes variáveis:
   - `{{user_name}}`: Nome do remetente
   - `{{user_email}}`: Email do remetente
   - `{{message}}`: Mensagem enviada

Exemplo de template:

```
Você recebeu uma nova mensagem do seu portfólio:

Nome: {{user_name}}
Email: {{user_email}}

Mensagem:
{{message}}
```

4. Salve o template e anote o "Template ID" gerado.

## Passo 4: Obter sua Public Key

1. No painel do EmailJS, vá para "Account" > "API Keys".
2. Copie sua "Public Key".

## Passo 5: Atualizar o código do componente Contact

Abra o arquivo `src/components/Contact/Contact.jsx` e atualize as seguintes linhas com suas informações:

```javascript
const serviceId = 'service_id'; // Substitua pelo seu Service ID
const templateId = 'template_id'; // Substitua pelo seu Template ID
const publicKey = 'public_key'; // Substitua pela sua Public Key
```

## Importante: Nomes dos campos no formulário

O formulário já está configurado com os seguintes nomes de campos, que devem corresponder às variáveis no seu template:

- `user_name`: Campo de nome
- `user_email`: Campo de email
- `message`: Campo de mensagem

Certifique-se de que seu template use exatamente esses nomes de variáveis.

## Limitações da conta gratuita

A conta gratuita do EmailJS permite enviar até 200 emails por mês. Se você precisar de mais, considere atualizar para um plano pago.

## Testando o formulário

Após configurar tudo, teste o formulário preenchendo todos os campos e clicando em "Enviar". Você deverá receber um email com as informações enviadas.

## Solução de problemas

Se o formulário não estiver funcionando:

1. Verifique se os IDs e a chave pública estão corretos.
2. Verifique o console do navegador para ver se há erros.
3. Certifique-se de que seu serviço de email está configurado corretamente no EmailJS.
4. Confirme que os nomes dos campos no formulário (`user_name`, `user_email`, `message`) correspondem às variáveis no seu template. 