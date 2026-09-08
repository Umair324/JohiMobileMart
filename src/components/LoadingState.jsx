export function CardSkeleton() {
  return (
    <div className="card-surface overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-paper-line" />
      <div className="p-4 space-y-2.5">
        <div className="h-4 w-2/3 rounded bg-paper-line" />
        <div className="h-5 w-1/2 rounded bg-paper-line" />
        <div className="h-3 w-full rounded bg-paper-line" />
        <div className="h-3 w-1/3 rounded bg-paper-line" />
      </div>
    </div>
  );
}

export default function LoadingState({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
