import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Users, Clock, Calendar, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
export function WorkerStatusCards({ workers, shifts, currentPeriodDates }) {
    const { t } = useTranslation();
    const activeWorkers = workers.filter(worker => worker.isActive);
    const workingToday = shifts.filter(shift => new Date(shift.startTime).toDateString() === new Date().toDateString()).length;
    const cards = [
        {
            title: t('workers.title'),
            value: activeWorkers.length,
            icon: Users,
            color: 'from-blue-500 to-blue-600',
            textColor: 'text-blue-100',
            iconColor: 'text-blue-200',
            metric: 'Active workers',
        },
        {
            title: t('workers.status.notWorking'),
            value: activeWorkers.length - workingToday,
            icon: Clock,
            color: 'from-purple-500 to-purple-600',
            textColor: 'text-purple-100',
            iconColor: 'text-purple-200',
            metric: 'Not scheduled today',
        },
        {
            title: t('workers.status.leavePeriod'),
            value: `${currentPeriodDates.start.toLocaleDateString()} ${t('workers.status.to')} ${currentPeriodDates.end.toLocaleDateString()}`,
            icon: Calendar,
            color: 'from-emerald-500 to-emerald-600',
            textColor: 'text-emerald-100',
            iconColor: 'text-emerald-200',
            metric: 'Current period',
            isDate: true,
        },
        {
            title: t('workers.status.location'),
            value: 'Amsterdam',
            icon: MapPin,
            color: 'from-orange-500 to-orange-600',
            textColor: 'text-orange-100',
            iconColor: 'text-orange-200',
            metric: 'Main office',
            isLocation: true,
        },
    ];
    return (_jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: cards.map((card, index) => (_jsxs(Card, { className: cn("relative overflow-hidden bg-gradient-to-br", card.color, "border-none shadow-lg hover:shadow-xl transition-shadow"), children: [_jsx("div", { className: "absolute top-0 right-0 p-3", children: _jsx(card.icon, { className: cn("w-12 h-12 opacity-20", card.iconColor) }) }), _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: cn("text-sm font-medium", card.textColor), children: card.title }), _jsx("div", { className: cn("mt-2 flex items-baseline", card.textColor), children: _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: cn("text-2xl font-bold", card.isDate ? "text-lg" : "text-3xl"), children: card.value }), _jsx("span", { className: "text-sm mt-1 opacity-80", children: card.metric })] }) })] })] }, index))) }));
}
