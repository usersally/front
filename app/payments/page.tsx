type Payment = {
  _id: string;
  amount: number;
  status: string;
};

//fetch payments from backend API
async function getPayments(): Promise<Payment[]> {
  //call backend endpoint
  const res = await fetch("http://localhost:3000/api/payment", {
    cache: "no-store", // to always get fresh data
  });

  //handle error if request fails
  if (!res.ok) {
    throw new Error("Failed to fetch payments");
  }

  // convert res to json
  return res.json();
}

//main page component (server component)
export default async function Page() {
  //fetch data before rendering
  const payments = await getPayments();

  return (
    <div>
      <h1>Payments</h1>
      {/*loop through payments and display them */}
      {payments.map((p) => (
        <div key={p._id}>
          {/* show amount and status */}
          {p.amount} - {p.status}
        </div>
      ))}
    </div>
  );
}
