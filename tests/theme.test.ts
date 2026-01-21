import fs from 'fs';
import path from 'path';

describe('Tailwind Configuration', () => {
  it('contains CU Anschutz brand colors in globals.css', () => {
    const globalsCssPath = path.resolve(__dirname, '../app/globals.css');
    const content = fs.readFileSync(globalsCssPath, 'utf8');
    
    expect(content).toContain('--color-cu-gold: #CFB87C');
    expect(content).toContain('--color-cu-black: #000000');
  });
});
