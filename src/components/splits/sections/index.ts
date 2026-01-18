// Core component
export { default as CollapsibleSection } from './CollapsibleSection';

// Section content components
export {
  SplitDetailExpanded,
  SplitDetailCollapsed,
} from './SplitDetailSection';
export { SelectNameExpanded, SelectNameCollapsed } from './SelectNameSection';
export { AmountExpanded, AmountCollapsed } from './AmountSection';
export { PaymentExpanded, PaymentCollapsed } from './PaymentSection';

// Footer
export { default as FixedFooter } from './FixedFooter';
export { default as SuccessSection } from './SuccessSection';
export { default as PromoBanner } from './PromoBanner';

// Types
export * from './types';

// Configuration
export * from './sectionConfig';
