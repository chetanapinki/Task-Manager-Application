

import * as chai from 'chai'; 
import chaiHttp from 'chai-http'; 
import { server } from './server.js'; 

chai.use(chaiHttp); 

const { expect } = chai; 


describe('Task Management Application Tests', () => {
    it('should signup a new user', (done) => {
        chai.request(server)
            .post('/signup')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'test@example.com',
                password: 'password123',
                confirmPassword: 'password123',
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('message', 'User registered successfully!');
                done();
            });
    });

    it('should not signup if passwords do not match', (done) => {
        chai.request(server)
            .post('/signup')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'test@example.com',
                password: 'password123',
                confirmPassword: 'wrongPassword',
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('message', 'Passwords do not match!');
                done();
            });
    });

    it('should login successfully with correct credentials', (done) => {
        chai.request(server)
            .post('/login')
            .send({
                email: 'test@example.com',
                password: 'password123',
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Login successful!');
                done();
            });
    });

    it('should not login with incorrect credentials', (done) => {
        chai.request(server)
            .post('/login')
            .send({
                email: 'test@example.com',
                password: 'wrongPassword',
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('message', 'Invalid email or password.');
                done();
            });
    });
});
