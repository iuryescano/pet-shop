import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type NavigationButtonProps = {
  tooltipText: string;
  children: React.ReactNode;
  onClick: () => void;
};

export const NavigationButton = ({
  tooltipText,
  children,
  onClick,
}: NavigationButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          onClick={onClick}
          className="
            h-12 w-9 rounded-lg border border-border-primary bg-transparent text-content-primary
            hover:bg-background-tertiary hover:border-border-secondary hover:text-content-primary
            focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-border-brand focus:border-border-brand
            focus-visible:border-border-brand"
        >
          {children}
        </TooltipTrigger>
        <TooltipContent className="bg-background-tertiary">
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
