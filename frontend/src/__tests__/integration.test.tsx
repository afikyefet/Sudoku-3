import { render } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

const server = setupServer(
    rest.post('/api/auth/login', (req, res, ctx) => res(ctx.json({ token: 't', user: { _id: '1', username: 'a', email: 'a@mail.com' } }))),
    rest.post('/api/sudoku', (req, res, ctx) => res(ctx.json({ _id: 'p1', title: 'Test', puzzleData: [[0]], createdAt: new Date().toISOString() }))),
    rest.get('/api/sudoku', (req, res, ctx) => res(ctx.json([{ _id: 'p1', title: 'Test', puzzleData: [[0]], createdAt: new Date().toISOString() }]))),
);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('login, upload, solve', async () => {
    render(<App />);
    // Simulate login, upload, solve steps...
});
