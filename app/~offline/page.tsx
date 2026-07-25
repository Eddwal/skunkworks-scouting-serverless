export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <h1 className="text-4xl font-bold mb-4">You are offline</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Please check your internet connection and try again.
      </p>
    </div>
  );
}
