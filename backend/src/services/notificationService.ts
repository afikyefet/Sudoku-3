import Puzzle from '../models/Puzzle';
import User from '../models/User';
import { sendEmail } from '../utils/email';

export async function sendNewFollowerEmail(to: string, follower: string) {
    await sendEmail({
        to,
        subject: 'You have a new follower!',
        html: `<p>${follower} is now following you on Sudoku Live!</p>`
    });
}

export async function sendCommentEmail(to: string, puzzleTitle: string, commenter: string, comment: string) {
    await sendEmail({
        to,
        subject: `New comment on your puzzle: ${puzzleTitle}`,
        html: `<p>${commenter} commented on your puzzle <b>${puzzleTitle}</b>:<br/>${comment}</p>`
    });
}

export async function sendWeeklyDigest(to: string, puzzles: { title: string; url: string }[]) {
    const list = puzzles.map(p => `<li><a href="${p.url}">${p.title}</a></li>`).join('');
    await sendEmail({
        to,
        subject: 'Your Sudoku Weekly Digest',
        html: `<p>Here are new puzzles this week:</p><ul>${list}</ul>`
    });
}

export async function sendWeeklyDigestToAllUsers() {
    const users = await User.find({});
    const puzzles = await Puzzle.find({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } });
    for (const user of users) {
        await sendWeeklyDigest(
            user.email,
            puzzles.map(p => ({ title: p.title, url: `${process.env.CLIENT_URL}/puzzle/${p._id}` }))
        );
    }
}
