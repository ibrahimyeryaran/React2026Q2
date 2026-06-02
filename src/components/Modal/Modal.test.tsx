import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Modal from './Modal';

describe('Modal', () => {
  it('does not render anything when closed', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}} title="Test">
        <p>Body</p>
      </Modal>
    );
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText('Body')).not.toBeInTheDocument();
  });

  it('renders content through a portal on document.body', () => {
    render(
      <Modal isOpen onClose={() => {}} title="Test">
        <p>Body</p>
      </Modal>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(document.body.contains(dialog)).toBe(true);
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  it('closes when Escape is pressed', async () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} title="Test">
        <button>Inside</button>
      </Modal>
    );
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes when clicking the overlay (outside)', async () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} title="Test">
        <button>Inside</button>
      </Modal>
    );
    await userEvent.click(screen.getByTestId('modal-overlay'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when clicking inside the dialog', async () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} title="Test">
        <button>Inside</button>
      </Modal>
    );
    await userEvent.click(screen.getByText('Inside'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes via the close button', async () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} title="Test">
        <button>Inside</button>
      </Modal>
    );
    await userEvent.click(screen.getByRole('button', { name: /close modal/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('moves focus into the dialog when opened', () => {
    render(
      <Modal isOpen onClose={() => {}} title="Test">
        <button>First</button>
      </Modal>
    );
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: /close modal/i })
    );
  });

  it('traps focus forward from the last element to the first', async () => {
    const user = userEvent.setup();
    render(
      <Modal isOpen onClose={() => {}} title="Test">
        <button>Last</button>
      </Modal>
    );
    const close = screen.getByRole('button', { name: /close modal/i });
    const last = screen.getByRole('button', { name: 'Last' });

    last.focus();
    await user.tab();
    expect(document.activeElement).toBe(close);
  });

  it('traps focus backward from the first element to the last', async () => {
    const user = userEvent.setup();
    render(
      <Modal isOpen onClose={() => {}} title="Test">
        <button>Last</button>
      </Modal>
    );
    const close = screen.getByRole('button', { name: /close modal/i });
    const last = screen.getByRole('button', { name: 'Last' });

    close.focus();
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(last);
  });

  it('returns focus to the trigger after closing', async () => {
    const user = userEvent.setup();

    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Open</button>
          <Modal isOpen={open} onClose={() => setOpen(false)} title="Test">
            <button>Inside</button>
          </Modal>
        </>
      );
    }

    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    trigger.focus();
    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(document.activeElement).toBe(trigger);
  });
});
