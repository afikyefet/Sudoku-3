import jwt from 'jsonwebtoken';
import httpMocks from 'node-mocks-http';
import User from '../../models/User';
import { register } from '../authController';

jest.mock('../../models/User');
jest.mock('jsonwebtoken');

describe('authController.register', () => {
    it('creates user and returns JWT', async () => {
        const req = httpMocks.createRequest({ body: { username: 'a', email: 'a@mail.com', password: 'pass' } });
        const res = httpMocks.createResponse();
        (User as any).mockImplementation(() => ({ save: jest.fn() }));
        (jwt.sign as any).mockReturnValue('token');
        await register(req, res);
        expect(res._getData()).toContain('token');
    });
    it('handles referrer', async () => {
        // ...mock referrer logic...
    });
});
