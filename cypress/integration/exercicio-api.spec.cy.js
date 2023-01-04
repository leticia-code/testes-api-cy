/// <reference types="cypress" />

import contrato from '../contracts/usuarios.contract'

var faker = require ('faker')

describe('Testes da Funcionalidade Usuários', () => {



     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body)

          })


     })

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios',

          }).then((Response) => {
               
               expect(Response.status).to.equal(200)
               expect(Response.duration).to.be.lessThan(20)
               cy.log(Response.body.usuarios[3]._id)
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body:
               {
                    "nome": "Leticia Oliveira",
                    "email": faker.internet.email(),
                    "password": "teste",
                    "administrador": "true"
               }
          }).then((Response) => {
               expect(Response.body.message).to.equal('Cadastro realizado com sucesso')
               expect(Response.status).to.equal(201)
               expect(Response.duration).to.be.lessThan(300)

          })
     });

     it('Deve validar um usuário com email inválido', () => {
          cy.request({
               method: 'POST',
               url: 'usuarios',
               failOnStatusCode: false,
               body:
               {
                    "nome": "Leticia Cardoso",
                    "email": "leticia@qa.com.br",
                    "password": "teste",
                    "administrador": "true"
               }
          }).then((Response) => {
               expect(Response.body.message).to.equal('Este email já está sendo usado')
               expect(Response.status).to.equal(400)
               expect(Response.duration).to.be.lessThan(300)
          })
     });

     it('Deve editar um usuário previamente cadastrado', () => {
      cy.request('usuarios').then(Response => {
               let id = Response.body.usuarios[3]._id
               cy.request({

                    method: 'PUT',
                    url: `/usuarios/${id}`,
                    body:
                    {
                         "nome": "Fulano da Silva",
                         "email": faker.internet.email(),
                         "password": "teste",
                         "administrador": "true"
                    }
               })

          }).then((Response) => {
               expect(Response.body.message).to.equal('Registro alterado com sucesso')
               expect(Response.status).to.equal(200)
               expect(Response.duration).to.be.lessThan(300)

          })
     });

     it('Deve deletar um usuário previamente cadastrado', () => {

          let nome = `Luana Alves ${Math.floor(Math.random() * 1000)}`
          let email = faker.internet.email()

          cy.cadastrarUsuario(nome, email, 'teste', true)
         
          
               .then(Response => {
               let id = Response.body._id
               cy.request({
                    method: 'DELETE',
                    url: `usuarios/${id}`
                   


   })            
   }).then((Response) => {
     expect(Response.body.message).to.equal('Registro excluído com sucesso')
     expect(Response.status).to.equal(200)
     expect(Response.duration).to.be.lessThan(300)
})
     })
})

    







