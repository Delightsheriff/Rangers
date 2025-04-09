export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t bg-muted">
      <div className="container py-12 md:py-24 px-6">
        <div className="mx-auto text-center md:max-w-[58rem]">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">How SplitWise Works</h2>
          <p className="mb-12 text-muted-foreground md:text-lg">
            Simplify your shared expenses in three easy steps
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M3 17a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
                <path d="M13 10a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1z" />
                <path d="M18 3V1" />
                <path d="M8 14v-4a4 4 0 0 1 8 0" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold">Create Groups</h3>
            <p className="text-muted-foreground">
              Set up groups for roommates, trips, or any shared expenses. Invite friends via email
              or username.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold">Add Expenses</h3>
            <p className="text-muted-foreground">
              Record who paid for what and how it should be split. Upload receipts and categorize
              expenses.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold">Settle Up</h3>
            <p className="text-muted-foreground">
              See who owes what to whom. Mark debts as paid or request payments directly through the
              app.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
