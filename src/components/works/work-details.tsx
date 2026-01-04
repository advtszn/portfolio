import { RichText } from "basehub/react-rich-text";
import type { TWork } from "~/types/works.types";

interface WorkDetailsProps {
  work: TWork;
  showPinHint: boolean;
  showLinkHint: boolean;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${month}/${date.getFullYear()}`;
};

export function WorkDetails({ work, showPinHint, showLinkHint }: WorkDetailsProps) {
  return (
    <div className="flex-1 lg:max-w-[45%]">
      <div className="space-y-4">
        <dl className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <dt className="text-muted-foreground font-medium">Role</dt>
            <dd>{work.role}</dd>
          </div>
          <div className="flex items-center justify-between text-sm">
            <dt className="text-muted-foreground font-medium">Year</dt>
            <dd>{work.date ? formatDate(work.date) : "N/A"}</dd>
          </div>
        </dl>

        <div className="[&_a]:bg-muted [&_a]:text-muted-foreground [&_a]:px-1 [&_a]:font-medium">
          <RichText content={work.description.json.content} />
        </div>

        <p className="text-muted-foreground text-sm">
          {showLinkHint && "Click again to open the link"}
          {showPinHint && "Click to pin the content"}
        </p>
      </div>
    </div>
  );
}
