const expect = require('expect');
const supertest = require('supertest');

const app = require('./server');
const Todo = require('./models/todo');

beforeEach(done => {
  Todo.remove({}).then(() => done());
});

describe('POST /todos', () => {
  it('Should create a new todo', done => {
    const text = 'Test todo text';
    supertest(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect(response => {
        expect(response.body.text).toBe(text);
      })
      .end((error, response) => {
        if (error) return done(error);
        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(error => done(error));
      });
  });

  it('Should not create todo with invalid data', done => {
    supertest(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((error, response) => {
        if (error) return done(error);
        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(0);
            done();
          })
          .catch(error => done(error));
      });
  });
});