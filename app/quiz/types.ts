/**
 * Shared types for all quiz step configurations.
 */

export type Option = {
  /** The machine-readable value sent to the API */
  value: string;
  /** The human-readable label shown on screen */
  label: string;
};

export type QuizQuestion = {
  /** Unique key for this question, used in answers JSON */
  id: string;

  /** 
   * How the user selects answers:
   * - 'single-select' for radio-button lists
   * - 'multi-select' for checkbox lists
   * - 'slider' for numeric ranges
   */
  type: 'single-select' | 'multi-select' | 'slider';

  /** The question text shown above the control */
  question: string;

  /** Options for select controls (not used with sliders) */
  options?: Option[];

  /** Minimum value (for slider questions only) */
  min?: number;

  /** Maximum value (for slider questions only) */
  max?: number;

  /** Step size (for slider questions only) */
  step?: number;
};

