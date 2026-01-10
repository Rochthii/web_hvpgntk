import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export const NewsCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-100 flex flex-col h-full">
        <Skeleton className="h-48 w-full" />
        <div className="p-5 flex-grow space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-20 mt-2" />
        </div>
    </div>
);

export const CourseRowSkeleton = () => (
    <tr className="animate-pulse">
        <td className="px-6 py-4"><Skeleton className="h-5 w-16" /></td>
        <td className="px-6 py-4">
            <Skeleton className="h-5 w-48 mb-1" />
            <Skeleton className="h-4 w-24" />
        </td>
        <td className="px-6 py-4"><Skeleton className="h-5 w-16" /></td>
        <td className="px-6 py-4"><Skeleton className="h-6 w-24 rounded-full" /></td>
    </tr>
);
