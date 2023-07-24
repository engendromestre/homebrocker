# Criar uma API para lidar com a compra/venda de ativos e fazer a integração com o Kafka e o Golang

## Visão geral do projeto da comunicação

- Os usuários do homebroker vão acessar a aplicação Next.js, que é a parte front-end
- Toda vez que for feita uma negociação via REST, o Nest.js é o responsável por iniciar o processamento (back-end)
- Um dos desafios aqui é trabalhar com uma API REST utilizando todos os conceitos necessários para poder realizar essa comunicação com o microsserviço de Match desenvolvida em Golang e transacionar a compra/venda de ativos (Assets)
- Quando é feita uma nova transação, ela é publicada em um tópico do Kafka que por sua vez é consumida pelo Golang (o microsserviço de Match vai ficar analisando ordens de compra e as ordens de venda). No momento que der uma Match (Correspondência) em uma Ordem, se publica essa ordem de volta no Kafka em outro tópico para que o Nest.js termine a transação. A transação inicia com o Nest.js e quando voltar, volta com o ID dessa transação finalizando a mesma com o preço do ativo, a carteira de investimentos e outros controles necessários como a notificar o Next.js.

- De maneira geral, o que será feito é criar essa API para lidar com todas essas informações e fazer a integração com o kafka e com o Golang.

## Tecnologias

- TypeScript/Javascript
- Nest.js
- Prisma ORM e MongoDB
- Rest
- Kafka
- Docker

## O que será feito

- Criar o projeto Nest.js
- Criar o banco de dados Mongo e integrar com o Prisma ORM
- Criar rotas REST: (Aqui temos as entidades de negócio)
    - Assets (Ativos - pode ser uma ação de qualquer empresa, um ETF, etc. Aqui temos os preços desses ativos e também controlar o histórico deles) 
    - Wallets (Carteiras - aqui não vamos ter um cadastro de pessoa e sim de carteira. A carteira tem todos os ativos envolvidos, onde uma carteira pode ter vários ativos, a quantidade dos ativos e qual é o ativo relacionado)
    - Wallet Assets (Ativos na Carteira)
    - Orders (Pra fazer a Compra e Venda temos uma entidade de Ordens. Aqui se registra a compra, a venda, o preço e o ativo relacionado e todas as transações envolvidas recebidas do Math, pois em uma ordem de compra ou de venda, pode estar envolvidas várias transações, sendo uma relação de 1 para Muitos). Por se trabalhar com o MongoDB, tem-se uma série de benefícios por não ter uma schema rígido, o que permite a inserção de informações posteriormente nos documentos e tenha um modelo diversificado a medida que a aplicação vai evoluindo. 
- Criar a integração com o microsserviço Golang (Matches) usando Kafka

# Parte Técnica

- Nest.js - é um framework Node.js que permite que se crie aplicações web. Relativamente novo quando comparado com outros frameworks da comunidade Node como o Express que tem mais de 10 anos de existência, pois ele foi criado em 2017. Ele já nasceu na concepção de mundo onde se tem uma realidade de microsserviços e uma série de ferramentas, então ele já nasceu adaptado para esse novo mundo. Um dos pontos fortes do Nest é que ele tem uma integração muito grande com microsserviços, onde se integra com vários meios de comunicação. 
É o framework da comunidade mais hypado. Ele vai trazer várias ideias também de arquitetura para organização do próprio projeto, que vai desde nome de aquivos, nomes de pastas, estruturas de módulos, etc.

- ao invés de instalar toda vez que for lançada uma nova versão com o comando npm install, o comando npx pega sempre direto online. o @nestjs/cli é um executável do nest que permite que se gere novas coisas e até novos projetos.

-> npx @nestjs/cli nestjs
- Ok to proceed? y
- Which package manager would you to use? npm

No projeto temos a famigerada node_modules, o arquivo package.json para gerar a node_modules. Aqui tem pacotes para fazer testes na aplicação, os pacotes do nest. 
- Arquivo padrão de configuração do typescript.
- Arquivo do nest, que permite trabalhar com monorepo, pode se ter multiplos projetos dentro desse monorepo. Enfim, fazer várias configurações para mudar o comportamento;
- Prettierrc: ser para alinhamento padrão no código. Precisa da extensão do prettierrc instalada no vscode.

- Comando para rodar o ambiente de desenvolvimento
 - Vai compilar o TypeScript gerando o diretório dist com os arquivos convertidos para JS.
 - Vai servir a aplicação na porta 3000, abrindo um texto Hello World indicando que deu tudo certo.

-> npm run start:dev 

