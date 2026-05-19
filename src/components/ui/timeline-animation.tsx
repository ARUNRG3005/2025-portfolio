"use client";

import { ReactNode, ElementType, RefObject } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface TimelineContentProps {
  children?: ReactNode;
  as?: ElementType;
  animationNum?: number;
  timelineRef?: RefObject<HTMLElement | null>;
  customVariants?: Variants;
  className?: string;
  [key: string]: unknown;
}

export function TimelineContent({
  children,
  as: Component = "div",
  animationNum = 0,
  timelineRef,
  customVariants,
  className,
  ...props
}: TimelineContentProps) {
  const isInView = useInView(timelineRef as RefObject<HTMLElement>, {
    once: true,
    amount: 0.1,
  });

  // Dynamically pick the correct motion element
  const MotionComponent = typeof Component === "string"
    ? (motion as Record<string, typeof motion.div>)[Component] || motion.div
    : motion.create(Component);

  return (
    <MotionComponent
      custom={animationNum}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={customVariants}
      className={cn(className)}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}
