import { Button } from "@/components/ui/button";
import { Link } from "react-router";

function Home() {
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