- O Nest possui as ideias de arquitetura do Angular, pois um dos criadores do Nest faz parte do Core Time do Angular, que é o  Mark Pieszak
 - Trabalhar com container de serviços
 - Arquitetura modular, onde tudo que é feito na aplicação é um módulo
    - O arquivo main.ts que inicia o projeto (entry point) com a função bootstrap(), ele cria um projeto Nest com o NestFactory através de um AppModule, que é o módulo root da aplicação. Tudo o que é feito no Nest precisa estar em um módulo.
    - Uma vez que a aplicação está criada, com um listen na porta 3000, ela já está funcionando.
    - Esse módulo é a classe AppModule que tem um decorator em cima. O decorator é um padrão da ES7.
    - O decorator ele aje decorando uma variável ou uma classe, que é uma forma elegante de se trabalhar com herança (ao invés de dar um export class AppModule extends Module, usa-se um decorator). Esse decorator torna-se um módulo e dentro desse módulo são registrados os artefatosque são conhecidos dentro do módulo. Uma vez conhecido, o próprio NestJs faz várias automações. 
    - o Controller é (no next se trabalha com a Arquitetura MVC (Model View Controller)) o  intermediário, recebendo a requisição e devolvendo a resposta. Em nenhum lugar o controller é instanciado, uma vez registrado, o NestJS já reconhece e já cria a rota para ele, pois os decorators também faz esse trabalho. 
    - Então uma para virar um Controller, se coloca o decorator @Controller e todas as rotas que você quer habilitar são os verbos HTTP, importando os métodos. 
    - Se quiser adicionar um prefixo para rotas, passo como parâmetro o prefixo
    - Se quiser adicionar um prefixo para todas as rotas daquele controller, passa o prefixo no parâmetro do método Controller.
    - O Hello World apresentado no brownser veio de um serviço, que é parte que o Nest recomenda para se colocar as regras de negócio, acesso ao banco de dados e coisas que tem que processar, ou seja, os motivos pelo qual a sua aplicação existe ficam nessa camada. É também uma camada em que há um decorator que se chama Injectable justamente porque esse serviço pode ser injetado em controllers e em outros serviços também, bastando registrá-lo no módulo, não havendo necessidade de usar um new AppService para poder usar.
- Tudo isso são convensões que o Nest te dá para que o programador se preocupe em apenas em desenvolver o projeto. Essas decisões de nome de arquivos é fácil identificar o seu propósito pois faz parte da composição.

# Habilitar o Docker integrado com o VSCode

- Essa abordagem ajuda a não precisar ficar rodando comando do docker, ficando imperceptível tudo o que vai sendo feito com o Docker, sendo que o próprio VSCode administra isso.
 - Extensão Dev Container - Roda o VSCode dentro de um Container Docker
 - Criar um arquivo Dockerfile na raiz do projeto
 - Criar um arquivo docker-compose.yaml na raiz do projeto - Faz com que facilite a execução tanto do node quanto do mongoDB também para não usar o comando docker RUN para cada serviço. 
  - No docker-compose é rodado um comando só que toda a aplicação precisa.
 - O projeto não será subindo via cli do docker-compose
 - CTRL + Shift + P  - Dev Container - Open folder container
 - Como já fora definio um docker compose el vai perguntar se eu quero rodar o Docker Compose.
  - marcar ZSH plugins
  - Shell History
  - Ambiente desenvolvimento rodando no docker, totalmente desacoplado da máquina

# Mongodb
 - Ajuda a ter os documentos, estes mais flexíveis que as tabelas de sql e por se tratar de informações financeiras, retirar ou colocar informações é muito mais fácil 
 - Quando for feito o Server Sent Events vamos poder plugar no modo watch do mongodb para escutar as mudanças nos ativos, carteiras e ordens.
 - Trás tecnologias muito úteis e novas que são facilmente integradas com os sistemas.
 - Será usado a imagem do container da bitnami, pois vamos precisar do modo réplica ativo nele. Não vamos ter réplicas. 
  - o mongodb é um banco de dados que trabalha de modo distribuído, contendo vários nós. Por exemplo, posso ter um nó primário e secundário, melhorando a disponibilidade dos dados , consegue fazer uma boa consistência se comunicando com todas as réplicas e caso ocorra alguma falha, o banco de dados não fica indisponível.

# Prisma ORM
 - Tem integração com o mongodb, porém é necessário habilitar o modo réplica, senão não é possível trabalhar.
 - Como no projeto será trabalhado as informações financeiras, acaba que será necessário trabalhar com a transação atômica, então é necessário ter a certeza de executar várias transações e, se alguma delas falhar, que seja desfeito tudo o que foi feito. Só se consegue isso com o modo réplica ativado.
 - Habilitar o modo réplica com a imagem padrão do mongo não é tão simples. 
 - A imagem da bitnami facilida, pois você vai criar as variáveis de ambiente no docker compose.
  - password: root
  - replica set mode: primary. Define esse container mongo como principal e outros containeres como secundário em conjunto. No caso do projeto será somente uma réplica.

  -> npx prisma init - iniciar o prisma

  - cria uma pasta prisma
   - shema - define a modelagem do banco de dados

