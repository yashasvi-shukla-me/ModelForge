type Status = "RUNNING" | "COMPLETED" | "DEPLOYED" | "DEPLOYING" | "FAILED";

const styles: Record<Status, string> = {
  RUNNING: "bg-amber-500/20 text-amber-400 border-amber-500/40",
  COMPLETED: "bg-purple-500/20 text-purple-400 border-purple-500/40",
  DEPLOYED: "bg-green-500/20 text-green-400 border-green-500/40",
  DEPLOYING: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  FAILED: "bg-red-500/20 text-red-400 border-red-500/40",
};

export default function StatusBadge({ status }: { status: string }) {
  const s = (status in styles ? status : "COMPLETED") as Status;
  return (
    <span
      className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${styles[s]}`}
    >
      {status}
    </span>
  );
}
