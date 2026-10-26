import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App shell', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();
  });

  it('renders the single nav entry, the demo badge, the header band and one empty card', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const html = fixture.nativeElement as HTMLElement;

    expect(html.querySelectorAll('.shell__nav-item')).toHaveLength(1);
    expect(html.querySelector('.shell__nav-item')?.textContent?.trim()).toBe('Todo');
    expect(html.querySelector('.shell__demo-badge')?.textContent?.trim()).toBe('demo');
    expect(html.querySelector('.shell__title')?.textContent).toBe('Team todo');
    expect(html.querySelector('.shell__primary-action')?.textContent?.trim()).toBe('Add item');
    expect(html.querySelectorAll('mat-card')).toHaveLength(1);
    expect(html.querySelector('.shell__empty')?.textContent?.trim()).toBe(
      'No items yet. Add the first one.',
    );
  });
});
