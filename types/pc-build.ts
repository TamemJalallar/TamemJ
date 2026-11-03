export type PCBuildGuideCategory =
  | "Planning & Compatibility"
  | "Core Components"
  | "Power & Cooling"
  | "Assembly & Setup"
  | "Troubleshooting"
  | "Build Profiles"
  | "Upgrades & Maintenance";

export type PCBuildDifficulty = "Beginner" | "Intermediate" | "Advanced";

export type PCBuildBudgetBand = "Entry" | "Midrange" | "High-End" | "Enthusiast";

export type PCBuildStepType = "info" | "command" | "warning";

export type PCCommandShell = "PowerShell" | "Terminal" | "CMD" | "CLI";

export type PCPartType =
  | "CPU"
  | "GPU"
  | "Motherboard"
  | "RAM"
  | "Storage"
  | "Power Supply"
  | "Cooling"
  | "Case"
  | "Networking"
  | "Accessories";

export interface PCBuildStep {
  title: string;
  type: PCBuildStepType;
  content: string;
}

export interface PCBuildCommand {
  title: string;
  shell: PCCommandShell;
  content: string;
}

export interface PCPartRecommendation {
  partType: PCPartType;
  whatToBuy: string;
  benefit: string;
  goodFor: string;
  compatibilityChecks: string[];
}

export interface PCBuildGuide {
  slug: string;
  title: string;
  description: string;
  category: PCBuildGuideCategory;
  difficulty: PCBuildDifficulty;
  budgetBand: PCBuildBudgetBand;
  estimatedTime: string;
  useCases: string[];
  tags: string[];
  partRecommendations: PCPartRecommendation[];
  checklist: string[];
  steps: PCBuildStep[];
  commands: PCBuildCommand[];
  safetyNotes: string[];
  relatedGuideSlugs: string[];
}
