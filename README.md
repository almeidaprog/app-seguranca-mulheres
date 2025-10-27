# app-seguranca-mulheres
## Passos para usar a aplicacao

### 1. Clonar projeto
```bash
$ git clone [url_do_projeto]
```

### 2. Instalar node e npm e fazer as configuracoes necessarias

- Instalar o node e o npm
- Arrumar as variaveis de ambiente
- Verificar se esta tudo instalado

```bash
cmd

$ node -v
$ npm -v
```


### 3. Abrir um terminal tanto na pasta de backend quanto na de frontend e baixar as dependencias

- Abrir um terminal na pasta raiz do projeto e executar os seguintes comandos
```bash
$ cd backend 
$ npm i
$ cd ..
$ cd frontend
$ npm i 
```
### 4. Criar um arquivo .env na pasta do backend e colocar dentro dele 
```text
CONNECTIONSTRING=[cola aqui a conection string]
```

### 5. Rodar o server do backend 

```bash
#Caso esteja na pasta do front dê um "cd .." antes
$ cd backend
$ npm start
```

> Para parar a aplicacao só apertar Ctrl + C
