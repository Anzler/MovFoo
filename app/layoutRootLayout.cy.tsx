// ~/Projects/movfoo/app/layoutRootLayout.cy.tsx
import RootLayout from './layout'

describe('<RootLayout />', () => {
  it('renders', () => {
    cy.mount(
      <RootLayout>
        <div>Test Child</div>
      </RootLayout>
    );
  });
});

