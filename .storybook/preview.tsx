import type { Preview } from '@storybook/react-vite';

// The design tokens are the foundation everything else reads from — load them once
// here so every story renders inside the Celadon Zen palette.
import '../src/tokens/tokens.css';

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i } },
    backgrounds: {
      options: {
        canvas: { name: 'canvas', value: '#EFF1EC' },
        surface: { name: 'surface', value: '#FAFBF8' },
        ink: { name: 'ink', value: '#23282A' }
      }
    },
  },

  decorators: [
    (Story) => (
      <div
        style={{
          fontFamily: 'var(--do-font-sans)',
          color: 'var(--do-color-text)',
          padding: 24,
        }}
      >
        <Story />
      </div>
    ),
  ],

  initialGlobals: {
    backgrounds: {
      value: 'canvas'
    }
  }
};

export default preview;
