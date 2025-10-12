import { useState } from "react";
import { EyeIcon, EyeClosedIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

export function PasswordInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <InputGroup>
        <InputGroupInput
          type={showPassword ? "text" : "password"}
          className={cn("pl-3", className)}
          required
          {...props}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label="Show password"
            size="icon-xs"
            variant="ghost"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeClosedIcon className="h-4 w-4" aria-hidden="true" />
            ) : (
              <EyeIcon className="h-4 w-4" aria-hidden="true" />
            )}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
