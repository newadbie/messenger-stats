"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

const SignoutBtn: React.FC = () => {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return <button onClick={handleSignOut}>Wyloguj</button>;
};

export default SignoutBtn;
