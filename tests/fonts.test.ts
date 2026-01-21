import fs from 'fs';
import path from 'path';

describe('Font Configuration', () => {
  it('imports fonts from next/font/google in layout.tsx', () => {
    const layoutPath = path.resolve(__dirname, '../app/layout.tsx');
    const content = fs.readFileSync(layoutPath, 'utf8');
    
    expect(content).toContain('next/font/google');
    expect(content).toContain('Inter');
    expect(content).toContain('Merriweather');
  });
});
