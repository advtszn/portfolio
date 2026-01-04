import { ArrowUpRight } from "lucide-react";
import { cn } from "~/lib/utils";

interface WorkItemProps {
  title: string;
  url?: string;
  date: string | null;
  isActive: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onHover: () => void;
  onLeave: () => void;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${month}/${date.getFullYear()}`;
};

export function WorkItem({
  title,
  url,
  date,
  isActive,
  onSelect,
  onHover,
  onLeave,
}: WorkItemProps) {
  const className = cn("cursor-pointer px-1 text-left text-lg", {
    "bg-muted text-muted-foreground": isActive,
  });

  return (
    <li
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="group relative flex items-center gap-y-2"
    >
      {url ? (
        <a
          href={url}
          target="_blank"
          onClick={onSelect}
          className={cn(className, "inline-flex items-center gap-x-1")}
        >
          {title}
          <ArrowUpRight className="size-4" />
        </a>
      ) : (
        <p onClick={onSelect} className={className}>
          {title}
        </p>
      )}

      <span className="mx-1.5 flex-1 border-t" />

      <p className="text-muted-foreground text-right text-sm">
        {date ? formatDate(date) : "N/A"}
      </p>
    </li>
  );
}
