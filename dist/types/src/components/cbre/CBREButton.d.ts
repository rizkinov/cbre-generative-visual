import React from 'react';
import { Button } from "@/src/components/ui/button";
type ButtonVariant = "primary" | "outline" | "accent" | "text" | "action" | "view-more";
export interface CBREButtonProps extends Omit<React.ComponentProps<typeof Button>, 'variant'> {
    variant?: ButtonVariant;
}
/**
 * CBREButton - A button component styled according to CBRE brand guidelines
 *
 * This component demonstrates proper theming and styling for CBRE branded buttons
 * using shadcn/ui Button component as a foundation.
 */
export declare function CBREButton({ className, variant, children, onClick, ...props }: CBREButtonProps): React.JSX.Element;
export {};
