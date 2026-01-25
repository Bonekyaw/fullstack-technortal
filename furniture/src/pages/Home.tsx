import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { productQuery } from "@/api/query";

function Home() {
  const { data } = useSuspenseQuery(productQuery("?limit=8"));
  const products = Array.isArray(data) ? data : (data?.products ?? []);

  console.log(products);

  // Example of a product:
  //  {id: 7, name: 'Sweety Home Beds', description: 'Donec facilisis quam ut purus rutrum lobortis. Donec vitae odio quam ut purus rutrum lobortis', price: '200', discount: '210', status: "ACTIVE", images: [{id: 8, url: 'images-1769267037441-45038270.webp'}]}

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
