import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { productQuery } from "@/api/query";

function Home() {
  const { data } = useSuspenseQuery(productQuery("?limit=8"));
  const products = Array.isArray(data) ? data : (data?.products ?? []);
  console.log(products);

  return (
    <div>
      <h1>Home Screen</h1>
      <Link to="/login">
        <Button>Go to Login</Button>
      </Link>
    </div>
  );
}

export default Home;
