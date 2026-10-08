import { Building2, Car, Check, Coffee, DoorOpen, Droplets, Dumbbell, Leaf, ShieldCheck, Users, Warehouse, Wifi, Zap } from "lucide-react";

export default function VacancyFeature({ feature }: { feature: string }) {
  const Icon = /security|access control/i.test(feature) ? ShieldCheck
    : /generator|power|solar/i.test(feature) ? Zap
    : /water/i.test(feature) ? Droplets
    : /parking/i.test(feature) ? Car
    : /coffee|barista|kitchen|restaurant/i.test(feature) ? Coffee
    : /meeting|reception/i.test(feature) ? Users
    : /gym|padel/i.test(feature) ? Dumbbell
    : /trail|garden/i.test(feature) ? Leaf
    : /warehouse|loading/i.test(feature) ? Warehouse
    : /office|furnished/i.test(feature) ? Building2
    : /wifi|fibre|internet/i.test(feature) ? Wifi
    : /available/i.test(feature) ? DoorOpen : Check;
  return <span className="inline-flex min-w-0 items-center gap-2"><Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-midpoint-dark/70" /><span>{feature}</span></span>;
}
