import { Guard } from "@/components/guard";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Guard allow={["investor"]}>{children}</Guard>;
}
