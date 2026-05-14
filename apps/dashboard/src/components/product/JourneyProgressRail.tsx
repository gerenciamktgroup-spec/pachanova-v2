"use client";

import React from "react";
import { UserJourney } from "@/lib/navigation/userJourneys";
import { CheckCircle2, Circle, ChevronRight } from "lucide-react";

export type JourneyProgressRailProps = {
  journey: UserJourney;
  currentStepId: string;
};

export function JourneyProgressRail({ journey, currentStepId }: JourneyProgressRailProps) {
  const currentIndex = journey.steps.findIndex(s => s.id === currentStepId);

  return (
    <div className="w-full bg-pn-surface-strong border-y border-pn-border overflow-x-auto mb-8" data-testid="journey-progress-rail">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-6 min-w-max">
        <div className="flex items-center gap-2 pr-6 border-r border-pn-border/50 shrink-0">
          <span className="text-[10px] font-bold tracking-widest uppercase text-pn-gold">Journey</span>
          <span className="text-sm font-medium text-pn-text">{journey.title}</span>
        </div>

        <div className="flex items-center gap-2">
          {journey.steps.map((step, idx) => {
            const isCompleted = currentIndex > idx;
            const isCurrent = currentIndex === idx;
            const isPending = currentIndex < idx;

            return (
              <React.Fragment key={step.id}>
                <div className={`flex items-center gap-2 ${isCurrent ? "opacity-100" : "opacity-50"}`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-pn-success" />
                  ) : isCurrent ? (
                    <div className="relative flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pn-gold opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-pn-gold border-2 border-pn-bg"></span>
                    </div>
                  ) : (
                    <Circle className="w-4 h-4 text-pn-text-muted" />
                  )}
                  <span className={`text-xs ${isCurrent ? "font-medium text-pn-gold" : "text-pn-text-muted"}`}>
                    {step.label}
                  </span>
                </div>
                {idx < journey.steps.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-pn-border mx-1" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
