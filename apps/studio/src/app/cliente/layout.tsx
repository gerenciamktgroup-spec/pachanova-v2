import { Guard } from "@/components/guard";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Guard allow={["client"]}>{children}</Guard>;
}
