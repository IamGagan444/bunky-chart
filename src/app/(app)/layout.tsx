import { SessionProvider } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <SessionProvider>{children}</SessionProvider>
    </section>
  );
}
