import type { TWork } from "~/types/works.types";
import { useMediaQuery } from "usehooks-ts";
import { useWorkSelection } from "./use-work-selection";
import { WorkItem } from "./work-item";
import { WorkDetails } from "./work-details";

export default function WorksList({ works }: { works: TWork[] }) {
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const selection = useWorkSelection<TWork>();

  const handleSelect = (e: React.MouseEvent, work: TWork) => {
    const { shouldNavigate } = selection.select(work, !!work.url);
    if (!shouldNavigate) e.preventDefault();
  };

  return (
    <div
      ref={selection.containerRef}
      className="flex flex-col space-y-8 lg:flex-row lg:items-start lg:justify-between lg:space-y-0"
    >
      <ul className="flex flex-1 flex-col gap-y-1.5 lg:max-w-[45%]">
        {works.map((work) => (
          <WorkItem
            key={work._id}
            title={work._title}
            url={work.url}
            date={work.date}
            isActive={selection.isItemActive(work)}
            onSelect={(e) => handleSelect(e, work)}
            onHover={() => selection.hover(work)}
            onLeave={selection.unhover}
          />
        ))}
      </ul>

      {selection.displayedItem && (
        <WorkDetails
          work={selection.displayedItem}
          showPinHint={!isMobile && !selection.isLocked}
          showLinkHint={selection.isLocked && !!selection.displayedItem.url}
        />
      )}
    </div>
  );
}
