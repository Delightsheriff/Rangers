'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  actionOnClick?: () => void;
  secondaryActionText?: string;
  secondaryActionLink?: string;
  secondaryActionOnClick?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionText,
  actionLink,
  actionOnClick,
  secondaryActionText,
  secondaryActionLink,
  secondaryActionOnClick,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-medium">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-muted-foreground">{description}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionText && (actionLink || actionOnClick) && (
          <>
            {actionLink ? (
              <Link href={actionLink}>
                <Button>{actionText}</Button>
              </Link>
            ) : (
              <Button onClick={actionOnClick}>{actionText}</Button>
            )}
          </>
        )}
        {secondaryActionText && (secondaryActionLink || secondaryActionOnClick) && (
          <>
            {secondaryActionLink ? (
              <Link href={secondaryActionLink}>
                <Button variant="outline">{secondaryActionText}</Button>
              </Link>
            ) : (
              <Button variant="outline" onClick={secondaryActionOnClick}>
                {secondaryActionText}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
