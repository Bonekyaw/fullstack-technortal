import { ShoppingBasket } from "lucide-react";
import { Link } from "react-router";

import { PasswordForm } from "@/components/auth/password-form";

export default function ConfirmPasswordPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <ShoppingBasket className="size-4" />
          </div>
          Furniture Shop
        </Link>
        <PasswordForm />
      </div>
    </div>
  );
}
