## Pré-requisitos

Antes de começar, certifique-se de ter instalado o seguinte em sua máquina:

- Node.js e npm (https://nodejs.org/)
- Python 3.x (https://www.python.org/)
- Um gerenciador de pacotes Python, como pip (normalmente vem com a instalação do Python)

## Configuração do Ambiente Python

1. Clone este repositório em sua máquina local:

   ```bash
   git clone https://github.com/isabellaaquino/pix-importer.git
   ```

2. Navegue até o diretório do projeto:

   ```bash
   cd pix-importer
   ```

3. Crie um ambiente virtual para isolar as dependências do Python:

   ```bash
   python -m venv venv
   ```

4. Ative o ambiente virtual:

   No Windows:

   ```bash
   venv\Scripts\activate
   ```

   No macOS e Linux:

   ```bash
   source venv/bin/activate
   ```

5. Instale as dependências do Python:

   ```bash
   pip install -r requirements.txt
   ```

## Configuração do Ambiente React

1. Navegue até o diretório `frontend` dentro do seu projeto:

   ```bash
   cd frontend
   ```

2. Instale as dependências do Node.js:

   ```bash
   npm install
   ```

## Executando o Projeto

Agora que o ambiente está configurado, você pode iniciar o servidor back-end e o servidor front-end.

1. No diretório raiz do seu projeto, inicie o servidor back-end Python (FastAPI para levantar a API + Websocket):

   ```bash
   uvicorn app:app --host 127.0.0.1 --port 8000
   ```

2. Em outro terminal, navegue até o diretório `frontend` e inicie o servidor de desenvolvimento do React:

   ```bash
   npm start
   ```

3. Abra um navegador e acesse `http://localhost:3000` para ver o aplicativo em execução.
