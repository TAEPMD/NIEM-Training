'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({ 
  className = '', 
  variant = 'text',
  width,
  height,
  animation = 'pulse'
}: SkeletonProps) {
  const baseStyles = 'bg-[var(--text-secondary)]/10 dark:bg-white/10';
  
  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-xl',
  };

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-skeleton-wave',
    none: '',
  };

  const style = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${animationStyles[animation]} ${className}`}
      style={style}
    />
  );
}

// Pre-built skeleton components for common use cases
export function CardSkeleton() {
  return (
    <div className="apple-card p-6 space-y-4">
      <Skeleton variant="rounded" height={200} className="w-full" />
      <Skeleton variant="text" height={24} className="w-3/4" />
      <Skeleton variant="text" height={16} className="w-full" />
      <Skeleton variant="text" height={16} className="w-2/3" />
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <section className="bg-black text-white pt-32 md:pt-40 pb-20 md:pb-32 text-center">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <Skeleton variant="text" height={28} className="w-48 mx-auto" />
        <Skeleton variant="text" height={80} className="w-full max-w-2xl mx-auto" />
        <Skeleton variant="text" height={24} className="w-3/4 max-w-xl mx-auto" />
        <div className="flex justify-center gap-4 pt-4">
          <Skeleton variant="rounded" height={48} className="w-40" />
          <Skeleton variant="rounded" height={48} className="w-40" />
        </div>
      </div>
    </section>
  );
}

export function NewsSkeleton() {
  return (
    <div className="apple-card p-8 flex flex-col justify-between min-h-[350px]">
      <div className="space-y-3">
        <Skeleton variant="text" height={16} className="w-20" />
        <Skeleton variant="text" height={32} className="w-full" />
        <Skeleton variant="text" height={32} className="w-4/5" />
      </div>
      <Skeleton variant="text" height={20} className="w-24 mt-8" />
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="apple-card p-8 flex flex-col justify-center items-center text-center min-h-[350px]">
      <Skeleton variant="circular" width={48} height={48} className="mb-6" />
      <Skeleton variant="text" height={56} className="w-24" />
      <Skeleton variant="text" height={20} className="w-32 mt-2" />
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <div className="w-full max-w-md space-y-4">
      <Skeleton variant="rounded" height={56} className="w-full" />
      <Skeleton variant="rounded" height={56} className="w-full" />
    </div>
  );
}
