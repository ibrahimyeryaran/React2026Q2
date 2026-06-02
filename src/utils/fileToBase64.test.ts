import { describe, it, expect } from 'vitest';
import { fileToBase64 } from './fileToBase64';

describe('fileToBase64', () => {
  it('converts a file to a base64 data URL', async () => {
    const file = new File(['hello'], 'greeting.png', { type: 'image/png' });
    const result = await fileToBase64(file);
    expect(result).toMatch(/^data:image\/png;base64,/);
  });

  it('produces a non-empty payload', async () => {
    const file = new File(['some content'], 'a.jpeg', { type: 'image/jpeg' });
    const result = await fileToBase64(file);
    expect(result.length).toBeGreaterThan('data:image/jpeg;base64,'.length);
  });
});
