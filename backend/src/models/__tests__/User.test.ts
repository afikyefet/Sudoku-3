import mongoose from 'mongoose';
import User from '../User';

describe('User Model', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/sudoku_test');
    });
    afterAll(async () => {
        await mongoose.connection.close();
    });
    it('should require username, email, password', async () => {
        const user = new User();
        let err;
        try { await user.validate(); } catch (e) { err = e; }
        expect(err).toBeDefined();
        expect(err.errors.username).toBeDefined();
        expect(err.errors.email).toBeDefined();
        expect(err.errors.password).toBeDefined();
    });
    it('should support referrals', async () => {
        const referrer = await User.create({ username: 'ref', email: 'ref@mail.com', password: 'pass' });
        const referred = await User.create({ username: 'new', email: 'new@mail.com', password: 'pass', referrer: referrer._id });
        expect(referred.referrer).toEqual(referrer._id);
    });
});