-> npx @nestjs/cli i - executa o retorno das informações do sistema
-> npx @nestjs/cli generate --help - executa o retorno da lista de opções de geração
-> npx@nestjs/cli module prisma - executa a criação do módulo prisma e suas depedências
 - Esse novo módulo será uma nova pasta na aplicação e esse módulo é automaticamente registrado no módulo raiz (app.module). Um módulo abrange outros módulos, ou seja, um módulo conversa com outros módulos compartilhando coisas.

 -> npx @nestjs/cli service prisma/prisma - executa a criação de um serviço de prisma dentro de um módulo de prisma. Se você coloca a pasta antes, o compando npx já identifica e cria o serviço dentro dela. Ele vai criar o arquivo, vai registrar o serviço no módulo prisma e o módulo prisma já está registrado no módulo raiz.

 ### prisma.service
 - vamos extender do PrismaClient, que é o cliente do Prisma que vai acessar o banco de dados. Ele já é um serviço que está usando o Prisma diretamente, não tendo que injetar nada. Ai quando a aplicação nest iniciar já quero conectar no banco, sendo necessário implementar também o evento do nest via interface OnModuleInit, permite que crie o método onModuleInit, chamando o this.$connect() que conecta o prisma no banco.
 - outro detalhe importante é invocar o método enableShutdownHooks, que força a quebra de conexão quando não estiver mais conectado no banco de dados. Isso é importante pelo seguinte. Toda vez que subir a aplicação com o npm run start:dev, ele recarrega de novo, então é importante que aquela conexão antiga ela se desfaça e se crie uma nova. Isso evita problemas de Memory Leak e uso de recursos desnecessários, isso acontece muito nessas situações do tipo de hot reload.

 ### entidade ativos
 - como os nossos ativos será necessário consultar, criar, etc. é interessante que se tenha um módulo também para poder organizar  esses recursos
 -> npx nest generate resource (Criar um recurso para a aplicação)
  - name -> assets
  - transporte layer - REST API
  - generate CRUD entry points? - n
- Aqui é criado uma pasta, registra o módulo do recurso no módulo raiz, tem um serviço para poder trabalhar e um controlador com uma rota já pré-fixada e testes se quiser trabalhar.
- Vamos primeiro criar e consultar para ver se está tudo ok.
- Para o método create é necessário criar primeiro um construtor que acesse a instância do prisma service. Como ele está registrado no container de serviços. Apesar de ambos os módulos estarem registrados, isso é uma silada pois dessa forma o módulo do asset não reconhece o do prisma.
 - Primeiro precisa exportar o serviço do prisma no módulo do prisma para que os outros módulos acessem e importá-lo nos outros módulos. 
 - Isso não faz sentido, pois o prisma por se tratar de um serviço que se conecta ao banco de dados, é interessante que esse serviço se torne global. Então no módulo do prisma usa-se o decorator @Global() para tornar o módulo global, ou seja, todos os outros módulos que quiserem acessar os serviços do Prisma podem acessar diretamente sem a necessidade de especificar novamente a importação dele. Importante lembrar que esse é o caso do Prisma. Em outras situações, mesmo que repetitivo é importante registrar a importação entre vários módulos pois podem usar somente módulos específicos, sendo desnecessário deixá-lo global.
 -> npx prisma generate
  - gera a entidade asset

- Tem-se a entidade asset direto no PrismaClient, deixando-a devidamente automático e dentro dessa entidade asset tem todos os métodos como os de crud por exemplo. Isso é gerado na node_modules dentro de .prisma/client/index.d.ts/PrismaClient a partir do schema.
- No controller vamos declarar o create, que vai ser acessado pelo verbo post. Para receber os dados por meio da inserção é necessário declarar o parâmetro Body com o decorator body sendo que o nest já pega o texto do body da requisição convertendo para um objeto javascript. Fazendo dessa forma com a promessa já temos o resultado. O verbo post é acessível com o /assests mesmo

-> npx prisma studio
  - interface web do prisma

### Consultar todos os ativos
 - metodo all() prismaService.findMany()

### Wallets - carteiras
- Concentra os ativos de uma conta
- modelar a carteira no prisma
- @default(auto()) gera o id automatico
- @db.ObjectId - modela o dado de acordo com a especificação do banco de dados 

-> npx prisma generate - gera o modelo wallet

### criar o módulo wallets
-> npx nest generate resource
   - name - wallets
   - transport layer - REST API
   - generate CRUD entry points - n

-> npx nest generate service wallets/wallet-assets
-> npx nest generate controller wallets/wallet-assets

- A rota de acesso a esse controller vai usar o conceito de Nested endpoints da arquitetura REST.
Ex.: /wallets/:wallet_id/assets
- Dá para capturar o parâmetro via decorator Param

### Orders

-> npx nest generate resource
  - name - orders
  - transport layer - REST API
  - CRUD entry points? - n

- Modelagem
-> npx prisma generate
  - order.dto.ts
    - Data Transfer Object é quando a gente quer transitar dados entre camadas, então se cria um objeto puro que não tem lógica nada
    - Ele é um tipo que não é descartado pelo typescript, ele é uma classe, dá para aplicar validações com o nestjs nessas informações do dto usando duas libs: class-transformer e class-validator, que por meio de decorators da para as validações.
    - O nest já hidrata as informações do corpo da requisição (body) com as informações definidas no DTO. 

    01:36:19



