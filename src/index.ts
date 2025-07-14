/**
 * CBRE Web Elements
 * A modern UI component library styled according to CBRE's design system
 */

// Export namespaces to avoid naming conflicts
import * as UI from './components/ui';
import * as CBRE from './components/cbre';
import * as Blocks from './components/blocks';

// Re-export namespaces
export { UI, CBRE, Blocks };

// Utility exports
export * from './lib/utils';
export * from './hooks/use-mobile';

// Export the theme configuration
export { default as cbreTheme } from '../config/cbre-theme.js'; 