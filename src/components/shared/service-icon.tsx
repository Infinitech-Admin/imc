import {
  Building2,
  Zap,
  Flame,
  Landmark,
  Factory,
  Wrench,
  Building,
  Hammer,
  type LucideIcon,
} from "lucide-react";

export type ServiceIconName =
  | "commercial"
  | "electrical"
  | "fire"
  | "government"
  | "industrial"
  | "mechanical"
  | "multifamily"
  | "renovations";

const iconMap: Record<ServiceIconName, LucideIcon> = {
  commercial: Building2,
  electrical: Zap,
  fire: Flame,
  government: Landmark,
  industrial: Factory,
  mechanical: Wrench,
  multifamily: Building,
  renovations: Hammer,
};

export function ServiceIcon({
  icon,
  className,
}: {
  icon: ServiceIconName;
  className?: string;
}) {
  const Icon = iconMap[icon];
  return <Icon className={className} strokeWidth={1.75} />;
}
