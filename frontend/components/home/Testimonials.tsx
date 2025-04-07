export default function Testimonials() {
  return (
    <section className="container py-12 md:py-24 px-6">
      <div className="mx-auto mb-12 max-w-[58rem] text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          Trusted by thousands of friends and roommates
        </h2>
        <p className="text-muted-foreground md:text-lg">
          Join the community of people who split expenses with ease
        </p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        <div className="rounded-lg border p-6">
          <div className="mb-4 flex items-center gap-4">
            <div className="rounded-full bg-muted p-2">
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
                className="h-4 w-4"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">Olayinka Oladipo</h3>
              <p className="text-sm text-muted-foreground">Room 8</p>
            </div>
          </div>
          <p className="text-muted-foreground">
            &quot;SplitWise has made sharing expenses with my roommates so easy.
            No more awkward conversations about who owes what!&quot;
          </p>
        </div>
        <div className="rounded-lg border p-6">
          <div className="mb-4 flex items-center gap-4">
            <div className="rounded-full bg-muted p-2">
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
                className="h-4 w-4"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">Kunal Saini</h3>
              <p className="text-sm text-muted-foreground">
                Costa Rica Trip 2025
              </p>
            </div>
          </div>
          <p className="text-muted-foreground">
            &quot; Used this app for our vacation and it was a game-changer. We
            could all see expenses in real-time and settle up easily.&quot;
          </p>
        </div>
        <div className="rounded-lg border p-6">
          <div className="mb-4 flex items-center gap-4">
            <div className="rounded-full bg-muted p-2">
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
                className="h-4 w-4"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">Delight Amadi-Sheriff</h3>
              <p className="text-sm text-muted-foreground">
                Office Lunch Group
              </p>
            </div>
          </div>
          <p className="text-muted-foreground">
            &quot;Perfect for our office lunch rotation. We can see exactly
            who&quot;s turn it is to pay and keep everything fair.&quot;
          </p>
        </div>
      </div>
    </section>
  );
}
