import { signIn, signOut, auth } from "@/auth";
import { Button } from "./Button";
import { User, LogOut } from "lucide-react";

export async function UserAuth() {
  const session = await auth();

  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-raised/40 border border-gold/10 rounded-full">
          {session.user.image ? (
            <img src={session.user.image} alt={session.user.name || "User"} className="w-5 h-5 rounded-full" />
          ) : (
            <User className="w-4 h-4 text-gold/60" />
          )}
          <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
            {session.user.name || session.user.email?.split("@")[0]}
          </span>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button type="submit" className="p-2 rounded-full hover:bg-danger-muted/10 text-text-muted hover:text-danger-muted transition-colors" title="Abmelden">
            <LogOut className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await signIn("github"); // Defaulting to GitHub for now
      }}
    >
      <Button type="submit" variant="ghost" className="h-9 px-4 text-xs font-mono uppercase tracking-widest text-gold hover:bg-gold/10">
        Login
      </Button>
    </form>
  );
}
