import { fireEvent, render } from '@testing-library/react';
import PuzzleCard from '../PuzzleCard';

describe('PuzzleCard', () => {
    it('renders title', () => {
        const { getByText } = render(<PuzzleCard title="Test" onClick={() => { }} />);
        expect(getByText('Test')).toBeInTheDocument();
    });
    it('handles click', () => {
        const onClick = jest.fn();
        const { getByRole } = render(<PuzzleCard title="Test" onClick={onClick} />);
        fireEvent.click(getByRole('button'));
        expect(onClick).toHaveBeenCalled();
    });
});
