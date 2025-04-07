export default function HeroIllustration() {
  return (
    <div className="relative mx-auto max-w-md">
      <div className="rounded-lg bg-white p-4 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">Costa Rica Trip 2025</h3>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Active
          </span>
        </div>

        <div className="space-y-2 pb-2">
          <div className="flex items-center justify-between rounded-md border p-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                DE
              </div>
              <div>
                <p className="text-sm font-medium"> Hotel Bookings</p>
                <p className="text-xs text-muted-foreground">March 15, 2025</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-primary">$780.00</p>
              <p className="text-xs text-muted-foreground">You paid</p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-md border p-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                OO
              </div>
              <div>
                <p className="text-sm font-medium">Airport, Taxi</p>
                <p className="text-xs text-muted-foreground">March 16, 2025</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">$58.50</p>
              <p className="text-xs text-muted-foreground">Delight paid</p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-md border p-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                AJ
              </div>
              <div>
                <p className="text-sm font-medium">Dinner at Seafood Place</p>
                <p className="text-xs text-muted-foreground">March 16, 2025</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">$145.75</p>
              <p className="text-xs text-muted-foreground">Opeyemi paid</p>
            </div>
          </div>
        </div>

        <div className="rounded-md bg-muted/50 p-3">
          <h4 className="mb-2 text-sm font-medium">Summary</h4>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">You owe:</span>
              <span>$68.08</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">You are owed:</span>
              <span className="text-primary">$520.00</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total balance:</span>
              <span className="text-primary">+$451.92</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -right-4 -bottom-4 -z-10 h-full w-full rounded-lg bg-primary/20"></div>
      <div className="absolute -left-2 -top-2 -z-10 h-full w-full rounded-lg bg-muted"></div>
    </div>
  );
}
