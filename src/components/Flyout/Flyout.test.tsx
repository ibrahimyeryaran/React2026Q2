import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Flyout from './Flyout';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import { mockItems } from '../../test-utils/mockData';
import { toggleItem } from '../../store/selectedItemsSlice';
import type { Item } from '../../types';

const selectItems = (items: Item[]) => (store: {
  dispatch: (action: ReturnType<typeof toggleItem>) => void;
}) => items.forEach((item) => store.dispatch(toggleItem(item)));

describe('Flyout', () => {
  it('does not render when no items selected', () => {
    renderWithProviders(<Flyout />);
    expect(screen.queryByText(/selected/i)).not.toBeInTheDocument();
  });

  it('renders when items are selected', () => {
    renderWithProviders(<Flyout />, {
      setupStore: selectItems([mockItems[0]]),
    });
    expect(screen.getByText(/1 item selected/i)).toBeInTheDocument();
  });

  it('displays correct count for multiple items', () => {
    renderWithProviders(<Flyout />, {
      setupStore: selectItems(mockItems),
    });
    expect(screen.getByText(/2 items selected/i)).toBeInTheDocument();
  });

  it('unselect all button clears store', async () => {
    const { store } = renderWithProviders(<Flyout />, {
      setupStore: selectItems(mockItems),
    });
    await userEvent.click(screen.getByRole('button', { name: /unselect all/i }));
    expect(store.getState().selectedItems.items).toHaveLength(0);
  });

  it('download button triggers CSV download', async () => {
    const createObjectURL = vi.fn(() => 'blob:url');
    const revokeObjectURL = vi.fn();
    const click = vi.fn();

    globalThis.URL.createObjectURL = createObjectURL;
    globalThis.URL.revokeObjectURL = revokeObjectURL;

    const origCreate = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') {
        const a = origCreate('a');
        vi.spyOn(a, 'click').mockImplementation(click);
        return a;
      }
      return origCreate(tag);
    });

    renderWithProviders(<Flyout />, {
      setupStore: selectItems(mockItems),
    });

    await userEvent.click(screen.getByRole('button', { name: /download/i }));

    expect(createObjectURL).toHaveBeenCalled();
    expect(click).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalled();

    vi.restoreAllMocks();
  });

  it('download file name contains item count', async () => {
    let capturedAnchor: HTMLAnchorElement | null = null;
    const origCreate = document.createElement.bind(document);

    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') {
        const a = origCreate('a') as HTMLAnchorElement;
        capturedAnchor = a;
        vi.spyOn(a, 'click').mockImplementation(() => {});
        return a;
      }
      return origCreate(tag);
    });

    globalThis.URL.createObjectURL = vi.fn(() => 'blob:url');
    globalThis.URL.revokeObjectURL = vi.fn();

    renderWithProviders(<Flyout />, {
      setupStore: selectItems(mockItems),
    });

    await userEvent.click(screen.getByRole('button', { name: /download/i }));

    expect(capturedAnchor).not.toBeNull();
    expect(capturedAnchor!.download).toBe('2_items.csv');

    vi.restoreAllMocks();
  });
});
