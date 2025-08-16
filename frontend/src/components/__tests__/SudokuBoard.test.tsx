import { fireEvent, render } from '@testing-library/react';
import SudokuBoard from '../SudokuBoard';

describe('SudokuBoard', () => {
    it('renders 9x9 grid', () => {
        const { getAllByRole } = render(<SudokuBoard grid={Array(9).fill(Array(9).fill(0))} onInput={() => { }} />);
        expect(getAllByRole('cell').length).toBe(81);
    });
    it('handles input', () => {
        const onInput = jest.fn();
        const { getAllByRole } = render(<SudokuBoard grid={Array(9).fill(Array(9).fill(0))} onInput={onInput} />);
        fireEvent.change(getAllByRole('textbox')[0], { target: { value: '5' } });
        expect(onInput).toHaveBeenCalled();
    });
});
