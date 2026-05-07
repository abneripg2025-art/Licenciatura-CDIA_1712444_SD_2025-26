# Licenciatura-CDIA_1712444_SD_2025-26

# Relatório do Trabalho Prático de Sistemas Distribuídos

**Licenciatura-CDIA_1712444_SD_2025-26**

---

## Informações Gerais

| Campo                  | Informação                                                 |
| ---------------------- | ---------------------------------------------------------- |
| **Estudante(s)**       | Abner Matheus Marques Rodrigues - 1712444                  |
| **Curso**              | Licenciatura em Ciência de Dados e Inteligência Artificial |
| **Unidade curricular** | Sistemas Distribuidos                                      |
| **Ano letivo**         | 2025/2026                                                  |
| **Docente(s)**         | Professor Paulo Vieira                                     |
| **Data**               | 07/05/2026                                                 |

---

# SUMÁRIO

1. [Descrição do Trabalho](#1-descrição-do-trabalho)
2. [Implementação do Trabalho](#2-implementação-do-trabalho)
3. [Funcionamento do Trabalho](#3-funcionamento-do-trabalho)
4. [Conclusão](#4-conclusão)

---

# 1. Descrição do Trabalho

O trabalho consiste no desenvolvimento de um sistema baseado em microserviços para a gestão de uma empresa de viagens fictícia. Seguindo as especificações dadas pelo docente, o sistema deve ter três sistemas principais:

* **Reservas:** responsável pela criação, alteração e cancelamento de reservas;
* **Viagens:** responsável por manter a informação sobre destinos, horários e disponibilidade;
* **Clientes:** responsável por gerir os dados dos utilizadores e o seu histórico de viagens;

Esses três serviços devem estar conectados por um API Hub baseado em REST API, e disponibilizados para uso em uma interface web.


# 2. Implementação do Trabalho

Inicialmente, o trabalho foi iniciado como uma implementação simples das tecnologias da biblioteca “Flask” da linguagem Python, que inicializa um servidor local, permitindo fazer testes com microserviços. Porém, como foi pedido no enunciado da atividade, eventualmente outras tecnologias foram utilizadas para a implementação da Interface Web, sendo elas: HTML, CSS, o framework Bootstrap e Javascript.

O primeiro passo foi implementar a estrutura de pastas, separando cada um dos serviços em suas respetivas pastas, e criando uma separada para a implementação do API HUB, que conecta todos eles. Com os arquivos dos serviços prontos, foi feito um teste utilizando apenas o console do “PyCharm”, a IDE utilizada para esse trabalho.

Com os testes feitos, e com a garantia que as funções básicas de “POST”, “GET”, “PUT” e “DELETE” estavam funcionando para cada um dos serviços, o próximo passo foi a implementação da interface web.

Foi feito uma interface mais simples para testes sem estilização, e após conferir a funcionalidade básica do sistema dentro dessa interface, a estilização foi implementada. Foi decidido que a interface web seria no estilo de um dashboard como uma aplicação, como se fosse um aplicativo de gerenciamento onde apenas os donos e gerentes da empresa de viagens teriam acesso.

Com isso, outras funções mais complexas foram implementadas, com barras de pesquisa, conferência de histórico dos clientes, etc.

---

# 3. Funcionamento do Trabalho

O projeto é, em suma, um dashboard para a gestão de uma empresa de viagens, que para ser utilizado, precisa da inicialização dos seguintes arquivos na seguinte ordem:

```bash
clientes_service.py
reservas_service.py
viagens_service.py
gateway.py
```

Após a inicialização desses arquivos, o dashboard apresenta três abas para os respetivos serviços:

* Gerenciamento de Clientes;
* Gerenciamento de Reservas;
* Gerenciamento de Viagens;

---

## Aba de Clientes

A aba de Clientes possui as funções para:

* **Criar um cliente:** Feita através do formulário presente no topo da Aba de Clientes;

* **Exibir clientes:** Exibe todos os clientes presentes na API através de cards no dashboard;

* **Pesquisar cliente:** Filtra os cards de clientes ao utilizar a barra de pesquisa, exibindo apenas os que possuem o texto pesquisado em seu e-mail ou nome;

* **Editar cliente:** Clicando no ícone de “lápis” de um dos cards de cliente, o dashboard abre um modal que permite a alteração das informações de um cliente já criado;

* **Deletar cliente:** Clicando no ícone de “Lata de Lixo” em um dos cards de cliente, permite apagar um cliente já criado da API;

* **Conferir Histórico:** Clicando no ícone de “relógio” de um dos cards de cliente, o dashboard abre um modal que exibe as todas as reservas feitas por esse cliente;

## Aba de Viagens

A aba de Viagens possui as funções para:

* **Criar uma viagem:** Feita através do formulário presente no topo da Aba de Viagens;

* **Exibir viagem:** Exibe todas as viagens presentes na API através de cards no dashboard;

* **Pesquisar viagen:** Filtra os cards de viagens ao utilizar a barra de pesquisa, exibindo apenas os que possuem o texto pesquisado em seu código, origem ou destino;

* **Editar viagem:** Clicando no ícone de “lápis” de um dos cards de viagem, o dashboard abre um modal que permite a alteração das informações duma viagem já criada;

* **Deletar viagem:** Clicando no ícone de “Lata de Lixo” em um dos cards de viagem, permite apagar uma viagem já criada da API;

## Aba de Reservas

A aba de Reservas possui as funções para:

* **Criar uma reserva:** Feita através do formulário presente no topo da Aba de reservas;

* **Exibir reservas:** Exibe todas as reservas presentes na API através de cards no dashboard;

* **Cancelar:** Clicando no botão de cancelar reserva em um dos cards de reserva, permite cancelar uma reserva já criada na API. Essa reserva continua sendo exibida, porém com diferenças para demonstrar que ela foi cancelada;

# 4. Conclusão

O desenvolvimento deste trabalho permitiu aplicar, de forma prática, diversos conceitos relacionados à disciplina de Sistemas Distribuídos, especialmente no que diz respeito à arquitetura baseada em microserviços, comunicação entre serviços através de APIs REST e integração entre backend e interface web. A implementação do sistema demonstrou como diferentes serviços podem operar de maneira independente, mantendo ao mesmo tempo uma comunicação centralizada através do API HUB.

Como possíveis melhorias futuras, poderiam ser implementadas funcionalidades como autenticação de utilizadores, medidas de segurança para evitar a inserção de dados maliciosos, adicionar mais funcionalidades para o serviço de Reservas, entre outros.

