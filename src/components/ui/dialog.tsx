'use client';

import * as React from 'react';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type DialogVariant = 'default' | 'appointment';
type DialogSize = 'sm' | 'md' | 'lg' | 'modal';

type DialogTriggerProps = DialogPrimitive.Trigger.Props & {
  asChild?: boolean;
  children?: React.ReactNode;
};

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ asChild, children, ...props }: DialogTriggerProps) {
  const render =
    asChild && React.isValidElement(children) ? children : undefined;

  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-trigger"
      render={render}
      {...props}
    >
      {!asChild && children}
    </DialogPrimitive.Trigger>
  );
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  overlayVariant = 'default',
  ...props
}: DialogPrimitive.Backdrop.Props & {
  overlayVariant?: 'default' | 'blurred';
}) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-black/50',
        overlayVariant === 'blurred' && 'backdrop-blur-sm',
        className
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  variant = 'default',
  overlayVariant = 'default',
  size = 'modal',
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean;
  variant?: DialogVariant;
  overlayVariant?: 'default' | 'blurred';
  size?: DialogSize;
}) {
  return (
    <DialogPortal>
      <DialogOverlay overlayVariant={overlayVariant} />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          'fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-background p-6 text-sm text-foreground shadow-lg ring-1 ring-border duration-200 outline-none sm:max-w-lg',
          variant === 'appointment' && 'sm:max-w-md',
          size === 'sm' && 'sm:max-w-sm',
          size === 'lg' && 'sm:max-w-xl',
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3"
              />
            }
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex flex-col gap-2 text-left', className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className
      )}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  size = 'md',
  ...props
}: DialogPrimitive.Title.Props & {
  size?: DialogSize;
}) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        'leading-none font-semibold',
        size === 'sm' && 'text-base',
        size === 'lg' && 'text-xl',
        size === 'modal' && 'text-lg',
        size === 'md' && 'text-lg',
        className
      )}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  size = 'md',
  ...props
}: DialogPrimitive.Description.Props & {
  size?: DialogSize;
}) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        'text-sm text-muted-foreground',
        size === 'sm' && 'text-xs',
        size === 'lg' && 'text-base',
        size === 'modal' && 'text-sm',
        className
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
