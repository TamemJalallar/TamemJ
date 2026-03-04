export type GenAIPlatform = "MetaAI" | "AdobeGenAI" | "Both";

export type GenAITool =
  | "Chat"
  | "TextToImage"
  | "GenerativeFill"
  | "GenerativeExpand"
  | "Vector"
  | "Video"
  | "Other";

export type GenAIComplexity = "Simple" | "Advanced";

export type GenAIOutputFormat = "Bullets" | "Steps" | "JSON" | "Table" | "Script" | "None";

export type GenAIPrompt = {
  id: string;
  slug: string;
  title: string;
  platform: "MetaAI" | "AdobeGenAI" | "Both";
  tool: "Chat" | "TextToImage" | "GenerativeFill" | "GenerativeExpand" | "Vector" | "Video" | "Other";
  complexity: "Simple" | "Advanced";
  category: string;
  tags: string[];
  summary: string;
  prompt: string;
  variables?: Array<{ key: string; label: string; placeholder: string; required?: boolean }>;
  bestPractices?: string[];
  exampleUse?: string;
  negativePrompt?: string;
  outputFormat?: "Bullets" | "Steps" | "JSON" | "Table" | "Script" | "None";
  updatedAt: string;
};

export const genaiPrompts: GenAIPrompt[] = [
  {
    slug: "linkedin-post-draft-refine",
    title: "LinkedIn Post Draft + Refine",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Simple",
    category: "Social",
    tags: [
      "metaai",
      "chat",
      "social",
      "workflow",
      "linkedin",
      "post",
      "draft",
      "refine"
    ],
    summary: "Meta AI prompt for draft and refine a linkedin post from a rough idea with structured outputs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: LinkedIn Post Draft + Refine.\n\nObjective:\n- Draft and refine a LinkedIn post from a rough idea for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- If required context is missing, ask up to 3 focused clarifying questions before drafting.\n\nOutput Rules:\n- Output format: Bullets\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "professional, concise, practical",
        required: true
      },
      {
        key: "objective_detail",
        label: "Objective detail",
        placeholder: "Specific context and goals",
        required: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Word limit, deadline, compliance boundaries",
        required: true
      }
    ],
    bestPractices: [
      "Replace all placeholders before sending to Meta AI.",
      "Ask for one revision optimized for brevity after first draft.",
      "Validate factual statements before publishing externally."
    ],
    exampleUse: "Use when you need to draft and refine a linkedin post from a rough idea quickly with structure.",
    outputFormat: "Bullets",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-001"
  },
  {
    slug: "instagram-caption-variants",
    title: "Instagram Caption Variants",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Simple",
    category: "Social",
    tags: [
      "metaai",
      "chat",
      "social",
      "workflow",
      "instagram",
      "caption",
      "variants"
    ],
    summary: "Meta AI prompt for create multiple instagram captions and hashtag sets with structured outputs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Instagram Caption Variants.\n\nObjective:\n- Create multiple Instagram captions and hashtag sets for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- If required context is missing, ask up to 3 focused clarifying questions before drafting.\n\nOutput Rules:\n- Output format: Steps\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "professional, concise, practical",
        required: true
      },
      {
        key: "objective_detail",
        label: "Objective detail",
        placeholder: "Specific context and goals",
        required: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Word limit, deadline, compliance boundaries",
        required: true
      }
    ],
    bestPractices: [
      "Replace all placeholders before sending to Meta AI.",
      "Ask for one revision optimized for brevity after first draft.",
      "Validate factual statements before publishing externally."
    ],
    exampleUse: "Use when you need to create multiple instagram captions and hashtag sets quickly with structure.",
    outputFormat: "Steps",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-002"
  },
  {
    slug: "x-thread-builder",
    title: "X Thread Builder",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Simple",
    category: "Content",
    tags: [
      "metaai",
      "chat",
      "content",
      "workflow",
      "thread",
      "builder"
    ],
    summary: "Meta AI prompt for turn one idea into a 10-post thread with structured outputs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: X Thread Builder.\n\nObjective:\n- Turn one idea into a 10-post thread for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- If required context is missing, ask up to 3 focused clarifying questions before drafting.\n\nOutput Rules:\n- Output format: Table\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "professional, concise, practical",
        required: true
      },
      {
        key: "objective_detail",
        label: "Objective detail",
        placeholder: "Specific context and goals",
        required: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Word limit, deadline, compliance boundaries",
        required: true
      }
    ],
    bestPractices: [
      "Replace all placeholders before sending to Meta AI.",
      "Ask for one revision optimized for brevity after first draft.",
      "Validate factual statements before publishing externally."
    ],
    exampleUse: "Use when you need to turn one idea into a 10-post thread quickly with structure.",
    outputFormat: "Table",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-003"
  },
  {
    slug: "meeting-notes-to-action-items",
    title: "Meeting Notes to Action Items",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Simple",
    category: "Operations",
    tags: [
      "metaai",
      "chat",
      "operations",
      "workflow",
      "meeting",
      "notes",
      "action",
      "items"
    ],
    summary: "Meta AI prompt for convert meeting notes into owners and due dates with structured outputs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Meeting Notes to Action Items.\n\nObjective:\n- Convert meeting notes into owners and due dates for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- If required context is missing, ask up to 3 focused clarifying questions before drafting.\n\nOutput Rules:\n- Output format: Script\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "professional, concise, practical",
        required: true
      },
      {
        key: "objective_detail",
        label: "Objective detail",
        placeholder: "Specific context and goals",
        required: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Word limit, deadline, compliance boundaries",
        required: true
      }
    ],
    bestPractices: [
      "Replace all placeholders before sending to Meta AI.",
      "Ask for one revision optimized for brevity after first draft.",
      "Validate factual statements before publishing externally."
    ],
    exampleUse: "Use when you need to convert meeting notes into owners and due dates quickly with structure.",
    outputFormat: "Script",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-004"
  },
  {
    slug: "professional-email-rewrite",
    title: "Professional Email Rewrite",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Simple",
    category: "Copywriting",
    tags: [
      "metaai",
      "chat",
      "copywriting",
      "workflow",
      "professional",
      "email",
      "rewrite"
    ],
    summary: "Meta AI prompt for rewrite rough email drafts in a professional tone with structured outputs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Professional Email Rewrite.\n\nObjective:\n- Rewrite rough email drafts in a professional tone for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- If required context is missing, ask up to 3 focused clarifying questions before drafting.\n\nOutput Rules:\n- Output format: Bullets\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "professional, concise, practical",
        required: true
      },
      {
        key: "objective_detail",
        label: "Objective detail",
        placeholder: "Specific context and goals",
        required: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Word limit, deadline, compliance boundaries",
        required: true
      }
    ],
    bestPractices: [
      "Replace all placeholders before sending to Meta AI.",
      "Ask for one revision optimized for brevity after first draft.",
      "Validate factual statements before publishing externally."
    ],
    exampleUse: "Use when you need to rewrite rough email drafts in a professional tone quickly with structure.",
    outputFormat: "Bullets",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-005"
  },
  {
    slug: "polite-decline-email",
    title: "Polite Decline Email",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Simple",
    category: "Copywriting",
    tags: [
      "metaai",
      "chat",
      "copywriting",
      "workflow",
      "polite",
      "decline",
      "email"
    ],
    summary: "Meta AI prompt for decline requests respectfully while preserving relationship with structured outputs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Polite Decline Email.\n\nObjective:\n- Decline requests respectfully while preserving relationship for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- If required context is missing, ask up to 3 focused clarifying questions before drafting.\n\nOutput Rules:\n- Output format: Steps\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "professional, concise, practical",
        required: true
      },
      {
        key: "objective_detail",
        label: "Objective detail",
        placeholder: "Specific context and goals",
        required: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Word limit, deadline, compliance boundaries",
        required: true
      }
    ],
    bestPractices: [
      "Replace all placeholders before sending to Meta AI.",
      "Ask for one revision optimized for brevity after first draft.",
      "Validate factual statements before publishing externally."
    ],
    exampleUse: "Use when you need to decline requests respectfully while preserving relationship quickly with structure.",
    outputFormat: "Steps",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-006"
  },
  {
    slug: "sop-builder-from-bullets",
    title: "SOP Builder from Bullets",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Simple",
    category: "Operations",
    tags: [
      "metaai",
      "chat",
      "operations",
      "workflow",
      "builder",
      "from",
      "bullets"
    ],
    summary: "Meta AI prompt for convert rough bullets into a usable sop with structured outputs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: SOP Builder from Bullets.\n\nObjective:\n- Convert rough bullets into a usable SOP for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- If required context is missing, ask up to 3 focused clarifying questions before drafting.\n\nOutput Rules:\n- Output format: Table\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "professional, concise, practical",
        required: true
      },
      {
        key: "objective_detail",
        label: "Objective detail",
        placeholder: "Specific context and goals",
        required: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Word limit, deadline, compliance boundaries",
        required: true
      }
    ],
    bestPractices: [
      "Replace all placeholders before sending to Meta AI.",
      "Ask for one revision optimized for brevity after first draft.",
      "Validate factual statements before publishing externally."
    ],
    exampleUse: "Use when you need to convert rough bullets into a usable sop quickly with structure.",
    outputFormat: "Table",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-007"
  },
  {
    slug: "onboarding-checklist-generator",
    title: "Onboarding Checklist Generator",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Simple",
    category: "Operations",
    tags: [
      "metaai",
      "chat",
      "operations",
      "workflow",
      "onboarding",
      "checklist",
      "generator"
    ],
    summary: "Meta AI prompt for create day-0, week-1, month-1 onboarding checklists with structured outputs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Onboarding Checklist Generator.\n\nObjective:\n- Create day-0, week-1, month-1 onboarding checklists for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- If required context is missing, ask up to 3 focused clarifying questions before drafting.\n\nOutput Rules:\n- Output format: Script\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "professional, concise, practical",
        required: true
      },
      {
        key: "objective_detail",
        label: "Objective detail",
        placeholder: "Specific context and goals",
        required: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Word limit, deadline, compliance boundaries",
        required: true
      }
    ],
    bestPractices: [
      "Replace all placeholders before sending to Meta AI.",
      "Ask for one revision optimized for brevity after first draft.",
      "Validate factual statements before publishing externally."
    ],
    exampleUse: "Use when you need to create day-0, week-1, month-1 onboarding checklists quickly with structure.",
    outputFormat: "Script",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-008"
  },
  {
    slug: "faq-generator-from-product-notes",
    title: "FAQ Generator from Product Notes",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Simple",
    category: "Content",
    tags: [
      "metaai",
      "chat",
      "content",
      "workflow",
      "generator",
      "from",
      "product",
      "notes"
    ],
    summary: "Meta AI prompt for generate product faqs from source notes with structured outputs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: FAQ Generator from Product Notes.\n\nObjective:\n- Generate product FAQs from source notes for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- If required context is missing, ask up to 3 focused clarifying questions before drafting.\n\nOutput Rules:\n- Output format: Bullets\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "professional, concise, practical",
        required: true
      },
      {
        key: "objective_detail",
        label: "Objective detail",
        placeholder: "Specific context and goals",
        required: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Word limit, deadline, compliance boundaries",
        required: true
      }
    ],
    bestPractices: [
      "Replace all placeholders before sending to Meta AI.",
      "Ask for one revision optimized for brevity after first draft.",
      "Validate factual statements before publishing externally."
    ],
    exampleUse: "Use when you need to generate product faqs from source notes quickly with structure.",
    outputFormat: "Bullets",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-009"
  },
  {
    slug: "knowledge-base-article-draft",
    title: "Knowledge Base Article Draft",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Simple",
    category: "Support",
    tags: [
      "metaai",
      "chat",
      "support",
      "workflow",
      "knowledge",
      "base",
      "article",
      "draft"
    ],
    summary: "Meta AI prompt for draft a troubleshooting article with safe steps with structured outputs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Knowledge Base Article Draft.\n\nObjective:\n- Draft a troubleshooting article with safe steps for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- If required context is missing, ask up to 3 focused clarifying questions before drafting.\n\nOutput Rules:\n- Output format: Steps\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "professional, concise, practical",
        required: true
      },
      {
        key: "objective_detail",
        label: "Objective detail",
        placeholder: "Specific context and goals",
        required: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Word limit, deadline, compliance boundaries",
        required: true
      }
    ],
    bestPractices: [
      "Replace all placeholders before sending to Meta AI.",
      "Ask for one revision optimized for brevity after first draft.",
      "Validate factual statements before publishing externally."
    ],
    exampleUse: "Use when you need to draft a troubleshooting article with safe steps quickly with structure.",
    outputFormat: "Steps",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-010"
  },
  {
    slug: "technical-to-plain-rewrite",
    title: "Technical-to-Plain Rewrite",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Simple",
    category: "Content",
    tags: [
      "metaai",
      "chat",
      "content",
      "workflow",
      "technical",
      "plain",
      "rewrite"
    ],
    summary: "Meta AI prompt for rewrite technical text for non-technical readers with structured outputs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Technical-to-Plain Rewrite.\n\nObjective:\n- Rewrite technical text for non-technical readers for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- If required context is missing, ask up to 3 focused clarifying questions before drafting.\n\nOutput Rules:\n- Output format: Table\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "professional, concise, practical",
        required: true
      },
      {
        key: "objective_detail",
        label: "Objective detail",
        placeholder: "Specific context and goals",
        required: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Word limit, deadline, compliance boundaries",
        required: true
      }
    ],
    bestPractices: [
      "Replace all placeholders before sending to Meta AI.",
      "Ask for one revision optimized for brevity after first draft.",
      "Validate factual statements before publishing externally."
    ],
    exampleUse: "Use when you need to rewrite technical text for non-technical readers quickly with structure.",
    outputFormat: "Table",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-011"
  },
  {
    slug: "policy-simplifier",
    title: "Policy Simplifier",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Simple",
    category: "Operations",
    tags: [
      "metaai",
      "chat",
      "operations",
      "workflow",
      "policy",
      "simplifier"
    ],
    summary: "Meta AI prompt for simplify policy text without changing meaning with structured outputs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Policy Simplifier.\n\nObjective:\n- Simplify policy text without changing meaning for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- If required context is missing, ask up to 3 focused clarifying questions before drafting.\n\nOutput Rules:\n- Output format: Script\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "professional, concise, practical",
        required: true
      },
      {
        key: "objective_detail",
        label: "Objective detail",
        placeholder: "Specific context and goals",
        required: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Word limit, deadline, compliance boundaries",
        required: true
      }
    ],
    bestPractices: [
      "Replace all placeholders before sending to Meta AI.",
      "Ask for one revision optimized for brevity after first draft.",
      "Validate factual statements before publishing externally."
    ],
    exampleUse: "Use when you need to simplify policy text without changing meaning quickly with structure.",
    outputFormat: "Script",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-012"
  },
  {
    slug: "localization-rewrite-assistant",
    title: "Localization Rewrite Assistant",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Simple",
    category: "Content",
    tags: [
      "metaai",
      "chat",
      "content",
      "workflow",
      "localization",
      "rewrite",
      "assistant"
    ],
    summary: "Meta AI prompt for localize copy for target region and audience with structured outputs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Localization Rewrite Assistant.\n\nObjective:\n- Localize copy for target region and audience for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- If required context is missing, ask up to 3 focused clarifying questions before drafting.\n\nOutput Rules:\n- Output format: Bullets\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "professional, concise, practical",
        required: true
      },
      {
        key: "objective_detail",
        label: "Objective detail",
        placeholder: "Specific context and goals",
        required: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Word limit, deadline, compliance boundaries",
        required: true
      }
    ],
    bestPractices: [
      "Replace all placeholders before sending to Meta AI.",
      "Ask for one revision optimized for brevity after first draft.",
      "Validate factual statements before publishing externally."
    ],
    exampleUse: "Use when you need to localize copy for target region and audience quickly with structure.",
    outputFormat: "Bullets",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-013"
  },
  {
    slug: "weekly-content-calendar",
    title: "Weekly Content Calendar",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Simple",
    category: "Marketing",
    tags: [
      "metaai",
      "chat",
      "marketing",
      "workflow",
      "weekly",
      "content",
      "calendar"
    ],
    summary: "Meta AI prompt for build a 7-day content calendar across channels with structured outputs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Weekly Content Calendar.\n\nObjective:\n- Build a 7-day content calendar across channels for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- If required context is missing, ask up to 3 focused clarifying questions before drafting.\n\nOutput Rules:\n- Output format: Steps\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "professional, concise, practical",
        required: true
      },
      {
        key: "objective_detail",
        label: "Objective detail",
        placeholder: "Specific context and goals",
        required: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Word limit, deadline, compliance boundaries",
        required: true
      }
    ],
    bestPractices: [
      "Replace all placeholders before sending to Meta AI.",
      "Ask for one revision optimized for brevity after first draft.",
      "Validate factual statements before publishing externally."
    ],
    exampleUse: "Use when you need to build a 7-day content calendar across channels quickly with structure.",
    outputFormat: "Steps",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-014"
  },
  {
    slug: "creative-brief-one-pager",
    title: "Creative Brief One-Pager",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Simple",
    category: "Marketing",
    tags: [
      "metaai",
      "chat",
      "marketing",
      "workflow",
      "creative",
      "brief",
      "pager"
    ],
    summary: "Meta AI prompt for create a campaign creative brief in one page with structured outputs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Creative Brief One-Pager.\n\nObjective:\n- Create a campaign creative brief in one page for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- If required context is missing, ask up to 3 focused clarifying questions before drafting.\n\nOutput Rules:\n- Output format: Table\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "professional, concise, practical",
        required: true
      },
      {
        key: "objective_detail",
        label: "Objective detail",
        placeholder: "Specific context and goals",
        required: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Word limit, deadline, compliance boundaries",
        required: true
      }
    ],
    bestPractices: [
      "Replace all placeholders before sending to Meta AI.",
      "Ask for one revision optimized for brevity after first draft.",
      "Validate factual statements before publishing externally."
    ],
    exampleUse: "Use when you need to create a campaign creative brief in one page quickly with structure.",
    outputFormat: "Table",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-015"
  },
  {
    slug: "product-positioning-statement",
    title: "Product Positioning Statement",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Simple",
    category: "Marketing",
    tags: [
      "metaai",
      "chat",
      "marketing",
      "workflow",
      "product",
      "positioning",
      "statement"
    ],
    summary: "Meta AI prompt for write positioning statement and differentiators with structured outputs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Product Positioning Statement.\n\nObjective:\n- Write positioning statement and differentiators for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- If required context is missing, ask up to 3 focused clarifying questions before drafting.\n\nOutput Rules:\n- Output format: Script\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "professional, concise, practical",
        required: true
      },
      {
        key: "objective_detail",
        label: "Objective detail",
        placeholder: "Specific context and goals",
        required: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Word limit, deadline, compliance boundaries",
        required: true
      }
    ],
    bestPractices: [
      "Replace all placeholders before sending to Meta AI.",
      "Ask for one revision optimized for brevity after first draft.",
      "Validate factual statements before publishing externally."
    ],
    exampleUse: "Use when you need to write positioning statement and differentiators quickly with structure.",
    outputFormat: "Script",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-016"
  },
  {
    slug: "competitor-messaging-snapshot",
    title: "Competitor Messaging Snapshot",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Simple",
    category: "Marketing",
    tags: [
      "metaai",
      "chat",
      "marketing",
      "workflow",
      "competitor",
      "messaging",
      "snapshot"
    ],
    summary: "Meta AI prompt for compare competitor messaging and identify gaps with structured outputs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Competitor Messaging Snapshot.\n\nObjective:\n- Compare competitor messaging and identify gaps for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- If required context is missing, ask up to 3 focused clarifying questions before drafting.\n\nOutput Rules:\n- Output format: Bullets\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "professional, concise, practical",
        required: true
      },
      {
        key: "objective_detail",
        label: "Objective detail",
        placeholder: "Specific context and goals",
        required: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Word limit, deadline, compliance boundaries",
        required: true
      }
    ],
    bestPractices: [
      "Replace all placeholders before sending to Meta AI.",
      "Ask for one revision optimized for brevity after first draft.",
      "Validate factual statements before publishing externally."
    ],
    exampleUse: "Use when you need to compare competitor messaging and identify gaps quickly with structure.",
    outputFormat: "Bullets",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-017"
  },
  {
    slug: "ad-headline-variant-generator",
    title: "Ad Headline Variant Generator",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Simple",
    category: "Marketing",
    tags: [
      "metaai",
      "chat",
      "marketing",
      "workflow",
      "headline",
      "variant",
      "generator"
    ],
    summary: "Meta AI prompt for generate ad headline variants by angle with structured outputs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Ad Headline Variant Generator.\n\nObjective:\n- Generate ad headline variants by angle for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- If required context is missing, ask up to 3 focused clarifying questions before drafting.\n\nOutput Rules:\n- Output format: Steps\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "professional, concise, practical",
        required: true
      },
      {
        key: "objective_detail",
        label: "Objective detail",
        placeholder: "Specific context and goals",
        required: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Word limit, deadline, compliance boundaries",
        required: true
      }
    ],
    bestPractices: [
      "Replace all placeholders before sending to Meta AI.",
      "Ask for one revision optimized for brevity after first draft.",
      "Validate factual statements before publishing externally."
    ],
    exampleUse: "Use when you need to generate ad headline variants by angle quickly with structure.",
    outputFormat: "Steps",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-018"
  },
  {
    slug: "cta-variant-generator",
    title: "CTA Variant Generator",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Simple",
    category: "Copywriting",
    tags: [
      "metaai",
      "chat",
      "copywriting",
      "workflow",
      "variant",
      "generator"
    ],
    summary: "Meta AI prompt for generate cta variants for landing pages and emails with structured outputs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: CTA Variant Generator.\n\nObjective:\n- Generate CTA variants for landing pages and emails for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- If required context is missing, ask up to 3 focused clarifying questions before drafting.\n\nOutput Rules:\n- Output format: Table\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "professional, concise, practical",
        required: true
      },
      {
        key: "objective_detail",
        label: "Objective detail",
        placeholder: "Specific context and goals",
        required: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Word limit, deadline, compliance boundaries",
        required: true
      }
    ],
    bestPractices: [
      "Replace all placeholders before sending to Meta AI.",
      "Ask for one revision optimized for brevity after first draft.",
      "Validate factual statements before publishing externally."
    ],
    exampleUse: "Use when you need to generate cta variants for landing pages and emails quickly with structure.",
    outputFormat: "Table",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-019"
  },
  {
    slug: "blog-outline-from-keyword",
    title: "Blog Outline from Keyword",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Simple",
    category: "Content",
    tags: [
      "metaai",
      "chat",
      "content",
      "workflow",
      "blog",
      "outline",
      "from",
      "keyword"
    ],
    summary: "Meta AI prompt for build an seo blog outline from one keyword with structured outputs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Blog Outline from Keyword.\n\nObjective:\n- Build an SEO blog outline from one keyword for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- If required context is missing, ask up to 3 focused clarifying questions before drafting.\n\nOutput Rules:\n- Output format: Script\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "professional, concise, practical",
        required: true
      },
      {
        key: "objective_detail",
        label: "Objective detail",
        placeholder: "Specific context and goals",
        required: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Word limit, deadline, compliance boundaries",
        required: true
      }
    ],
    bestPractices: [
      "Replace all placeholders before sending to Meta AI.",
      "Ask for one revision optimized for brevity after first draft.",
      "Validate factual statements before publishing externally."
    ],
    exampleUse: "Use when you need to build an seo blog outline from one keyword quickly with structure.",
    outputFormat: "Script",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-020"
  },
  {
    slug: "short-video-script-draft",
    title: "Short Video Script Draft",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Simple",
    category: "Content",
    tags: [
      "metaai",
      "chat",
      "content",
      "workflow",
      "short",
      "video",
      "script",
      "draft"
    ],
    summary: "Meta AI prompt for write short-form video scripts with hooks and cta with structured outputs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Short Video Script Draft.\n\nObjective:\n- Write short-form video scripts with hooks and CTA for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- If required context is missing, ask up to 3 focused clarifying questions before drafting.\n\nOutput Rules:\n- Output format: Bullets\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "professional, concise, practical",
        required: true
      },
      {
        key: "objective_detail",
        label: "Objective detail",
        placeholder: "Specific context and goals",
        required: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Word limit, deadline, compliance boundaries",
        required: true
      }
    ],
    bestPractices: [
      "Replace all placeholders before sending to Meta AI.",
      "Ask for one revision optimized for brevity after first draft.",
      "Validate factual statements before publishing externally."
    ],
    exampleUse: "Use when you need to write short-form video scripts with hooks and cta quickly with structure.",
    outputFormat: "Bullets",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-021"
  },
  {
    slug: "podcast-show-notes-generator",
    title: "Podcast Show Notes Generator",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Simple",
    category: "Content",
    tags: [
      "metaai",
      "chat",
      "content",
      "workflow",
      "podcast",
      "show",
      "notes",
      "generator"
    ],
    summary: "Meta AI prompt for create podcast show notes from transcript with structured outputs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Podcast Show Notes Generator.\n\nObjective:\n- Create podcast show notes from transcript for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- If required context is missing, ask up to 3 focused clarifying questions before drafting.\n\nOutput Rules:\n- Output format: Steps\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "professional, concise, practical",
        required: true
      },
      {
        key: "objective_detail",
        label: "Objective detail",
        placeholder: "Specific context and goals",
        required: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Word limit, deadline, compliance boundaries",
        required: true
      }
    ],
    bestPractices: [
      "Replace all placeholders before sending to Meta AI.",
      "Ask for one revision optimized for brevity after first draft.",
      "Validate factual statements before publishing externally."
    ],
    exampleUse: "Use when you need to create podcast show notes from transcript quickly with structure.",
    outputFormat: "Steps",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-022"
  },
  {
    slug: "webinar-agenda-planner",
    title: "Webinar Agenda Planner",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Simple",
    category: "Presentations",
    tags: [
      "metaai",
      "chat",
      "presentations",
      "workflow",
      "webinar",
      "agenda",
      "planner"
    ],
    summary: "Meta AI prompt for create timed webinar agenda with outcomes with structured outputs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Webinar Agenda Planner.\n\nObjective:\n- Create timed webinar agenda with outcomes for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- If required context is missing, ask up to 3 focused clarifying questions before drafting.\n\nOutput Rules:\n- Output format: Table\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "professional, concise, practical",
        required: true
      },
      {
        key: "objective_detail",
        label: "Objective detail",
        placeholder: "Specific context and goals",
        required: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Word limit, deadline, compliance boundaries",
        required: true
      }
    ],
    bestPractices: [
      "Replace all placeholders before sending to Meta AI.",
      "Ask for one revision optimized for brevity after first draft.",
      "Validate factual statements before publishing externally."
    ],
    exampleUse: "Use when you need to create timed webinar agenda with outcomes quickly with structure.",
    outputFormat: "Table",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-023"
  },
  {
    slug: "meeting-agenda-minutes-template",
    title: "Meeting Agenda + Minutes Template",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Simple",
    category: "Operations",
    tags: [
      "metaai",
      "chat",
      "operations",
      "workflow",
      "meeting",
      "agenda",
      "minutes",
      "template"
    ],
    summary: "Meta AI prompt for create reusable meeting agenda and minutes template with structured outputs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Meeting Agenda + Minutes Template.\n\nObjective:\n- Create reusable meeting agenda and minutes template for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- If required context is missing, ask up to 3 focused clarifying questions before drafting.\n\nOutput Rules:\n- Output format: Script\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "professional, concise, practical",
        required: true
      },
      {
        key: "objective_detail",
        label: "Objective detail",
        placeholder: "Specific context and goals",
        required: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Word limit, deadline, compliance boundaries",
        required: true
      }
    ],
    bestPractices: [
      "Replace all placeholders before sending to Meta AI.",
      "Ask for one revision optimized for brevity after first draft.",
      "Validate factual statements before publishing externally."
    ],
    exampleUse: "Use when you need to create reusable meeting agenda and minutes template quickly with structure.",
    outputFormat: "Script",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-024"
  },
  {
    slug: "support-response-draft",
    title: "Support Response Draft",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Simple",
    category: "Support",
    tags: [
      "metaai",
      "chat",
      "support",
      "workflow",
      "response",
      "draft"
    ],
    summary: "Meta AI prompt for draft support replies with next actions and timeline with structured outputs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Support Response Draft.\n\nObjective:\n- Draft support replies with next actions and timeline for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- If required context is missing, ask up to 3 focused clarifying questions before drafting.\n\nOutput Rules:\n- Output format: Bullets\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "professional, concise, practical",
        required: true
      },
      {
        key: "objective_detail",
        label: "Objective detail",
        placeholder: "Specific context and goals",
        required: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Word limit, deadline, compliance boundaries",
        required: true
      }
    ],
    bestPractices: [
      "Replace all placeholders before sending to Meta AI.",
      "Ask for one revision optimized for brevity after first draft.",
      "Validate factual statements before publishing externally."
    ],
    exampleUse: "Use when you need to draft support replies with next actions and timeline quickly with structure.",
    outputFormat: "Bullets",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-025"
  },
  {
    slug: "incident-status-update-draft",
    title: "Incident Status Update Draft",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Simple",
    category: "Support",
    tags: [
      "metaai",
      "chat",
      "support",
      "workflow",
      "incident",
      "status",
      "update",
      "draft"
    ],
    summary: "Meta AI prompt for write incident updates for users and leadership with structured outputs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Incident Status Update Draft.\n\nObjective:\n- Write incident updates for users and leadership for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- If required context is missing, ask up to 3 focused clarifying questions before drafting.\n\nOutput Rules:\n- Output format: Steps\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "professional, concise, practical",
        required: true
      },
      {
        key: "objective_detail",
        label: "Objective detail",
        placeholder: "Specific context and goals",
        required: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Word limit, deadline, compliance boundaries",
        required: true
      }
    ],
    bestPractices: [
      "Replace all placeholders before sending to Meta AI.",
      "Ask for one revision optimized for brevity after first draft.",
      "Validate factual statements before publishing externally."
    ],
    exampleUse: "Use when you need to write incident updates for users and leadership quickly with structure.",
    outputFormat: "Steps",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-026"
  },
  {
    slug: "bug-report-normalizer",
    title: "Bug Report Normalizer",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Simple",
    category: "Operations",
    tags: [
      "metaai",
      "chat",
      "operations",
      "workflow",
      "report",
      "normalizer"
    ],
    summary: "Meta AI prompt for normalize unstructured bug reports for triage with structured outputs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Bug Report Normalizer.\n\nObjective:\n- Normalize unstructured bug reports for triage for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- If required context is missing, ask up to 3 focused clarifying questions before drafting.\n\nOutput Rules:\n- Output format: Table\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "professional, concise, practical",
        required: true
      },
      {
        key: "objective_detail",
        label: "Objective detail",
        placeholder: "Specific context and goals",
        required: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Word limit, deadline, compliance boundaries",
        required: true
      }
    ],
    bestPractices: [
      "Replace all placeholders before sending to Meta AI.",
      "Ask for one revision optimized for brevity after first draft.",
      "Validate factual statements before publishing externally."
    ],
    exampleUse: "Use when you need to normalize unstructured bug reports for triage quickly with structure.",
    outputFormat: "Table",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-027"
  },
  {
    slug: "release-notes-summary",
    title: "Release Notes Summary",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Simple",
    category: "Content",
    tags: [
      "metaai",
      "chat",
      "content",
      "workflow",
      "release",
      "notes",
      "summary"
    ],
    summary: "Meta AI prompt for summarize release notes by user impact with structured outputs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Release Notes Summary.\n\nObjective:\n- Summarize release notes by user impact for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- If required context is missing, ask up to 3 focused clarifying questions before drafting.\n\nOutput Rules:\n- Output format: Script\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "professional, concise, practical",
        required: true
      },
      {
        key: "objective_detail",
        label: "Objective detail",
        placeholder: "Specific context and goals",
        required: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Word limit, deadline, compliance boundaries",
        required: true
      }
    ],
    bestPractices: [
      "Replace all placeholders before sending to Meta AI.",
      "Ask for one revision optimized for brevity after first draft.",
      "Validate factual statements before publishing externally."
    ],
    exampleUse: "Use when you need to summarize release notes by user impact quickly with structure.",
    outputFormat: "Script",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-028"
  },
  {
    slug: "survey-question-bank",
    title: "Survey Question Bank",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Simple",
    category: "Marketing",
    tags: [
      "metaai",
      "chat",
      "marketing",
      "workflow",
      "survey",
      "question",
      "bank"
    ],
    summary: "Meta AI prompt for create structured survey questions for insights with structured outputs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Survey Question Bank.\n\nObjective:\n- Create structured survey questions for insights for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- If required context is missing, ask up to 3 focused clarifying questions before drafting.\n\nOutput Rules:\n- Output format: Bullets\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "professional, concise, practical",
        required: true
      },
      {
        key: "objective_detail",
        label: "Objective detail",
        placeholder: "Specific context and goals",
        required: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Word limit, deadline, compliance boundaries",
        required: true
      }
    ],
    bestPractices: [
      "Replace all placeholders before sending to Meta AI.",
      "Ask for one revision optimized for brevity after first draft.",
      "Validate factual statements before publishing externally."
    ],
    exampleUse: "Use when you need to create structured survey questions for insights quickly with structure.",
    outputFormat: "Bullets",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-029"
  },
  {
    slug: "interview-question-set",
    title: "Interview Question Set",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Simple",
    category: "Operations",
    tags: [
      "metaai",
      "chat",
      "operations",
      "workflow",
      "interview",
      "question"
    ],
    summary: "Meta AI prompt for generate role-based interview questions with rubric with structured outputs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Interview Question Set.\n\nObjective:\n- Generate role-based interview questions with rubric for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- If required context is missing, ask up to 3 focused clarifying questions before drafting.\n\nOutput Rules:\n- Output format: Steps\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "professional, concise, practical",
        required: true
      },
      {
        key: "objective_detail",
        label: "Objective detail",
        placeholder: "Specific context and goals",
        required: true
      },
      {
        key: "constraints",
        label: "Constraints",
        placeholder: "Word limit, deadline, compliance boundaries",
        required: true
      }
    ],
    bestPractices: [
      "Replace all placeholders before sending to Meta AI.",
      "Ask for one revision optimized for brevity after first draft.",
      "Validate factual statements before publishing externally."
    ],
    exampleUse: "Use when you need to generate role-based interview questions with rubric quickly with structure.",
    outputFormat: "Steps",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-030"
  },
  {
    slug: "multi-channel-campaign-architect",
    title: "Multi-Channel Campaign Architect",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Advanced",
    category: "Marketing",
    tags: [
      "metaai",
      "chat",
      "marketing",
      "workflow",
      "multi",
      "channel",
      "campaign",
      "architect"
    ],
    summary: "Advanced Meta AI prompt for design an integrated campaign strategy across channels with assumptions and tradeoffs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Multi-Channel Campaign Architect.\n\nObjective:\n- Design an integrated campaign strategy across channels for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- Provide a primary recommendation and a fallback option with tradeoffs.\n- Start by listing assumptions and risks before final output.\n\nOutput Rules:\n- Output format: Table\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "direct, practical, enterprise-safe",
        required: true
      },
      {
        key: "timeline",
        label: "Timeline",
        placeholder: "8 weeks",
        required: true
      },
      {
        key: "budget_or_capacity",
        label: "Budget/capacity",
        placeholder: "$10,000 or team capacity details",
        required: true
      },
      {
        key: "success_metrics",
        label: "Success metrics",
        placeholder: "Primary KPIs and target outcomes",
        required: true
      }
    ],
    bestPractices: [
      "Have Meta AI output assumptions first, then final plan.",
      "Request a fallback option with clear tradeoffs.",
      "Map every recommendation to measurable outcomes."
    ],
    exampleUse: "Use when design an integrated campaign strategy across channels requires strategic depth and governance context.",
    outputFormat: "Table",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-031"
  },
  {
    slug: "persona-messaging-framework",
    title: "Persona Messaging Framework",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Advanced",
    category: "Marketing",
    tags: [
      "metaai",
      "chat",
      "marketing",
      "workflow",
      "persona",
      "messaging",
      "framework"
    ],
    summary: "Advanced Meta AI prompt for build persona-specific messaging framework and objections with assumptions and tradeoffs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Persona Messaging Framework.\n\nObjective:\n- Build persona-specific messaging framework and objections for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- Provide a primary recommendation and a fallback option with tradeoffs.\n- Start by listing assumptions and risks before final output.\n\nOutput Rules:\n- Output format: Steps\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "direct, practical, enterprise-safe",
        required: true
      },
      {
        key: "timeline",
        label: "Timeline",
        placeholder: "8 weeks",
        required: true
      },
      {
        key: "budget_or_capacity",
        label: "Budget/capacity",
        placeholder: "$10,000 or team capacity details",
        required: true
      },
      {
        key: "success_metrics",
        label: "Success metrics",
        placeholder: "Primary KPIs and target outcomes",
        required: true
      }
    ],
    bestPractices: [
      "Have Meta AI output assumptions first, then final plan.",
      "Request a fallback option with clear tradeoffs.",
      "Map every recommendation to measurable outcomes."
    ],
    exampleUse: "Use when build persona-specific messaging framework and objections requires strategic depth and governance context.",
    outputFormat: "Steps",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-032"
  },
  {
    slug: "quarterly-content-program",
    title: "Quarterly Content Program",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Advanced",
    category: "Content",
    tags: [
      "metaai",
      "chat",
      "content",
      "workflow",
      "quarterly",
      "program"
    ],
    summary: "Advanced Meta AI prompt for plan a 90-day content roadmap with dependencies with assumptions and tradeoffs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Quarterly Content Program.\n\nObjective:\n- Plan a 90-day content roadmap with dependencies for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- Provide a primary recommendation and a fallback option with tradeoffs.\n- Start by listing assumptions and risks before final output.\n\nOutput Rules:\n- Output format: JSON\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "direct, practical, enterprise-safe",
        required: true
      },
      {
        key: "timeline",
        label: "Timeline",
        placeholder: "8 weeks",
        required: true
      },
      {
        key: "budget_or_capacity",
        label: "Budget/capacity",
        placeholder: "$10,000 or team capacity details",
        required: true
      },
      {
        key: "success_metrics",
        label: "Success metrics",
        placeholder: "Primary KPIs and target outcomes",
        required: true
      }
    ],
    bestPractices: [
      "Have Meta AI output assumptions first, then final plan.",
      "Request a fallback option with clear tradeoffs.",
      "Map every recommendation to measurable outcomes."
    ],
    exampleUse: "Use when plan a 90-day content roadmap with dependencies requires strategic depth and governance context.",
    outputFormat: "JSON",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-033"
  },
  {
    slug: "a-b-testing-backlog",
    title: "A/B Testing Backlog",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Advanced",
    category: "Marketing",
    tags: [
      "metaai",
      "chat",
      "marketing",
      "workflow",
      "testing",
      "backlog"
    ],
    summary: "Advanced Meta AI prompt for build prioritized experiment backlog with hypotheses with assumptions and tradeoffs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: A/B Testing Backlog.\n\nObjective:\n- Build prioritized experiment backlog with hypotheses for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- Provide a primary recommendation and a fallback option with tradeoffs.\n- Start by listing assumptions and risks before final output.\n\nOutput Rules:\n- Output format: Bullets\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "direct, practical, enterprise-safe",
        required: true
      },
      {
        key: "timeline",
        label: "Timeline",
        placeholder: "8 weeks",
        required: true
      },
      {
        key: "budget_or_capacity",
        label: "Budget/capacity",
        placeholder: "$10,000 or team capacity details",
        required: true
      },
      {
        key: "success_metrics",
        label: "Success metrics",
        placeholder: "Primary KPIs and target outcomes",
        required: true
      }
    ],
    bestPractices: [
      "Have Meta AI output assumptions first, then final plan.",
      "Request a fallback option with clear tradeoffs.",
      "Map every recommendation to measurable outcomes."
    ],
    exampleUse: "Use when build prioritized experiment backlog with hypotheses requires strategic depth and governance context.",
    outputFormat: "Bullets",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-034"
  },
  {
    slug: "seo-cluster-planner",
    title: "SEO Cluster Planner",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Advanced",
    category: "SEO",
    tags: [
      "metaai",
      "chat",
      "seo",
      "workflow",
      "cluster",
      "planner"
    ],
    summary: "Advanced Meta AI prompt for map pillar-cluster strategy and internal links with assumptions and tradeoffs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: SEO Cluster Planner.\n\nObjective:\n- Map pillar-cluster strategy and internal links for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- Provide a primary recommendation and a fallback option with tradeoffs.\n- Start by listing assumptions and risks before final output.\n\nOutput Rules:\n- Output format: Table\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "direct, practical, enterprise-safe",
        required: true
      },
      {
        key: "timeline",
        label: "Timeline",
        placeholder: "8 weeks",
        required: true
      },
      {
        key: "budget_or_capacity",
        label: "Budget/capacity",
        placeholder: "$10,000 or team capacity details",
        required: true
      },
      {
        key: "success_metrics",
        label: "Success metrics",
        placeholder: "Primary KPIs and target outcomes",
        required: true
      }
    ],
    bestPractices: [
      "Have Meta AI output assumptions first, then final plan.",
      "Request a fallback option with clear tradeoffs.",
      "Map every recommendation to measurable outcomes."
    ],
    exampleUse: "Use when map pillar-cluster strategy and internal links requires strategic depth and governance context.",
    outputFormat: "Table",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-035"
  },
  {
    slug: "sales-enablement-one-pager",
    title: "Sales Enablement One-Pager",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Advanced",
    category: "Sales",
    tags: [
      "metaai",
      "chat",
      "sales",
      "workflow",
      "enablement",
      "pager"
    ],
    summary: "Advanced Meta AI prompt for create sales one-pagers and objection responses with assumptions and tradeoffs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Sales Enablement One-Pager.\n\nObjective:\n- Create sales one-pagers and objection responses for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- Provide a primary recommendation and a fallback option with tradeoffs.\n- Start by listing assumptions and risks before final output.\n\nOutput Rules:\n- Output format: Steps\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "direct, practical, enterprise-safe",
        required: true
      },
      {
        key: "timeline",
        label: "Timeline",
        placeholder: "8 weeks",
        required: true
      },
      {
        key: "budget_or_capacity",
        label: "Budget/capacity",
        placeholder: "$10,000 or team capacity details",
        required: true
      },
      {
        key: "success_metrics",
        label: "Success metrics",
        placeholder: "Primary KPIs and target outcomes",
        required: true
      }
    ],
    bestPractices: [
      "Have Meta AI output assumptions first, then final plan.",
      "Request a fallback option with clear tradeoffs.",
      "Map every recommendation to measurable outcomes."
    ],
    exampleUse: "Use when create sales one-pagers and objection responses requires strategic depth and governance context.",
    outputFormat: "Steps",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-036"
  },
  {
    slug: "abm-sequence-planner",
    title: "ABM Sequence Planner",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Advanced",
    category: "Marketing",
    tags: [
      "metaai",
      "chat",
      "marketing",
      "workflow",
      "sequence",
      "planner"
    ],
    summary: "Advanced Meta AI prompt for design account-based outreach sequences with assumptions and tradeoffs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: ABM Sequence Planner.\n\nObjective:\n- Design account-based outreach sequences for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- Provide a primary recommendation and a fallback option with tradeoffs.\n- Start by listing assumptions and risks before final output.\n\nOutput Rules:\n- Output format: JSON\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "direct, practical, enterprise-safe",
        required: true
      },
      {
        key: "timeline",
        label: "Timeline",
        placeholder: "8 weeks",
        required: true
      },
      {
        key: "budget_or_capacity",
        label: "Budget/capacity",
        placeholder: "$10,000 or team capacity details",
        required: true
      },
      {
        key: "success_metrics",
        label: "Success metrics",
        placeholder: "Primary KPIs and target outcomes",
        required: true
      }
    ],
    bestPractices: [
      "Have Meta AI output assumptions first, then final plan.",
      "Request a fallback option with clear tradeoffs.",
      "Map every recommendation to measurable outcomes."
    ],
    exampleUse: "Use when design account-based outreach sequences requires strategic depth and governance context.",
    outputFormat: "JSON",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-037"
  },
  {
    slug: "product-launch-plan",
    title: "Product Launch Plan",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Advanced",
    category: "Marketing",
    tags: [
      "metaai",
      "chat",
      "marketing",
      "workflow",
      "product",
      "launch",
      "plan"
    ],
    summary: "Advanced Meta AI prompt for create cross-functional launch plan with risks with assumptions and tradeoffs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Product Launch Plan.\n\nObjective:\n- Create cross-functional launch plan with risks for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- Provide a primary recommendation and a fallback option with tradeoffs.\n- Start by listing assumptions and risks before final output.\n\nOutput Rules:\n- Output format: Bullets\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "direct, practical, enterprise-safe",
        required: true
      },
      {
        key: "timeline",
        label: "Timeline",
        placeholder: "8 weeks",
        required: true
      },
      {
        key: "budget_or_capacity",
        label: "Budget/capacity",
        placeholder: "$10,000 or team capacity details",
        required: true
      },
      {
        key: "success_metrics",
        label: "Success metrics",
        placeholder: "Primary KPIs and target outcomes",
        required: true
      }
    ],
    bestPractices: [
      "Have Meta AI output assumptions first, then final plan.",
      "Request a fallback option with clear tradeoffs.",
      "Map every recommendation to measurable outcomes."
    ],
    exampleUse: "Use when create cross-functional launch plan with risks requires strategic depth and governance context.",
    outputFormat: "Bullets",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-038"
  },
  {
    slug: "crisis-communication-playbook",
    title: "Crisis Communication Playbook",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Advanced",
    category: "Support",
    tags: [
      "metaai",
      "chat",
      "support",
      "workflow",
      "crisis",
      "communication",
      "playbook"
    ],
    summary: "Advanced Meta AI prompt for draft multi-audience crisis communication templates with assumptions and tradeoffs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Crisis Communication Playbook.\n\nObjective:\n- Draft multi-audience crisis communication templates for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- Provide a primary recommendation and a fallback option with tradeoffs.\n- Start by listing assumptions and risks before final output.\n\nOutput Rules:\n- Output format: Table\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "direct, practical, enterprise-safe",
        required: true
      },
      {
        key: "timeline",
        label: "Timeline",
        placeholder: "8 weeks",
        required: true
      },
      {
        key: "budget_or_capacity",
        label: "Budget/capacity",
        placeholder: "$10,000 or team capacity details",
        required: true
      },
      {
        key: "success_metrics",
        label: "Success metrics",
        placeholder: "Primary KPIs and target outcomes",
        required: true
      }
    ],
    bestPractices: [
      "Have Meta AI output assumptions first, then final plan.",
      "Request a fallback option with clear tradeoffs.",
      "Map every recommendation to measurable outcomes."
    ],
    exampleUse: "Use when draft multi-audience crisis communication templates requires strategic depth and governance context.",
    outputFormat: "Table",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-039"
  },
  {
    slug: "brand-voice-guide",
    title: "Brand Voice Guide",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Advanced",
    category: "Branding",
    tags: [
      "metaai",
      "chat",
      "branding",
      "workflow",
      "brand",
      "voice",
      "guide"
    ],
    summary: "Advanced Meta AI prompt for create brand voice rules with examples with assumptions and tradeoffs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Brand Voice Guide.\n\nObjective:\n- Create brand voice rules with examples for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- Provide a primary recommendation and a fallback option with tradeoffs.\n- Start by listing assumptions and risks before final output.\n\nOutput Rules:\n- Output format: Steps\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "direct, practical, enterprise-safe",
        required: true
      },
      {
        key: "timeline",
        label: "Timeline",
        placeholder: "8 weeks",
        required: true
      },
      {
        key: "budget_or_capacity",
        label: "Budget/capacity",
        placeholder: "$10,000 or team capacity details",
        required: true
      },
      {
        key: "success_metrics",
        label: "Success metrics",
        placeholder: "Primary KPIs and target outcomes",
        required: true
      }
    ],
    bestPractices: [
      "Have Meta AI output assumptions first, then final plan.",
      "Request a fallback option with clear tradeoffs.",
      "Map every recommendation to measurable outcomes."
    ],
    exampleUse: "Use when create brand voice rules with examples requires strategic depth and governance context.",
    outputFormat: "Steps",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-040"
  },
  {
    slug: "editorial-style-guide",
    title: "Editorial Style Guide",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Advanced",
    category: "Content",
    tags: [
      "metaai",
      "chat",
      "content",
      "workflow",
      "editorial",
      "style",
      "guide"
    ],
    summary: "Advanced Meta AI prompt for define editorial standards and qa checklist with assumptions and tradeoffs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Editorial Style Guide.\n\nObjective:\n- Define editorial standards and QA checklist for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- Provide a primary recommendation and a fallback option with tradeoffs.\n- Start by listing assumptions and risks before final output.\n\nOutput Rules:\n- Output format: JSON\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "direct, practical, enterprise-safe",
        required: true
      },
      {
        key: "timeline",
        label: "Timeline",
        placeholder: "8 weeks",
        required: true
      },
      {
        key: "budget_or_capacity",
        label: "Budget/capacity",
        placeholder: "$10,000 or team capacity details",
        required: true
      },
      {
        key: "success_metrics",
        label: "Success metrics",
        placeholder: "Primary KPIs and target outcomes",
        required: true
      }
    ],
    bestPractices: [
      "Have Meta AI output assumptions first, then final plan.",
      "Request a fallback option with clear tradeoffs.",
      "Map every recommendation to measurable outcomes."
    ],
    exampleUse: "Use when define editorial standards and qa checklist requires strategic depth and governance context.",
    outputFormat: "JSON",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-041"
  },
  {
    slug: "competitive-narrative-reframe",
    title: "Competitive Narrative Reframe",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Advanced",
    category: "Marketing",
    tags: [
      "metaai",
      "chat",
      "marketing",
      "workflow",
      "competitive",
      "narrative",
      "reframe"
    ],
    summary: "Advanced Meta AI prompt for reframe positioning against competitors with assumptions and tradeoffs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Competitive Narrative Reframe.\n\nObjective:\n- Reframe positioning against competitors for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- Provide a primary recommendation and a fallback option with tradeoffs.\n- Start by listing assumptions and risks before final output.\n\nOutput Rules:\n- Output format: Bullets\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "direct, practical, enterprise-safe",
        required: true
      },
      {
        key: "timeline",
        label: "Timeline",
        placeholder: "8 weeks",
        required: true
      },
      {
        key: "budget_or_capacity",
        label: "Budget/capacity",
        placeholder: "$10,000 or team capacity details",
        required: true
      },
      {
        key: "success_metrics",
        label: "Success metrics",
        placeholder: "Primary KPIs and target outcomes",
        required: true
      }
    ],
    bestPractices: [
      "Have Meta AI output assumptions first, then final plan.",
      "Request a fallback option with clear tradeoffs.",
      "Map every recommendation to measurable outcomes."
    ],
    exampleUse: "Use when reframe positioning against competitors requires strategic depth and governance context.",
    outputFormat: "Bullets",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-042"
  },
  {
    slug: "objection-handling-matrix",
    title: "Objection Handling Matrix",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Advanced",
    category: "Sales",
    tags: [
      "metaai",
      "chat",
      "sales",
      "workflow",
      "objection",
      "handling",
      "matrix"
    ],
    summary: "Advanced Meta AI prompt for build objection matrix with evidence-based responses with assumptions and tradeoffs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Objection Handling Matrix.\n\nObjective:\n- Build objection matrix with evidence-based responses for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- Provide a primary recommendation and a fallback option with tradeoffs.\n- Start by listing assumptions and risks before final output.\n\nOutput Rules:\n- Output format: Table\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "direct, practical, enterprise-safe",
        required: true
      },
      {
        key: "timeline",
        label: "Timeline",
        placeholder: "8 weeks",
        required: true
      },
      {
        key: "budget_or_capacity",
        label: "Budget/capacity",
        placeholder: "$10,000 or team capacity details",
        required: true
      },
      {
        key: "success_metrics",
        label: "Success metrics",
        placeholder: "Primary KPIs and target outcomes",
        required: true
      }
    ],
    bestPractices: [
      "Have Meta AI output assumptions first, then final plan.",
      "Request a fallback option with clear tradeoffs.",
      "Map every recommendation to measurable outcomes."
    ],
    exampleUse: "Use when build objection matrix with evidence-based responses requires strategic depth and governance context.",
    outputFormat: "Table",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-043"
  },
  {
    slug: "lifecycle-email-drip-architecture",
    title: "Lifecycle Email Drip Architecture",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Advanced",
    category: "Marketing",
    tags: [
      "metaai",
      "chat",
      "marketing",
      "workflow",
      "lifecycle",
      "email",
      "drip",
      "architecture"
    ],
    summary: "Advanced Meta AI prompt for design lifecycle email sequence with triggers with assumptions and tradeoffs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Lifecycle Email Drip Architecture.\n\nObjective:\n- Design lifecycle email sequence with triggers for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- Provide a primary recommendation and a fallback option with tradeoffs.\n- Start by listing assumptions and risks before final output.\n\nOutput Rules:\n- Output format: Steps\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "direct, practical, enterprise-safe",
        required: true
      },
      {
        key: "timeline",
        label: "Timeline",
        placeholder: "8 weeks",
        required: true
      },
      {
        key: "budget_or_capacity",
        label: "Budget/capacity",
        placeholder: "$10,000 or team capacity details",
        required: true
      },
      {
        key: "success_metrics",
        label: "Success metrics",
        placeholder: "Primary KPIs and target outcomes",
        required: true
      }
    ],
    bestPractices: [
      "Have Meta AI output assumptions first, then final plan.",
      "Request a fallback option with clear tradeoffs.",
      "Map every recommendation to measurable outcomes."
    ],
    exampleUse: "Use when design lifecycle email sequence with triggers requires strategic depth and governance context.",
    outputFormat: "Steps",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-044"
  },
  {
    slug: "customer-journey-mapping",
    title: "Customer Journey Mapping",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Advanced",
    category: "Operations",
    tags: [
      "metaai",
      "chat",
      "operations",
      "workflow",
      "customer",
      "journey",
      "mapping"
    ],
    summary: "Advanced Meta AI prompt for map customer journey and friction points with assumptions and tradeoffs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Customer Journey Mapping.\n\nObjective:\n- Map customer journey and friction points for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- Provide a primary recommendation and a fallback option with tradeoffs.\n- Start by listing assumptions and risks before final output.\n\nOutput Rules:\n- Output format: JSON\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "direct, practical, enterprise-safe",
        required: true
      },
      {
        key: "timeline",
        label: "Timeline",
        placeholder: "8 weeks",
        required: true
      },
      {
        key: "budget_or_capacity",
        label: "Budget/capacity",
        placeholder: "$10,000 or team capacity details",
        required: true
      },
      {
        key: "success_metrics",
        label: "Success metrics",
        placeholder: "Primary KPIs and target outcomes",
        required: true
      }
    ],
    bestPractices: [
      "Have Meta AI output assumptions first, then final plan.",
      "Request a fallback option with clear tradeoffs.",
      "Map every recommendation to measurable outcomes."
    ],
    exampleUse: "Use when map customer journey and friction points requires strategic depth and governance context.",
    outputFormat: "JSON",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-045"
  },
  {
    slug: "executive-brief-from-long-docs",
    title: "Executive Brief from Long Docs",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Advanced",
    category: "Presentations",
    tags: [
      "metaai",
      "chat",
      "presentations",
      "workflow",
      "executive",
      "brief",
      "from",
      "long"
    ],
    summary: "Advanced Meta AI prompt for summarize long documents for leadership decisions with assumptions and tradeoffs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Executive Brief from Long Docs.\n\nObjective:\n- Summarize long documents for leadership decisions for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- Provide a primary recommendation and a fallback option with tradeoffs.\n- Start by listing assumptions and risks before final output.\n\nOutput Rules:\n- Output format: Bullets\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "direct, practical, enterprise-safe",
        required: true
      },
      {
        key: "timeline",
        label: "Timeline",
        placeholder: "8 weeks",
        required: true
      },
      {
        key: "budget_or_capacity",
        label: "Budget/capacity",
        placeholder: "$10,000 or team capacity details",
        required: true
      },
      {
        key: "success_metrics",
        label: "Success metrics",
        placeholder: "Primary KPIs and target outcomes",
        required: true
      }
    ],
    bestPractices: [
      "Have Meta AI output assumptions first, then final plan.",
      "Request a fallback option with clear tradeoffs.",
      "Map every recommendation to measurable outcomes."
    ],
    exampleUse: "Use when summarize long documents for leadership decisions requires strategic depth and governance context.",
    outputFormat: "Bullets",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-046"
  },
  {
    slug: "policy-to-sop-conversion",
    title: "Policy-to-SOP Conversion",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Advanced",
    category: "Operations",
    tags: [
      "metaai",
      "chat",
      "operations",
      "workflow",
      "policy",
      "conversion"
    ],
    summary: "Advanced Meta AI prompt for convert policy requirements into sop workflows with assumptions and tradeoffs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Policy-to-SOP Conversion.\n\nObjective:\n- Convert policy requirements into SOP workflows for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- Provide a primary recommendation and a fallback option with tradeoffs.\n- Start by listing assumptions and risks before final output.\n\nOutput Rules:\n- Output format: Table\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "direct, practical, enterprise-safe",
        required: true
      },
      {
        key: "timeline",
        label: "Timeline",
        placeholder: "8 weeks",
        required: true
      },
      {
        key: "budget_or_capacity",
        label: "Budget/capacity",
        placeholder: "$10,000 or team capacity details",
        required: true
      },
      {
        key: "success_metrics",
        label: "Success metrics",
        placeholder: "Primary KPIs and target outcomes",
        required: true
      }
    ],
    bestPractices: [
      "Have Meta AI output assumptions first, then final plan.",
      "Request a fallback option with clear tradeoffs.",
      "Map every recommendation to measurable outcomes."
    ],
    exampleUse: "Use when convert policy requirements into sop workflows requires strategic depth and governance context.",
    outputFormat: "Table",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-047"
  },
  {
    slug: "rfp-response-drafting",
    title: "RFP Response Drafting",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Advanced",
    category: "Business",
    tags: [
      "metaai",
      "chat",
      "business",
      "workflow",
      "response",
      "drafting"
    ],
    summary: "Advanced Meta AI prompt for draft requirement-aligned rfp responses with assumptions and tradeoffs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: RFP Response Drafting.\n\nObjective:\n- Draft requirement-aligned RFP responses for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- Provide a primary recommendation and a fallback option with tradeoffs.\n- Start by listing assumptions and risks before final output.\n\nOutput Rules:\n- Output format: Steps\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "direct, practical, enterprise-safe",
        required: true
      },
      {
        key: "timeline",
        label: "Timeline",
        placeholder: "8 weeks",
        required: true
      },
      {
        key: "budget_or_capacity",
        label: "Budget/capacity",
        placeholder: "$10,000 or team capacity details",
        required: true
      },
      {
        key: "success_metrics",
        label: "Success metrics",
        placeholder: "Primary KPIs and target outcomes",
        required: true
      }
    ],
    bestPractices: [
      "Have Meta AI output assumptions first, then final plan.",
      "Request a fallback option with clear tradeoffs.",
      "Map every recommendation to measurable outcomes."
    ],
    exampleUse: "Use when draft requirement-aligned rfp responses requires strategic depth and governance context.",
    outputFormat: "Steps",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-048"
  },
  {
    slug: "partner-co-marketing-plan",
    title: "Partner Co-Marketing Plan",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Advanced",
    category: "Marketing",
    tags: [
      "metaai",
      "chat",
      "marketing",
      "workflow",
      "partner",
      "plan"
    ],
    summary: "Advanced Meta AI prompt for design partner co-marketing plans and kpis with assumptions and tradeoffs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Partner Co-Marketing Plan.\n\nObjective:\n- Design partner co-marketing plans and KPIs for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- Provide a primary recommendation and a fallback option with tradeoffs.\n- Start by listing assumptions and risks before final output.\n\nOutput Rules:\n- Output format: JSON\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "direct, practical, enterprise-safe",
        required: true
      },
      {
        key: "timeline",
        label: "Timeline",
        placeholder: "8 weeks",
        required: true
      },
      {
        key: "budget_or_capacity",
        label: "Budget/capacity",
        placeholder: "$10,000 or team capacity details",
        required: true
      },
      {
        key: "success_metrics",
        label: "Success metrics",
        placeholder: "Primary KPIs and target outcomes",
        required: true
      }
    ],
    bestPractices: [
      "Have Meta AI output assumptions first, then final plan.",
      "Request a fallback option with clear tradeoffs.",
      "Map every recommendation to measurable outcomes."
    ],
    exampleUse: "Use when design partner co-marketing plans and kpis requires strategic depth and governance context.",
    outputFormat: "JSON",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-049"
  },
  {
    slug: "training-curriculum-design",
    title: "Training Curriculum Design",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Advanced",
    category: "Education",
    tags: [
      "metaai",
      "chat",
      "education",
      "workflow",
      "training",
      "curriculum",
      "design"
    ],
    summary: "Advanced Meta AI prompt for create curriculum with assessments and rubric with assumptions and tradeoffs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Training Curriculum Design.\n\nObjective:\n- Create curriculum with assessments and rubric for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- Provide a primary recommendation and a fallback option with tradeoffs.\n- Start by listing assumptions and risks before final output.\n\nOutput Rules:\n- Output format: Bullets\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "direct, practical, enterprise-safe",
        required: true
      },
      {
        key: "timeline",
        label: "Timeline",
        placeholder: "8 weeks",
        required: true
      },
      {
        key: "budget_or_capacity",
        label: "Budget/capacity",
        placeholder: "$10,000 or team capacity details",
        required: true
      },
      {
        key: "success_metrics",
        label: "Success metrics",
        placeholder: "Primary KPIs and target outcomes",
        required: true
      }
    ],
    bestPractices: [
      "Have Meta AI output assumptions first, then final plan.",
      "Request a fallback option with clear tradeoffs.",
      "Map every recommendation to measurable outcomes."
    ],
    exampleUse: "Use when create curriculum with assessments and rubric requires strategic depth and governance context.",
    outputFormat: "Bullets",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-050"
  },
  {
    slug: "incident-postmortem-draft",
    title: "Incident Postmortem Draft",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Advanced",
    category: "Support",
    tags: [
      "metaai",
      "chat",
      "support",
      "workflow",
      "incident",
      "postmortem",
      "draft"
    ],
    summary: "Advanced Meta AI prompt for draft blameless postmortem and action plan with assumptions and tradeoffs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Incident Postmortem Draft.\n\nObjective:\n- Draft blameless postmortem and action plan for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- Provide a primary recommendation and a fallback option with tradeoffs.\n- Start by listing assumptions and risks before final output.\n\nOutput Rules:\n- Output format: Table\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "direct, practical, enterprise-safe",
        required: true
      },
      {
        key: "timeline",
        label: "Timeline",
        placeholder: "8 weeks",
        required: true
      },
      {
        key: "budget_or_capacity",
        label: "Budget/capacity",
        placeholder: "$10,000 or team capacity details",
        required: true
      },
      {
        key: "success_metrics",
        label: "Success metrics",
        placeholder: "Primary KPIs and target outcomes",
        required: true
      }
    ],
    bestPractices: [
      "Have Meta AI output assumptions first, then final plan.",
      "Request a fallback option with clear tradeoffs.",
      "Map every recommendation to measurable outcomes."
    ],
    exampleUse: "Use when draft blameless postmortem and action plan requires strategic depth and governance context.",
    outputFormat: "Table",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-051"
  },
  {
    slug: "knowledge-base-taxonomy-design",
    title: "Knowledge Base Taxonomy Design",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Advanced",
    category: "Content",
    tags: [
      "metaai",
      "chat",
      "content",
      "workflow",
      "knowledge",
      "base",
      "taxonomy",
      "design"
    ],
    summary: "Advanced Meta AI prompt for design kb taxonomy and governance with assumptions and tradeoffs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Knowledge Base Taxonomy Design.\n\nObjective:\n- Design KB taxonomy and governance for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- Provide a primary recommendation and a fallback option with tradeoffs.\n- Start by listing assumptions and risks before final output.\n\nOutput Rules:\n- Output format: Steps\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "direct, practical, enterprise-safe",
        required: true
      },
      {
        key: "timeline",
        label: "Timeline",
        placeholder: "8 weeks",
        required: true
      },
      {
        key: "budget_or_capacity",
        label: "Budget/capacity",
        placeholder: "$10,000 or team capacity details",
        required: true
      },
      {
        key: "success_metrics",
        label: "Success metrics",
        placeholder: "Primary KPIs and target outcomes",
        required: true
      }
    ],
    bestPractices: [
      "Have Meta AI output assumptions first, then final plan.",
      "Request a fallback option with clear tradeoffs.",
      "Map every recommendation to measurable outcomes."
    ],
    exampleUse: "Use when design kb taxonomy and governance requires strategic depth and governance context.",
    outputFormat: "Steps",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-052"
  },
  {
    slug: "support-macro-library",
    title: "Support Macro Library",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Advanced",
    category: "Support",
    tags: [
      "metaai",
      "chat",
      "support",
      "workflow",
      "macro",
      "library"
    ],
    summary: "Advanced Meta AI prompt for create support macro library by issue class with assumptions and tradeoffs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Support Macro Library.\n\nObjective:\n- Create support macro library by issue class for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- Provide a primary recommendation and a fallback option with tradeoffs.\n- Start by listing assumptions and risks before final output.\n\nOutput Rules:\n- Output format: JSON\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "direct, practical, enterprise-safe",
        required: true
      },
      {
        key: "timeline",
        label: "Timeline",
        placeholder: "8 weeks",
        required: true
      },
      {
        key: "budget_or_capacity",
        label: "Budget/capacity",
        placeholder: "$10,000 or team capacity details",
        required: true
      },
      {
        key: "success_metrics",
        label: "Success metrics",
        placeholder: "Primary KPIs and target outcomes",
        required: true
      }
    ],
    bestPractices: [
      "Have Meta AI output assumptions first, then final plan.",
      "Request a fallback option with clear tradeoffs.",
      "Map every recommendation to measurable outcomes."
    ],
    exampleUse: "Use when create support macro library by issue class requires strategic depth and governance context.",
    outputFormat: "JSON",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-053"
  },
  {
    slug: "localization-brief-for-regions",
    title: "Localization Brief for Regions",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Advanced",
    category: "Content",
    tags: [
      "metaai",
      "chat",
      "content",
      "workflow",
      "localization",
      "brief",
      "regions"
    ],
    summary: "Advanced Meta AI prompt for build localization brief for multiple regions with assumptions and tradeoffs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Localization Brief for Regions.\n\nObjective:\n- Build localization brief for multiple regions for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- Provide a primary recommendation and a fallback option with tradeoffs.\n- Start by listing assumptions and risks before final output.\n\nOutput Rules:\n- Output format: Bullets\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "direct, practical, enterprise-safe",
        required: true
      },
      {
        key: "timeline",
        label: "Timeline",
        placeholder: "8 weeks",
        required: true
      },
      {
        key: "budget_or_capacity",
        label: "Budget/capacity",
        placeholder: "$10,000 or team capacity details",
        required: true
      },
      {
        key: "success_metrics",
        label: "Success metrics",
        placeholder: "Primary KPIs and target outcomes",
        required: true
      }
    ],
    bestPractices: [
      "Have Meta AI output assumptions first, then final plan.",
      "Request a fallback option with clear tradeoffs.",
      "Map every recommendation to measurable outcomes."
    ],
    exampleUse: "Use when build localization brief for multiple regions requires strategic depth and governance context.",
    outputFormat: "Bullets",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-054"
  },
  {
    slug: "prd-summary-for-executives",
    title: "PRD Summary for Executives",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Advanced",
    category: "Product",
    tags: [
      "metaai",
      "chat",
      "product",
      "workflow",
      "summary",
      "executives"
    ],
    summary: "Advanced Meta AI prompt for summarize prd for non-technical stakeholders with assumptions and tradeoffs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: PRD Summary for Executives.\n\nObjective:\n- Summarize PRD for non-technical stakeholders for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- Provide a primary recommendation and a fallback option with tradeoffs.\n- Start by listing assumptions and risks before final output.\n\nOutput Rules:\n- Output format: Table\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "direct, practical, enterprise-safe",
        required: true
      },
      {
        key: "timeline",
        label: "Timeline",
        placeholder: "8 weeks",
        required: true
      },
      {
        key: "budget_or_capacity",
        label: "Budget/capacity",
        placeholder: "$10,000 or team capacity details",
        required: true
      },
      {
        key: "success_metrics",
        label: "Success metrics",
        placeholder: "Primary KPIs and target outcomes",
        required: true
      }
    ],
    bestPractices: [
      "Have Meta AI output assumptions first, then final plan.",
      "Request a fallback option with clear tradeoffs.",
      "Map every recommendation to measurable outcomes."
    ],
    exampleUse: "Use when summarize prd for non-technical stakeholders requires strategic depth and governance context.",
    outputFormat: "Table",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-055"
  },
  {
    slug: "board-update-narrative",
    title: "Board Update Narrative",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Advanced",
    category: "Business",
    tags: [
      "metaai",
      "chat",
      "business",
      "workflow",
      "board",
      "update",
      "narrative"
    ],
    summary: "Advanced Meta AI prompt for create board-ready kpi narrative and decisions with assumptions and tradeoffs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Board Update Narrative.\n\nObjective:\n- Create board-ready KPI narrative and decisions for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- Provide a primary recommendation and a fallback option with tradeoffs.\n- Start by listing assumptions and risks before final output.\n\nOutput Rules:\n- Output format: Steps\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "direct, practical, enterprise-safe",
        required: true
      },
      {
        key: "timeline",
        label: "Timeline",
        placeholder: "8 weeks",
        required: true
      },
      {
        key: "budget_or_capacity",
        label: "Budget/capacity",
        placeholder: "$10,000 or team capacity details",
        required: true
      },
      {
        key: "success_metrics",
        label: "Success metrics",
        placeholder: "Primary KPIs and target outcomes",
        required: true
      }
    ],
    bestPractices: [
      "Have Meta AI output assumptions first, then final plan.",
      "Request a fallback option with clear tradeoffs.",
      "Map every recommendation to measurable outcomes."
    ],
    exampleUse: "Use when create board-ready kpi narrative and decisions requires strategic depth and governance context.",
    outputFormat: "Steps",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-056"
  },
  {
    slug: "stakeholder-communication-plan",
    title: "Stakeholder Communication Plan",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Advanced",
    category: "Operations",
    tags: [
      "metaai",
      "chat",
      "operations",
      "workflow",
      "stakeholder",
      "communication",
      "plan"
    ],
    summary: "Advanced Meta AI prompt for build stakeholder communication plan and cadence with assumptions and tradeoffs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Stakeholder Communication Plan.\n\nObjective:\n- Build stakeholder communication plan and cadence for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- Provide a primary recommendation and a fallback option with tradeoffs.\n- Start by listing assumptions and risks before final output.\n\nOutput Rules:\n- Output format: JSON\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "direct, practical, enterprise-safe",
        required: true
      },
      {
        key: "timeline",
        label: "Timeline",
        placeholder: "8 weeks",
        required: true
      },
      {
        key: "budget_or_capacity",
        label: "Budget/capacity",
        placeholder: "$10,000 or team capacity details",
        required: true
      },
      {
        key: "success_metrics",
        label: "Success metrics",
        placeholder: "Primary KPIs and target outcomes",
        required: true
      }
    ],
    bestPractices: [
      "Have Meta AI output assumptions first, then final plan.",
      "Request a fallback option with clear tradeoffs.",
      "Map every recommendation to measurable outcomes."
    ],
    exampleUse: "Use when build stakeholder communication plan and cadence requires strategic depth and governance context.",
    outputFormat: "JSON",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-057"
  },
  {
    slug: "decision-log-extractor",
    title: "Decision Log Extractor",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Advanced",
    category: "Operations",
    tags: [
      "metaai",
      "chat",
      "operations",
      "workflow",
      "decision",
      "extractor"
    ],
    summary: "Advanced Meta AI prompt for extract decision logs from meeting transcripts with assumptions and tradeoffs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Decision Log Extractor.\n\nObjective:\n- Extract decision logs from meeting transcripts for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- Provide a primary recommendation and a fallback option with tradeoffs.\n- Start by listing assumptions and risks before final output.\n\nOutput Rules:\n- Output format: Bullets\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "direct, practical, enterprise-safe",
        required: true
      },
      {
        key: "timeline",
        label: "Timeline",
        placeholder: "8 weeks",
        required: true
      },
      {
        key: "budget_or_capacity",
        label: "Budget/capacity",
        placeholder: "$10,000 or team capacity details",
        required: true
      },
      {
        key: "success_metrics",
        label: "Success metrics",
        placeholder: "Primary KPIs and target outcomes",
        required: true
      }
    ],
    bestPractices: [
      "Have Meta AI output assumptions first, then final plan.",
      "Request a fallback option with clear tradeoffs.",
      "Map every recommendation to measurable outcomes."
    ],
    exampleUse: "Use when extract decision logs from meeting transcripts requires strategic depth and governance context.",
    outputFormat: "Bullets",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-058"
  },
  {
    slug: "prompt-quality-rubric",
    title: "Prompt Quality Rubric",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Advanced",
    category: "Content",
    tags: [
      "metaai",
      "chat",
      "content",
      "workflow",
      "prompt",
      "quality",
      "rubric"
    ],
    summary: "Advanced Meta AI prompt for build rubric for evaluating prompt quality with assumptions and tradeoffs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Prompt Quality Rubric.\n\nObjective:\n- Build rubric for evaluating prompt quality for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- Provide a primary recommendation and a fallback option with tradeoffs.\n- Start by listing assumptions and risks before final output.\n\nOutput Rules:\n- Output format: Table\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "direct, practical, enterprise-safe",
        required: true
      },
      {
        key: "timeline",
        label: "Timeline",
        placeholder: "8 weeks",
        required: true
      },
      {
        key: "budget_or_capacity",
        label: "Budget/capacity",
        placeholder: "$10,000 or team capacity details",
        required: true
      },
      {
        key: "success_metrics",
        label: "Success metrics",
        placeholder: "Primary KPIs and target outcomes",
        required: true
      }
    ],
    bestPractices: [
      "Have Meta AI output assumptions first, then final plan.",
      "Request a fallback option with clear tradeoffs.",
      "Map every recommendation to measurable outcomes."
    ],
    exampleUse: "Use when build rubric for evaluating prompt quality requires strategic depth and governance context.",
    outputFormat: "Table",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-059"
  },
  {
    slug: "prompt-optimization-sprint",
    title: "Prompt Optimization Sprint",
    platform: "MetaAI",
    tool: "Chat",
    complexity: "Advanced",
    category: "Content",
    tags: [
      "metaai",
      "chat",
      "content",
      "workflow",
      "prompt",
      "optimization",
      "sprint"
    ],
    summary: "Advanced Meta AI prompt for plan optimization sprint for prompt workflows with assumptions and tradeoffs.",
    prompt: "You are a senior assistant operating in Meta AI chat.\n\nRole:\n- Act as a domain expert for: Prompt Optimization Sprint.\n\nObjective:\n- Plan optimization sprint for prompt workflows for {brand_name} targeting {audience}.\n\nConstraints:\n- Tone: {tone}\n- Respect policy, legal, and compliance boundaries.\n- Avoid speculation and do not fabricate metrics or references.\n- Provide a primary recommendation and a fallback option with tradeoffs.\n- Start by listing assumptions and risks before final output.\n\nOutput Rules:\n- Output format: Steps\n- Include: summary, recommended actions, and next steps.\n- Provide one concise version and one expanded version.",
    variables: [
      {
        key: "brand_name",
        label: "Brand name",
        placeholder: "TamemJ",
        required: true
      },
      {
        key: "audience",
        label: "Audience",
        placeholder: "IT administrators and support teams",
        required: true
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "direct, practical, enterprise-safe",
        required: true
      },
      {
        key: "timeline",
        label: "Timeline",
        placeholder: "8 weeks",
        required: true
      },
      {
        key: "budget_or_capacity",
        label: "Budget/capacity",
        placeholder: "$10,000 or team capacity details",
        required: true
      },
      {
        key: "success_metrics",
        label: "Success metrics",
        placeholder: "Primary KPIs and target outcomes",
        required: true
      }
    ],
    bestPractices: [
      "Have Meta AI output assumptions first, then final plan.",
      "Request a fallback option with clear tradeoffs.",
      "Map every recommendation to measurable outcomes."
    ],
    exampleUse: "Use when plan optimization sprint for prompt workflows requires strategic depth and governance context.",
    outputFormat: "Steps",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-060"
  },
  {
    slug: "remove-person-from-background-adobe",
    title: "Remove Person from Background (Adobe Generative Fill)",
    platform: "AdobeGenAI",
    tool: "GenerativeFill",
    complexity: "Simple",
    category: "Photo Edit",
    tags: [
      "adobe-genai",
      "generativefill",
      "photo-edit",
      "creative",
      "remove",
      "person",
      "from",
      "background"
    ],
    summary: "Short, literal Generative Fill prompt for remove person from background.",
    prompt: "Remove Person from Background: remove or replace {target_object} in {target_area}; rebuild realistic {surface_texture} with matching perspective and lighting.",
    variables: [
      {
        key: "target_object",
        label: "Target object",
        placeholder: "person, logo, cable, sign",
        required: true
      },
      {
        key: "target_area",
        label: "Target area",
        placeholder: "left background",
        required: true
      },
      {
        key: "surface_texture",
        label: "Surface texture",
        placeholder: "brick wall, fabric, sky gradient",
        required: true
      }
    ],
    bestPractices: [
      "Use short, object-focused prompts for Generative Fill.",
      "Select slightly beyond object edges for cleaner blending.",
      "Generate a few variants and inspect at 100% zoom."
    ],
    exampleUse: "Photo cleanup for social, ads, and website assets.",
    negativePrompt: "warped geometry, repeated artifacts, blurry patch edges",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-061"
  },
  {
    slug: "remove-logo-from-apparel-adobe",
    title: "Remove Logo from Apparel (Adobe Generative Fill)",
    platform: "AdobeGenAI",
    tool: "GenerativeFill",
    complexity: "Simple",
    category: "Photo Edit",
    tags: [
      "adobe-genai",
      "generativefill",
      "photo-edit",
      "creative",
      "remove",
      "logo",
      "from",
      "apparel"
    ],
    summary: "Short, literal Generative Fill prompt for remove logo from apparel.",
    prompt: "Remove Logo from Apparel: remove or replace {target_object} in {target_area}; rebuild realistic {surface_texture} with matching perspective and lighting.",
    variables: [
      {
        key: "target_object",
        label: "Target object",
        placeholder: "person, logo, cable, sign",
        required: true
      },
      {
        key: "target_area",
        label: "Target area",
        placeholder: "left background",
        required: true
      },
      {
        key: "surface_texture",
        label: "Surface texture",
        placeholder: "brick wall, fabric, sky gradient",
        required: true
      }
    ],
    bestPractices: [
      "Use short, object-focused prompts for Generative Fill.",
      "Select slightly beyond object edges for cleaner blending.",
      "Generate a few variants and inspect at 100% zoom."
    ],
    exampleUse: "Photo cleanup for social, ads, and website assets.",
    negativePrompt: "warped geometry, repeated artifacts, blurry patch edges",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-062"
  },
  {
    slug: "clean-power-lines-from-sky-adobe",
    title: "Clean Power Lines from Sky (Adobe Generative Fill)",
    platform: "AdobeGenAI",
    tool: "GenerativeFill",
    complexity: "Simple",
    category: "Photo Edit",
    tags: [
      "adobe-genai",
      "generativefill",
      "photo-edit",
      "creative",
      "clean",
      "power",
      "lines",
      "from"
    ],
    summary: "Short, literal Generative Fill prompt for clean power lines from sky.",
    prompt: "Clean Power Lines from Sky: remove or replace {target_object} in {target_area}; rebuild realistic {surface_texture} with matching perspective and lighting.",
    variables: [
      {
        key: "target_object",
        label: "Target object",
        placeholder: "person, logo, cable, sign",
        required: true
      },
      {
        key: "target_area",
        label: "Target area",
        placeholder: "left background",
        required: true
      },
      {
        key: "surface_texture",
        label: "Surface texture",
        placeholder: "brick wall, fabric, sky gradient",
        required: true
      }
    ],
    bestPractices: [
      "Use short, object-focused prompts for Generative Fill.",
      "Select slightly beyond object edges for cleaner blending.",
      "Generate a few variants and inspect at 100% zoom."
    ],
    exampleUse: "Photo cleanup for social, ads, and website assets.",
    negativePrompt: "warped geometry, repeated artifacts, blurry patch edges",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-063"
  },
  {
    slug: "remove-window-reflection-adobe",
    title: "Remove Window Reflection (Adobe Generative Fill)",
    platform: "AdobeGenAI",
    tool: "GenerativeFill",
    complexity: "Simple",
    category: "Photo Edit",
    tags: [
      "adobe-genai",
      "generativefill",
      "photo-edit",
      "creative",
      "remove",
      "window",
      "reflection"
    ],
    summary: "Short, literal Generative Fill prompt for remove window reflection.",
    prompt: "Remove Window Reflection: remove or replace {target_object} in {target_area}; rebuild realistic {surface_texture} with matching perspective and lighting.",
    variables: [
      {
        key: "target_object",
        label: "Target object",
        placeholder: "person, logo, cable, sign",
        required: true
      },
      {
        key: "target_area",
        label: "Target area",
        placeholder: "left background",
        required: true
      },
      {
        key: "surface_texture",
        label: "Surface texture",
        placeholder: "brick wall, fabric, sky gradient",
        required: true
      }
    ],
    bestPractices: [
      "Use short, object-focused prompts for Generative Fill.",
      "Select slightly beyond object edges for cleaner blending.",
      "Generate a few variants and inspect at 100% zoom."
    ],
    exampleUse: "Photo cleanup for social, ads, and website assets.",
    negativePrompt: "warped geometry, repeated artifacts, blurry patch edges",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-064"
  },
  {
    slug: "dust-and-scratch-cleanup-adobe",
    title: "Dust and Scratch Cleanup (Adobe Generative Fill)",
    platform: "AdobeGenAI",
    tool: "GenerativeFill",
    complexity: "Simple",
    category: "Photo Edit",
    tags: [
      "adobe-genai",
      "generativefill",
      "photo-edit",
      "creative",
      "dust",
      "scratch",
      "cleanup"
    ],
    summary: "Short, literal Generative Fill prompt for dust and scratch cleanup.",
    prompt: "Dust and Scratch Cleanup: remove or replace {target_object} in {target_area}; rebuild realistic {surface_texture} with matching perspective and lighting.",
    variables: [
      {
        key: "target_object",
        label: "Target object",
        placeholder: "person, logo, cable, sign",
        required: true
      },
      {
        key: "target_area",
        label: "Target area",
        placeholder: "left background",
        required: true
      },
      {
        key: "surface_texture",
        label: "Surface texture",
        placeholder: "brick wall, fabric, sky gradient",
        required: true
      }
    ],
    bestPractices: [
      "Use short, object-focused prompts for Generative Fill.",
      "Select slightly beyond object edges for cleaner blending.",
      "Generate a few variants and inspect at 100% zoom."
    ],
    exampleUse: "Photo cleanup for social, ads, and website assets.",
    negativePrompt: "warped geometry, repeated artifacts, blurry patch edges",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-065"
  },
  {
    slug: "remove-watermark-overlay-adobe",
    title: "Remove Watermark Overlay (Adobe Generative Fill)",
    platform: "AdobeGenAI",
    tool: "GenerativeFill",
    complexity: "Simple",
    category: "Photo Edit",
    tags: [
      "adobe-genai",
      "generativefill",
      "photo-edit",
      "creative",
      "remove",
      "watermark",
      "overlay"
    ],
    summary: "Short, literal Generative Fill prompt for remove watermark overlay.",
    prompt: "Remove Watermark Overlay: remove or replace {target_object} in {target_area}; rebuild realistic {surface_texture} with matching perspective and lighting.",
    variables: [
      {
        key: "target_object",
        label: "Target object",
        placeholder: "person, logo, cable, sign",
        required: true
      },
      {
        key: "target_area",
        label: "Target area",
        placeholder: "left background",
        required: true
      },
      {
        key: "surface_texture",
        label: "Surface texture",
        placeholder: "brick wall, fabric, sky gradient",
        required: true
      }
    ],
    bestPractices: [
      "Use short, object-focused prompts for Generative Fill.",
      "Select slightly beyond object edges for cleaner blending.",
      "Generate a few variants and inspect at 100% zoom."
    ],
    exampleUse: "Photo cleanup for social, ads, and website assets.",
    negativePrompt: "warped geometry, repeated artifacts, blurry patch edges",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-066"
  },
  {
    slug: "swap-object-in-scene-adobe",
    title: "Swap Object in Scene (Adobe Generative Fill)",
    platform: "AdobeGenAI",
    tool: "GenerativeFill",
    complexity: "Simple",
    category: "Photo Edit",
    tags: [
      "adobe-genai",
      "generativefill",
      "photo-edit",
      "creative",
      "swap",
      "object",
      "scene"
    ],
    summary: "Short, literal Generative Fill prompt for swap object in scene.",
    prompt: "Swap Object in Scene: remove or replace {target_object} in {target_area}; rebuild realistic {surface_texture} with matching perspective and lighting.",
    variables: [
      {
        key: "target_object",
        label: "Target object",
        placeholder: "person, logo, cable, sign",
        required: true
      },
      {
        key: "target_area",
        label: "Target area",
        placeholder: "left background",
        required: true
      },
      {
        key: "surface_texture",
        label: "Surface texture",
        placeholder: "brick wall, fabric, sky gradient",
        required: true
      }
    ],
    bestPractices: [
      "Use short, object-focused prompts for Generative Fill.",
      "Select slightly beyond object edges for cleaner blending.",
      "Generate a few variants and inspect at 100% zoom."
    ],
    exampleUse: "Photo cleanup for social, ads, and website assets.",
    negativePrompt: "warped geometry, repeated artifacts, blurry patch edges",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-067"
  },
  {
    slug: "add-realistic-product-shadow-adobe",
    title: "Add Realistic Product Shadow (Adobe Generative Fill)",
    platform: "AdobeGenAI",
    tool: "GenerativeFill",
    complexity: "Simple",
    category: "Photo Edit",
    tags: [
      "adobe-genai",
      "generativefill",
      "photo-edit",
      "creative",
      "realistic",
      "product",
      "shadow"
    ],
    summary: "Short, literal Generative Fill prompt for add realistic product shadow.",
    prompt: "Add Realistic Product Shadow: remove or replace {target_object} in {target_area}; rebuild realistic {surface_texture} with matching perspective and lighting.",
    variables: [
      {
        key: "target_object",
        label: "Target object",
        placeholder: "person, logo, cable, sign",
        required: true
      },
      {
        key: "target_area",
        label: "Target area",
        placeholder: "left background",
        required: true
      },
      {
        key: "surface_texture",
        label: "Surface texture",
        placeholder: "brick wall, fabric, sky gradient",
        required: true
      }
    ],
    bestPractices: [
      "Use short, object-focused prompts for Generative Fill.",
      "Select slightly beyond object edges for cleaner blending.",
      "Generate a few variants and inspect at 100% zoom."
    ],
    exampleUse: "Photo cleanup for social, ads, and website assets.",
    negativePrompt: "warped geometry, repeated artifacts, blurry patch edges",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-068"
  },
  {
    slug: "remove-cable-clutter-adobe",
    title: "Remove Cable Clutter (Adobe Generative Fill)",
    platform: "AdobeGenAI",
    tool: "GenerativeFill",
    complexity: "Simple",
    category: "Photo Edit",
    tags: [
      "adobe-genai",
      "generativefill",
      "photo-edit",
      "creative",
      "remove",
      "cable",
      "clutter"
    ],
    summary: "Short, literal Generative Fill prompt for remove cable clutter.",
    prompt: "Remove Cable Clutter: remove or replace {target_object} in {target_area}; rebuild realistic {surface_texture} with matching perspective and lighting.",
    variables: [
      {
        key: "target_object",
        label: "Target object",
        placeholder: "person, logo, cable, sign",
        required: true
      },
      {
        key: "target_area",
        label: "Target area",
        placeholder: "left background",
        required: true
      },
      {
        key: "surface_texture",
        label: "Surface texture",
        placeholder: "brick wall, fabric, sky gradient",
        required: true
      }
    ],
    bestPractices: [
      "Use short, object-focused prompts for Generative Fill.",
      "Select slightly beyond object edges for cleaner blending.",
      "Generate a few variants and inspect at 100% zoom."
    ],
    exampleUse: "Photo cleanup for social, ads, and website assets.",
    negativePrompt: "warped geometry, repeated artifacts, blurry patch edges",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-069"
  },
  {
    slug: "remove-sky-distractions-adobe",
    title: "Remove Sky Distractions (Adobe Generative Fill)",
    platform: "AdobeGenAI",
    tool: "GenerativeFill",
    complexity: "Simple",
    category: "Photo Edit",
    tags: [
      "adobe-genai",
      "generativefill",
      "photo-edit",
      "creative",
      "remove",
      "distractions"
    ],
    summary: "Short, literal Generative Fill prompt for remove sky distractions.",
    prompt: "Remove Sky Distractions: remove or replace {target_object} in {target_area}; rebuild realistic {surface_texture} with matching perspective and lighting.",
    variables: [
      {
        key: "target_object",
        label: "Target object",
        placeholder: "person, logo, cable, sign",
        required: true
      },
      {
        key: "target_area",
        label: "Target area",
        placeholder: "left background",
        required: true
      },
      {
        key: "surface_texture",
        label: "Surface texture",
        placeholder: "brick wall, fabric, sky gradient",
        required: true
      }
    ],
    bestPractices: [
      "Use short, object-focused prompts for Generative Fill.",
      "Select slightly beyond object edges for cleaner blending.",
      "Generate a few variants and inspect at 100% zoom."
    ],
    exampleUse: "Photo cleanup for social, ads, and website assets.",
    negativePrompt: "warped geometry, repeated artifacts, blurry patch edges",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-070"
  },
  {
    slug: "portrait-blemish-cleanup-adobe",
    title: "Portrait Blemish Cleanup (Adobe Generative Fill)",
    platform: "AdobeGenAI",
    tool: "GenerativeFill",
    complexity: "Simple",
    category: "Photo Edit",
    tags: [
      "adobe-genai",
      "generativefill",
      "photo-edit",
      "creative",
      "portrait",
      "blemish",
      "cleanup"
    ],
    summary: "Short, literal Generative Fill prompt for portrait blemish cleanup.",
    prompt: "Portrait Blemish Cleanup: remove or replace {target_object} in {target_area}; rebuild realistic {surface_texture} with matching perspective and lighting.",
    variables: [
      {
        key: "target_object",
        label: "Target object",
        placeholder: "person, logo, cable, sign",
        required: true
      },
      {
        key: "target_area",
        label: "Target area",
        placeholder: "left background",
        required: true
      },
      {
        key: "surface_texture",
        label: "Surface texture",
        placeholder: "brick wall, fabric, sky gradient",
        required: true
      }
    ],
    bestPractices: [
      "Use short, object-focused prompts for Generative Fill.",
      "Select slightly beyond object edges for cleaner blending.",
      "Generate a few variants and inspect at 100% zoom."
    ],
    exampleUse: "Photo cleanup for social, ads, and website assets.",
    negativePrompt: "warped geometry, repeated artifacts, blurry patch edges",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-071"
  },
  {
    slug: "remove-desk-distractions-adobe",
    title: "Remove Desk Distractions (Adobe Generative Fill)",
    platform: "AdobeGenAI",
    tool: "GenerativeFill",
    complexity: "Simple",
    category: "Photo Edit",
    tags: [
      "adobe-genai",
      "generativefill",
      "photo-edit",
      "creative",
      "remove",
      "desk",
      "distractions"
    ],
    summary: "Short, literal Generative Fill prompt for remove desk distractions.",
    prompt: "Remove Desk Distractions: remove or replace {target_object} in {target_area}; rebuild realistic {surface_texture} with matching perspective and lighting.",
    variables: [
      {
        key: "target_object",
        label: "Target object",
        placeholder: "person, logo, cable, sign",
        required: true
      },
      {
        key: "target_area",
        label: "Target area",
        placeholder: "left background",
        required: true
      },
      {
        key: "surface_texture",
        label: "Surface texture",
        placeholder: "brick wall, fabric, sky gradient",
        required: true
      }
    ],
    bestPractices: [
      "Use short, object-focused prompts for Generative Fill.",
      "Select slightly beyond object edges for cleaner blending.",
      "Generate a few variants and inspect at 100% zoom."
    ],
    exampleUse: "Photo cleanup for social, ads, and website assets.",
    negativePrompt: "warped geometry, repeated artifacts, blurry patch edges",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-072"
  },
  {
    slug: "extend-canvas-for-banner-adobe",
    title: "Extend Canvas for Banner (Adobe Generative Expand)",
    platform: "AdobeGenAI",
    tool: "GenerativeExpand",
    complexity: "Simple",
    category: "Marketing",
    tags: [
      "adobe-genai",
      "generativeexpand",
      "marketing",
      "creative",
      "extend",
      "canvas",
      "banner"
    ],
    summary: "Generative Expand prompt for extend canvas for banner with crop-safe framing.",
    prompt: "Extend Canvas for Banner: expand image to {dimensions}; continue {scene_elements} naturally with consistent depth, perspective, and lighting.",
    variables: [
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "1080x1920 or 1920x1080",
        required: true
      },
      {
        key: "scene_elements",
        label: "Scene elements",
        placeholder: "desk, wall texture, ambient light",
        required: true
      }
    ],
    bestPractices: [
      "State final dimensions before expanding.",
      "Protect focal subject before expanding large regions.",
      "Check generated regions for repeated textures."
    ],
    exampleUse: "Repurpose one image into multiple channel formats.",
    negativePrompt: "stretched subject, repeated objects, perspective drift",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-073"
  },
  {
    slug: "vertical-story-expansion-adobe",
    title: "Vertical Story Expansion (Adobe Generative Expand)",
    platform: "AdobeGenAI",
    tool: "GenerativeExpand",
    complexity: "Simple",
    category: "Marketing",
    tags: [
      "adobe-genai",
      "generativeexpand",
      "marketing",
      "creative",
      "vertical",
      "story",
      "expansion"
    ],
    summary: "Generative Expand prompt for vertical story expansion with crop-safe framing.",
    prompt: "Vertical Story Expansion: expand image to {dimensions}; continue {scene_elements} naturally with consistent depth, perspective, and lighting.",
    variables: [
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "1080x1920 or 1920x1080",
        required: true
      },
      {
        key: "scene_elements",
        label: "Scene elements",
        placeholder: "desk, wall texture, ambient light",
        required: true
      }
    ],
    bestPractices: [
      "State final dimensions before expanding.",
      "Protect focal subject before expanding large regions.",
      "Check generated regions for repeated textures."
    ],
    exampleUse: "Repurpose one image into multiple channel formats.",
    negativePrompt: "stretched subject, repeated objects, perspective drift",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-074"
  },
  {
    slug: "hero-bottom-expansion-adobe",
    title: "Hero Bottom Expansion (Adobe Generative Expand)",
    platform: "AdobeGenAI",
    tool: "GenerativeExpand",
    complexity: "Simple",
    category: "Marketing",
    tags: [
      "adobe-genai",
      "generativeexpand",
      "marketing",
      "creative",
      "hero",
      "bottom",
      "expansion"
    ],
    summary: "Generative Expand prompt for hero bottom expansion with crop-safe framing.",
    prompt: "Hero Bottom Expansion: expand image to {dimensions}; continue {scene_elements} naturally with consistent depth, perspective, and lighting.",
    variables: [
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "1080x1920 or 1920x1080",
        required: true
      },
      {
        key: "scene_elements",
        label: "Scene elements",
        placeholder: "desk, wall texture, ambient light",
        required: true
      }
    ],
    bestPractices: [
      "State final dimensions before expanding.",
      "Protect focal subject before expanding large regions.",
      "Check generated regions for repeated textures."
    ],
    exampleUse: "Repurpose one image into multiple channel formats.",
    negativePrompt: "stretched subject, repeated objects, perspective drift",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-075"
  },
  {
    slug: "square-to-4-5-conversion-adobe",
    title: "Square to 4:5 Conversion (Adobe Generative Expand)",
    platform: "AdobeGenAI",
    tool: "GenerativeExpand",
    complexity: "Simple",
    category: "Marketing",
    tags: [
      "adobe-genai",
      "generativeexpand",
      "marketing",
      "creative",
      "square",
      "conversion"
    ],
    summary: "Generative Expand prompt for square to 4:5 conversion with crop-safe framing.",
    prompt: "Square to 4:5 Conversion: expand image to {dimensions}; continue {scene_elements} naturally with consistent depth, perspective, and lighting.",
    variables: [
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "1080x1920 or 1920x1080",
        required: true
      },
      {
        key: "scene_elements",
        label: "Scene elements",
        placeholder: "desk, wall texture, ambient light",
        required: true
      }
    ],
    bestPractices: [
      "State final dimensions before expanding.",
      "Protect focal subject before expanding large regions.",
      "Check generated regions for repeated textures."
    ],
    exampleUse: "Repurpose one image into multiple channel formats.",
    negativePrompt: "stretched subject, repeated objects, perspective drift",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-076"
  },
  {
    slug: "landscape-to-16-9-thumbnail-adobe",
    title: "Landscape to 16:9 Thumbnail (Adobe Generative Expand)",
    platform: "AdobeGenAI",
    tool: "GenerativeExpand",
    complexity: "Simple",
    category: "Marketing",
    tags: [
      "adobe-genai",
      "generativeexpand",
      "marketing",
      "creative",
      "landscape",
      "thumbnail"
    ],
    summary: "Generative Expand prompt for landscape to 16:9 thumbnail with crop-safe framing.",
    prompt: "Landscape to 16:9 Thumbnail: expand image to {dimensions}; continue {scene_elements} naturally with consistent depth, perspective, and lighting.",
    variables: [
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "1080x1920 or 1920x1080",
        required: true
      },
      {
        key: "scene_elements",
        label: "Scene elements",
        placeholder: "desk, wall texture, ambient light",
        required: true
      }
    ],
    bestPractices: [
      "State final dimensions before expanding.",
      "Protect focal subject before expanding large regions.",
      "Check generated regions for repeated textures."
    ],
    exampleUse: "Repurpose one image into multiple channel formats.",
    negativePrompt: "stretched subject, repeated objects, perspective drift",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-077"
  },
  {
    slug: "portrait-to-9-16-reel-adobe",
    title: "Portrait to 9:16 Reel (Adobe Generative Expand)",
    platform: "AdobeGenAI",
    tool: "GenerativeExpand",
    complexity: "Simple",
    category: "Marketing",
    tags: [
      "adobe-genai",
      "generativeexpand",
      "marketing",
      "creative",
      "portrait",
      "reel"
    ],
    summary: "Generative Expand prompt for portrait to 9:16 reel with crop-safe framing.",
    prompt: "Portrait to 9:16 Reel: expand image to {dimensions}; continue {scene_elements} naturally with consistent depth, perspective, and lighting.",
    variables: [
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "1080x1920 or 1920x1080",
        required: true
      },
      {
        key: "scene_elements",
        label: "Scene elements",
        placeholder: "desk, wall texture, ambient light",
        required: true
      }
    ],
    bestPractices: [
      "State final dimensions before expanding.",
      "Protect focal subject before expanding large regions.",
      "Check generated regions for repeated textures."
    ],
    exampleUse: "Repurpose one image into multiple channel formats.",
    negativePrompt: "stretched subject, repeated objects, perspective drift",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-078"
  },
  {
    slug: "add-text-safe-breathing-space-adobe",
    title: "Add Text-Safe Breathing Space (Adobe Generative Expand)",
    platform: "AdobeGenAI",
    tool: "GenerativeExpand",
    complexity: "Simple",
    category: "Marketing",
    tags: [
      "adobe-genai",
      "generativeexpand",
      "marketing",
      "creative",
      "text",
      "safe",
      "breathing",
      "space"
    ],
    summary: "Generative Expand prompt for add text-safe breathing space with crop-safe framing.",
    prompt: "Add Text-Safe Breathing Space: expand image to {dimensions}; continue {scene_elements} naturally with consistent depth, perspective, and lighting.",
    variables: [
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "1080x1920 or 1920x1080",
        required: true
      },
      {
        key: "scene_elements",
        label: "Scene elements",
        placeholder: "desk, wall texture, ambient light",
        required: true
      }
    ],
    bestPractices: [
      "State final dimensions before expanding.",
      "Protect focal subject before expanding large regions.",
      "Check generated regions for repeated textures."
    ],
    exampleUse: "Repurpose one image into multiple channel formats.",
    negativePrompt: "stretched subject, repeated objects, perspective drift",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-079"
  },
  {
    slug: "studio-backdrop-expansion-adobe",
    title: "Studio Backdrop Expansion (Adobe Generative Expand)",
    platform: "AdobeGenAI",
    tool: "GenerativeExpand",
    complexity: "Simple",
    category: "Marketing",
    tags: [
      "adobe-genai",
      "generativeexpand",
      "marketing",
      "creative",
      "studio",
      "backdrop",
      "expansion"
    ],
    summary: "Generative Expand prompt for studio backdrop expansion with crop-safe framing.",
    prompt: "Studio Backdrop Expansion: expand image to {dimensions}; continue {scene_elements} naturally with consistent depth, perspective, and lighting.",
    variables: [
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "1080x1920 or 1920x1080",
        required: true
      },
      {
        key: "scene_elements",
        label: "Scene elements",
        placeholder: "desk, wall texture, ambient light",
        required: true
      }
    ],
    bestPractices: [
      "State final dimensions before expanding.",
      "Protect focal subject before expanding large regions.",
      "Check generated regions for repeated textures."
    ],
    exampleUse: "Repurpose one image into multiple channel formats.",
    negativePrompt: "stretched subject, repeated objects, perspective drift",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-080"
  },
  {
    slug: "minimal-product-shot-adobe",
    title: "Minimal Product Shot (Adobe Text-to-Image)",
    platform: "AdobeGenAI",
    tool: "TextToImage",
    complexity: "Simple",
    category: "Product Mockups",
    tags: [
      "adobe-genai",
      "texttoimage",
      "product-mockups",
      "creative",
      "minimal",
      "product",
      "shot"
    ],
    summary: "Text-to-Image prompt for minimal product shot with style, lighting, lens, and composition controls.",
    prompt: "Create an image concept for Minimal Product Shot. Subject: {{subject}}. Style: {{style_reference}}. Lighting: {{lighting_setup}}. Lens/shot: {{lens_and_shot}}. Composition: {{composition_notes}}. Color palette: {{brand_palette}}. Dimensions/aspect: {{dimensions}}.",
    variables: [
      {
        key: "subject",
        label: "Subject",
        placeholder: "product, scene, or concept",
        required: true
      },
      {
        key: "style_reference",
        label: "Style reference",
        placeholder: "minimal studio, isometric, watercolor",
        required: true
      },
      {
        key: "lighting_setup",
        label: "Lighting setup",
        placeholder: "soft daylight + rim light",
        required: true
      },
      {
        key: "lens_and_shot",
        label: "Lens and shot",
        placeholder: "50mm eye-level close-up",
        required: true
      },
      {
        key: "composition_notes",
        label: "Composition notes",
        placeholder: "clear focal subject with copy-safe area",
        required: true
      },
      {
        key: "brand_palette",
        label: "Brand palette",
        placeholder: "navy, cyan, orange",
        required: true
      },
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "1:1, 4:5, 16:9, 9:16",
        required: true
      }
    ],
    bestPractices: [
      "Keep one clear subject and one clear style direction.",
      "Specify composition and text-safe area explicitly.",
      "Iterate one variable at a time for controlled variants."
    ],
    exampleUse: "Rapid concept generation for social and landing pages.",
    negativePrompt: "extra fingers, warped text, weird logos, noisy artifacts",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-081"
  },
  {
    slug: "lifestyle-flat-lay-scene-adobe",
    title: "Lifestyle Flat-Lay Scene (Adobe Text-to-Image)",
    platform: "AdobeGenAI",
    tool: "TextToImage",
    complexity: "Simple",
    category: "Product Mockups",
    tags: [
      "adobe-genai",
      "texttoimage",
      "product-mockups",
      "creative",
      "lifestyle",
      "flat",
      "scene"
    ],
    summary: "Text-to-Image prompt for lifestyle flat-lay scene with style, lighting, lens, and composition controls.",
    prompt: "Create an image concept for Lifestyle Flat-Lay Scene. Subject: {{subject}}. Style: {{style_reference}}. Lighting: {{lighting_setup}}. Lens/shot: {{lens_and_shot}}. Composition: {{composition_notes}}. Color palette: {{brand_palette}}. Dimensions/aspect: {{dimensions}}.",
    variables: [
      {
        key: "subject",
        label: "Subject",
        placeholder: "product, scene, or concept",
        required: true
      },
      {
        key: "style_reference",
        label: "Style reference",
        placeholder: "minimal studio, isometric, watercolor",
        required: true
      },
      {
        key: "lighting_setup",
        label: "Lighting setup",
        placeholder: "soft daylight + rim light",
        required: true
      },
      {
        key: "lens_and_shot",
        label: "Lens and shot",
        placeholder: "50mm eye-level close-up",
        required: true
      },
      {
        key: "composition_notes",
        label: "Composition notes",
        placeholder: "clear focal subject with copy-safe area",
        required: true
      },
      {
        key: "brand_palette",
        label: "Brand palette",
        placeholder: "navy, cyan, orange",
        required: true
      },
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "1:1, 4:5, 16:9, 9:16",
        required: true
      }
    ],
    bestPractices: [
      "Keep one clear subject and one clear style direction.",
      "Specify composition and text-safe area explicitly.",
      "Iterate one variable at a time for controlled variants."
    ],
    exampleUse: "Rapid concept generation for social and landing pages.",
    negativePrompt: "extra fingers, warped text, weird logos, noisy artifacts",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-082"
  },
  {
    slug: "app-launch-hero-illustration-adobe",
    title: "App Launch Hero Illustration (Adobe Text-to-Image)",
    platform: "AdobeGenAI",
    tool: "TextToImage",
    complexity: "Simple",
    category: "Product Mockups",
    tags: [
      "adobe-genai",
      "texttoimage",
      "product-mockups",
      "creative",
      "launch",
      "hero",
      "illustration"
    ],
    summary: "Text-to-Image prompt for app launch hero illustration with style, lighting, lens, and composition controls.",
    prompt: "Create an image concept for App Launch Hero Illustration. Subject: {{subject}}. Style: {{style_reference}}. Lighting: {{lighting_setup}}. Lens/shot: {{lens_and_shot}}. Composition: {{composition_notes}}. Color palette: {{brand_palette}}. Dimensions/aspect: {{dimensions}}.",
    variables: [
      {
        key: "subject",
        label: "Subject",
        placeholder: "product, scene, or concept",
        required: true
      },
      {
        key: "style_reference",
        label: "Style reference",
        placeholder: "minimal studio, isometric, watercolor",
        required: true
      },
      {
        key: "lighting_setup",
        label: "Lighting setup",
        placeholder: "soft daylight + rim light",
        required: true
      },
      {
        key: "lens_and_shot",
        label: "Lens and shot",
        placeholder: "50mm eye-level close-up",
        required: true
      },
      {
        key: "composition_notes",
        label: "Composition notes",
        placeholder: "clear focal subject with copy-safe area",
        required: true
      },
      {
        key: "brand_palette",
        label: "Brand palette",
        placeholder: "navy, cyan, orange",
        required: true
      },
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "1:1, 4:5, 16:9, 9:16",
        required: true
      }
    ],
    bestPractices: [
      "Keep one clear subject and one clear style direction.",
      "Specify composition and text-safe area explicitly.",
      "Iterate one variable at a time for controlled variants."
    ],
    exampleUse: "Rapid concept generation for social and landing pages.",
    negativePrompt: "extra fingers, warped text, weird logos, noisy artifacts",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-083"
  },
  {
    slug: "monochrome-icon-concept-adobe",
    title: "Monochrome Icon Concept (Adobe Text-to-Image)",
    platform: "AdobeGenAI",
    tool: "TextToImage",
    complexity: "Simple",
    category: "Branding",
    tags: [
      "adobe-genai",
      "texttoimage",
      "branding",
      "creative",
      "monochrome",
      "icon",
      "concept"
    ],
    summary: "Text-to-Image prompt for monochrome icon concept with style, lighting, lens, and composition controls.",
    prompt: "Create an image concept for Monochrome Icon Concept. Subject: {{subject}}. Style: {{style_reference}}. Lighting: {{lighting_setup}}. Lens/shot: {{lens_and_shot}}. Composition: {{composition_notes}}. Color palette: {{brand_palette}}. Dimensions/aspect: {{dimensions}}.",
    variables: [
      {
        key: "subject",
        label: "Subject",
        placeholder: "product, scene, or concept",
        required: true
      },
      {
        key: "style_reference",
        label: "Style reference",
        placeholder: "minimal studio, isometric, watercolor",
        required: true
      },
      {
        key: "lighting_setup",
        label: "Lighting setup",
        placeholder: "soft daylight + rim light",
        required: true
      },
      {
        key: "lens_and_shot",
        label: "Lens and shot",
        placeholder: "50mm eye-level close-up",
        required: true
      },
      {
        key: "composition_notes",
        label: "Composition notes",
        placeholder: "clear focal subject with copy-safe area",
        required: true
      },
      {
        key: "brand_palette",
        label: "Brand palette",
        placeholder: "navy, cyan, orange",
        required: true
      },
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "1:1, 4:5, 16:9, 9:16",
        required: true
      }
    ],
    bestPractices: [
      "Keep one clear subject and one clear style direction.",
      "Specify composition and text-safe area explicitly.",
      "Iterate one variable at a time for controlled variants."
    ],
    exampleUse: "Rapid concept generation for social and landing pages.",
    negativePrompt: "extra fingers, warped text, weird logos, noisy artifacts",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-084"
  },
  {
    slug: "watercolor-wallpaper-adobe",
    title: "Watercolor Wallpaper (Adobe Text-to-Image)",
    platform: "AdobeGenAI",
    tool: "TextToImage",
    complexity: "Simple",
    category: "Branding",
    tags: [
      "adobe-genai",
      "texttoimage",
      "branding",
      "creative",
      "watercolor",
      "wallpaper"
    ],
    summary: "Text-to-Image prompt for watercolor wallpaper with style, lighting, lens, and composition controls.",
    prompt: "Create an image concept for Watercolor Wallpaper. Subject: {{subject}}. Style: {{style_reference}}. Lighting: {{lighting_setup}}. Lens/shot: {{lens_and_shot}}. Composition: {{composition_notes}}. Color palette: {{brand_palette}}. Dimensions/aspect: {{dimensions}}.",
    variables: [
      {
        key: "subject",
        label: "Subject",
        placeholder: "product, scene, or concept",
        required: true
      },
      {
        key: "style_reference",
        label: "Style reference",
        placeholder: "minimal studio, isometric, watercolor",
        required: true
      },
      {
        key: "lighting_setup",
        label: "Lighting setup",
        placeholder: "soft daylight + rim light",
        required: true
      },
      {
        key: "lens_and_shot",
        label: "Lens and shot",
        placeholder: "50mm eye-level close-up",
        required: true
      },
      {
        key: "composition_notes",
        label: "Composition notes",
        placeholder: "clear focal subject with copy-safe area",
        required: true
      },
      {
        key: "brand_palette",
        label: "Brand palette",
        placeholder: "navy, cyan, orange",
        required: true
      },
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "1:1, 4:5, 16:9, 9:16",
        required: true
      }
    ],
    bestPractices: [
      "Keep one clear subject and one clear style direction.",
      "Specify composition and text-safe area explicitly.",
      "Iterate one variable at a time for controlled variants."
    ],
    exampleUse: "Rapid concept generation for social and landing pages.",
    negativePrompt: "extra fingers, warped text, weird logos, noisy artifacts",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-085"
  },
  {
    slug: "paper-cut-poster-adobe",
    title: "Paper-Cut Poster (Adobe Text-to-Image)",
    platform: "AdobeGenAI",
    tool: "TextToImage",
    complexity: "Simple",
    category: "Branding",
    tags: [
      "adobe-genai",
      "texttoimage",
      "branding",
      "creative",
      "paper",
      "poster"
    ],
    summary: "Text-to-Image prompt for paper-cut poster with style, lighting, lens, and composition controls.",
    prompt: "Create an image concept for Paper-Cut Poster. Subject: {{subject}}. Style: {{style_reference}}. Lighting: {{lighting_setup}}. Lens/shot: {{lens_and_shot}}. Composition: {{composition_notes}}. Color palette: {{brand_palette}}. Dimensions/aspect: {{dimensions}}.",
    variables: [
      {
        key: "subject",
        label: "Subject",
        placeholder: "product, scene, or concept",
        required: true
      },
      {
        key: "style_reference",
        label: "Style reference",
        placeholder: "minimal studio, isometric, watercolor",
        required: true
      },
      {
        key: "lighting_setup",
        label: "Lighting setup",
        placeholder: "soft daylight + rim light",
        required: true
      },
      {
        key: "lens_and_shot",
        label: "Lens and shot",
        placeholder: "50mm eye-level close-up",
        required: true
      },
      {
        key: "composition_notes",
        label: "Composition notes",
        placeholder: "clear focal subject with copy-safe area",
        required: true
      },
      {
        key: "brand_palette",
        label: "Brand palette",
        placeholder: "navy, cyan, orange",
        required: true
      },
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "1:1, 4:5, 16:9, 9:16",
        required: true
      }
    ],
    bestPractices: [
      "Keep one clear subject and one clear style direction.",
      "Specify composition and text-safe area explicitly.",
      "Iterate one variable at a time for controlled variants."
    ],
    exampleUse: "Rapid concept generation for social and landing pages.",
    negativePrompt: "extra fingers, warped text, weird logos, noisy artifacts",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-086"
  },
  {
    slug: "isometric-workspace-illustration-adobe",
    title: "Isometric Workspace Illustration (Adobe Text-to-Image)",
    platform: "AdobeGenAI",
    tool: "TextToImage",
    complexity: "Simple",
    category: "Product Mockups",
    tags: [
      "adobe-genai",
      "texttoimage",
      "product-mockups",
      "creative",
      "isometric",
      "workspace",
      "illustration"
    ],
    summary: "Text-to-Image prompt for isometric workspace illustration with style, lighting, lens, and composition controls.",
    prompt: "Create an image concept for Isometric Workspace Illustration. Subject: {{subject}}. Style: {{style_reference}}. Lighting: {{lighting_setup}}. Lens/shot: {{lens_and_shot}}. Composition: {{composition_notes}}. Color palette: {{brand_palette}}. Dimensions/aspect: {{dimensions}}.",
    variables: [
      {
        key: "subject",
        label: "Subject",
        placeholder: "product, scene, or concept",
        required: true
      },
      {
        key: "style_reference",
        label: "Style reference",
        placeholder: "minimal studio, isometric, watercolor",
        required: true
      },
      {
        key: "lighting_setup",
        label: "Lighting setup",
        placeholder: "soft daylight + rim light",
        required: true
      },
      {
        key: "lens_and_shot",
        label: "Lens and shot",
        placeholder: "50mm eye-level close-up",
        required: true
      },
      {
        key: "composition_notes",
        label: "Composition notes",
        placeholder: "clear focal subject with copy-safe area",
        required: true
      },
      {
        key: "brand_palette",
        label: "Brand palette",
        placeholder: "navy, cyan, orange",
        required: true
      },
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "1:1, 4:5, 16:9, 9:16",
        required: true
      }
    ],
    bestPractices: [
      "Keep one clear subject and one clear style direction.",
      "Specify composition and text-safe area explicitly.",
      "Iterate one variable at a time for controlled variants."
    ],
    exampleUse: "Rapid concept generation for social and landing pages.",
    negativePrompt: "extra fingers, warped text, weird logos, noisy artifacts",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-087"
  },
  {
    slug: "youtube-thumbnail-concept-adobe",
    title: "YouTube Thumbnail Concept (Adobe Text-to-Image)",
    platform: "AdobeGenAI",
    tool: "TextToImage",
    complexity: "Simple",
    category: "Content",
    tags: [
      "adobe-genai",
      "texttoimage",
      "content",
      "creative",
      "youtube",
      "thumbnail",
      "concept"
    ],
    summary: "Text-to-Image prompt for youtube thumbnail concept with style, lighting, lens, and composition controls.",
    prompt: "Create an image concept for YouTube Thumbnail Concept. Subject: {{subject}}. Style: {{style_reference}}. Lighting: {{lighting_setup}}. Lens/shot: {{lens_and_shot}}. Composition: {{composition_notes}}. Color palette: {{brand_palette}}. Dimensions/aspect: {{dimensions}}.",
    variables: [
      {
        key: "subject",
        label: "Subject",
        placeholder: "product, scene, or concept",
        required: true
      },
      {
        key: "style_reference",
        label: "Style reference",
        placeholder: "minimal studio, isometric, watercolor",
        required: true
      },
      {
        key: "lighting_setup",
        label: "Lighting setup",
        placeholder: "soft daylight + rim light",
        required: true
      },
      {
        key: "lens_and_shot",
        label: "Lens and shot",
        placeholder: "50mm eye-level close-up",
        required: true
      },
      {
        key: "composition_notes",
        label: "Composition notes",
        placeholder: "clear focal subject with copy-safe area",
        required: true
      },
      {
        key: "brand_palette",
        label: "Brand palette",
        placeholder: "navy, cyan, orange",
        required: true
      },
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "1:1, 4:5, 16:9, 9:16",
        required: true
      }
    ],
    bestPractices: [
      "Keep one clear subject and one clear style direction.",
      "Specify composition and text-safe area explicitly.",
      "Iterate one variable at a time for controlled variants."
    ],
    exampleUse: "Rapid concept generation for social and landing pages.",
    negativePrompt: "extra fingers, warped text, weird logos, noisy artifacts",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-088"
  },
  {
    slug: "3d-clay-icon-concept-adobe",
    title: "3D Clay Icon Concept (Adobe Text-to-Image)",
    platform: "AdobeGenAI",
    tool: "TextToImage",
    complexity: "Simple",
    category: "Branding",
    tags: [
      "adobe-genai",
      "texttoimage",
      "branding",
      "creative",
      "clay",
      "icon",
      "concept"
    ],
    summary: "Text-to-Image prompt for 3d clay icon concept with style, lighting, lens, and composition controls.",
    prompt: "Create an image concept for 3D Clay Icon Concept. Subject: {{subject}}. Style: {{style_reference}}. Lighting: {{lighting_setup}}. Lens/shot: {{lens_and_shot}}. Composition: {{composition_notes}}. Color palette: {{brand_palette}}. Dimensions/aspect: {{dimensions}}.",
    variables: [
      {
        key: "subject",
        label: "Subject",
        placeholder: "product, scene, or concept",
        required: true
      },
      {
        key: "style_reference",
        label: "Style reference",
        placeholder: "minimal studio, isometric, watercolor",
        required: true
      },
      {
        key: "lighting_setup",
        label: "Lighting setup",
        placeholder: "soft daylight + rim light",
        required: true
      },
      {
        key: "lens_and_shot",
        label: "Lens and shot",
        placeholder: "50mm eye-level close-up",
        required: true
      },
      {
        key: "composition_notes",
        label: "Composition notes",
        placeholder: "clear focal subject with copy-safe area",
        required: true
      },
      {
        key: "brand_palette",
        label: "Brand palette",
        placeholder: "navy, cyan, orange",
        required: true
      },
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "1:1, 4:5, 16:9, 9:16",
        required: true
      }
    ],
    bestPractices: [
      "Keep one clear subject and one clear style direction.",
      "Specify composition and text-safe area explicitly.",
      "Iterate one variable at a time for controlled variants."
    ],
    exampleUse: "Rapid concept generation for social and landing pages.",
    negativePrompt: "extra fingers, warped text, weird logos, noisy artifacts",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-089"
  },
  {
    slug: "banner-ad-visual-concept-adobe",
    title: "Banner Ad Visual Concept (Adobe Text-to-Image)",
    platform: "AdobeGenAI",
    tool: "TextToImage",
    complexity: "Simple",
    category: "Product Mockups",
    tags: [
      "adobe-genai",
      "texttoimage",
      "product-mockups",
      "creative",
      "banner",
      "visual",
      "concept"
    ],
    summary: "Text-to-Image prompt for banner ad visual concept with style, lighting, lens, and composition controls.",
    prompt: "Create an image concept for Banner Ad Visual Concept. Subject: {{subject}}. Style: {{style_reference}}. Lighting: {{lighting_setup}}. Lens/shot: {{lens_and_shot}}. Composition: {{composition_notes}}. Color palette: {{brand_palette}}. Dimensions/aspect: {{dimensions}}.",
    variables: [
      {
        key: "subject",
        label: "Subject",
        placeholder: "product, scene, or concept",
        required: true
      },
      {
        key: "style_reference",
        label: "Style reference",
        placeholder: "minimal studio, isometric, watercolor",
        required: true
      },
      {
        key: "lighting_setup",
        label: "Lighting setup",
        placeholder: "soft daylight + rim light",
        required: true
      },
      {
        key: "lens_and_shot",
        label: "Lens and shot",
        placeholder: "50mm eye-level close-up",
        required: true
      },
      {
        key: "composition_notes",
        label: "Composition notes",
        placeholder: "clear focal subject with copy-safe area",
        required: true
      },
      {
        key: "brand_palette",
        label: "Brand palette",
        placeholder: "navy, cyan, orange",
        required: true
      },
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "1:1, 4:5, 16:9, 9:16",
        required: true
      }
    ],
    bestPractices: [
      "Keep one clear subject and one clear style direction.",
      "Specify composition and text-safe area explicitly.",
      "Iterate one variable at a time for controlled variants."
    ],
    exampleUse: "Rapid concept generation for social and landing pages.",
    negativePrompt: "extra fingers, warped text, weird logos, noisy artifacts",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-090"
  },
  {
    slug: "cinematic-product-hero-scene-adobe",
    title: "Cinematic Product Hero Scene (Adobe Text-to-Image)",
    platform: "AdobeGenAI",
    tool: "TextToImage",
    complexity: "Advanced",
    category: "Marketing",
    tags: [
      "adobe-genai",
      "texttoimage",
      "marketing",
      "creative",
      "cinematic",
      "product",
      "hero",
      "scene"
    ],
    summary: "Advanced Firefly prompt for cinematic product hero scene with brand controls and variant planning.",
    prompt: "Create production-grade visuals for Cinematic Product Hero Scene. Subject: {{subject}}. Style: {{style_reference}}. Lighting: {{lighting_setup}}. Lens/shot: {{lens_and_shot}}. Composition: {{composition_notes}} with copy-safe area. Brand palette: {{brand_palette}}. Typography mood: {{typography_guidance}}. Output variants for {{dimensions}} while keeping style consistency.",
    variables: [
      {
        key: "subject",
        label: "Subject",
        placeholder: "enterprise product, team scene, or campaign concept",
        required: true
      },
      {
        key: "style_reference",
        label: "Style reference",
        placeholder: "cinematic commercial editorial",
        required: true
      },
      {
        key: "lighting_setup",
        label: "Lighting setup",
        placeholder: "high-contrast key + fill + rim",
        required: true
      },
      {
        key: "lens_and_shot",
        label: "Lens and shot",
        placeholder: "35mm low-angle hero shot",
        required: true
      },
      {
        key: "composition_notes",
        label: "Composition notes",
        placeholder: "rule-of-thirds focal subject with text-safe area",
        required: true
      },
      {
        key: "brand_palette",
        label: "Brand palette",
        placeholder: "#0F172A #06B6D4 #F97316 #E2E8F0",
        required: true
      },
      {
        key: "typography_guidance",
        label: "Typography guidance",
        placeholder: "modern sans-serif, high contrast",
        required: true
      },
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "16:9 + 4:5 + 9:16",
        required: true
      }
    ],
    bestPractices: [
      "Lock style and palette to keep campaign consistency.",
      "Generate variants by changing one variable per run.",
      "Validate outputs for artifacts before publishing."
    ],
    exampleUse: "High-intent campaign hero and ad creative generation.",
    negativePrompt: "extra fingers, warped text, malformed logos, style drift",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-091"
  },
  {
    slug: "brand-compliant-visual-set-adobe",
    title: "Brand-Compliant Visual Set (Adobe Text-to-Image)",
    platform: "AdobeGenAI",
    tool: "TextToImage",
    complexity: "Advanced",
    category: "Marketing",
    tags: [
      "adobe-genai",
      "texttoimage",
      "marketing",
      "creative",
      "brand",
      "compliant",
      "visual"
    ],
    summary: "Advanced Firefly prompt for brand-compliant visual set with brand controls and variant planning.",
    prompt: "Create production-grade visuals for Brand-Compliant Visual Set. Subject: {{subject}}. Style: {{style_reference}}. Lighting: {{lighting_setup}}. Lens/shot: {{lens_and_shot}}. Composition: {{composition_notes}} with copy-safe area. Brand palette: {{brand_palette}}. Typography mood: {{typography_guidance}}. Output variants for {{dimensions}} while keeping style consistency.",
    variables: [
      {
        key: "subject",
        label: "Subject",
        placeholder: "enterprise product, team scene, or campaign concept",
        required: true
      },
      {
        key: "style_reference",
        label: "Style reference",
        placeholder: "cinematic commercial editorial",
        required: true
      },
      {
        key: "lighting_setup",
        label: "Lighting setup",
        placeholder: "high-contrast key + fill + rim",
        required: true
      },
      {
        key: "lens_and_shot",
        label: "Lens and shot",
        placeholder: "35mm low-angle hero shot",
        required: true
      },
      {
        key: "composition_notes",
        label: "Composition notes",
        placeholder: "rule-of-thirds focal subject with text-safe area",
        required: true
      },
      {
        key: "brand_palette",
        label: "Brand palette",
        placeholder: "#0F172A #06B6D4 #F97316 #E2E8F0",
        required: true
      },
      {
        key: "typography_guidance",
        label: "Typography guidance",
        placeholder: "modern sans-serif, high contrast",
        required: true
      },
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "16:9 + 4:5 + 9:16",
        required: true
      }
    ],
    bestPractices: [
      "Lock style and palette to keep campaign consistency.",
      "Generate variants by changing one variable per run.",
      "Validate outputs for artifacts before publishing."
    ],
    exampleUse: "High-intent campaign hero and ad creative generation.",
    negativePrompt: "extra fingers, warped text, malformed logos, style drift",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-092"
  },
  {
    slug: "ecommerce-variant-shot-pack-adobe",
    title: "Ecommerce Variant Shot Pack (Adobe Text-to-Image)",
    platform: "AdobeGenAI",
    tool: "TextToImage",
    complexity: "Advanced",
    category: "Marketing",
    tags: [
      "adobe-genai",
      "texttoimage",
      "marketing",
      "creative",
      "ecommerce",
      "variant",
      "shot",
      "pack"
    ],
    summary: "Advanced Firefly prompt for ecommerce variant shot pack with brand controls and variant planning.",
    prompt: "Create production-grade visuals for Ecommerce Variant Shot Pack. Subject: {{subject}}. Style: {{style_reference}}. Lighting: {{lighting_setup}}. Lens/shot: {{lens_and_shot}}. Composition: {{composition_notes}} with copy-safe area. Brand palette: {{brand_palette}}. Typography mood: {{typography_guidance}}. Output variants for {{dimensions}} while keeping style consistency.",
    variables: [
      {
        key: "subject",
        label: "Subject",
        placeholder: "enterprise product, team scene, or campaign concept",
        required: true
      },
      {
        key: "style_reference",
        label: "Style reference",
        placeholder: "cinematic commercial editorial",
        required: true
      },
      {
        key: "lighting_setup",
        label: "Lighting setup",
        placeholder: "high-contrast key + fill + rim",
        required: true
      },
      {
        key: "lens_and_shot",
        label: "Lens and shot",
        placeholder: "35mm low-angle hero shot",
        required: true
      },
      {
        key: "composition_notes",
        label: "Composition notes",
        placeholder: "rule-of-thirds focal subject with text-safe area",
        required: true
      },
      {
        key: "brand_palette",
        label: "Brand palette",
        placeholder: "#0F172A #06B6D4 #F97316 #E2E8F0",
        required: true
      },
      {
        key: "typography_guidance",
        label: "Typography guidance",
        placeholder: "modern sans-serif, high contrast",
        required: true
      },
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "16:9 + 4:5 + 9:16",
        required: true
      }
    ],
    bestPractices: [
      "Lock style and palette to keep campaign consistency.",
      "Generate variants by changing one variable per run.",
      "Validate outputs for artifacts before publishing."
    ],
    exampleUse: "High-intent campaign hero and ad creative generation.",
    negativePrompt: "extra fingers, warped text, malformed logos, style drift",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-093"
  },
  {
    slug: "seasonal-campaign-hero-adobe",
    title: "Seasonal Campaign Hero (Adobe Text-to-Image)",
    platform: "AdobeGenAI",
    tool: "TextToImage",
    complexity: "Advanced",
    category: "Marketing",
    tags: [
      "adobe-genai",
      "texttoimage",
      "marketing",
      "creative",
      "seasonal",
      "campaign",
      "hero"
    ],
    summary: "Advanced Firefly prompt for seasonal campaign hero with brand controls and variant planning.",
    prompt: "Create production-grade visuals for Seasonal Campaign Hero. Subject: {{subject}}. Style: {{style_reference}}. Lighting: {{lighting_setup}}. Lens/shot: {{lens_and_shot}}. Composition: {{composition_notes}} with copy-safe area. Brand palette: {{brand_palette}}. Typography mood: {{typography_guidance}}. Output variants for {{dimensions}} while keeping style consistency.",
    variables: [
      {
        key: "subject",
        label: "Subject",
        placeholder: "enterprise product, team scene, or campaign concept",
        required: true
      },
      {
        key: "style_reference",
        label: "Style reference",
        placeholder: "cinematic commercial editorial",
        required: true
      },
      {
        key: "lighting_setup",
        label: "Lighting setup",
        placeholder: "high-contrast key + fill + rim",
        required: true
      },
      {
        key: "lens_and_shot",
        label: "Lens and shot",
        placeholder: "35mm low-angle hero shot",
        required: true
      },
      {
        key: "composition_notes",
        label: "Composition notes",
        placeholder: "rule-of-thirds focal subject with text-safe area",
        required: true
      },
      {
        key: "brand_palette",
        label: "Brand palette",
        placeholder: "#0F172A #06B6D4 #F97316 #E2E8F0",
        required: true
      },
      {
        key: "typography_guidance",
        label: "Typography guidance",
        placeholder: "modern sans-serif, high contrast",
        required: true
      },
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "16:9 + 4:5 + 9:16",
        required: true
      }
    ],
    bestPractices: [
      "Lock style and palette to keep campaign consistency.",
      "Generate variants by changing one variable per run.",
      "Validate outputs for artifacts before publishing."
    ],
    exampleUse: "High-intent campaign hero and ad creative generation.",
    negativePrompt: "extra fingers, warped text, malformed logos, style drift",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-094"
  },
  {
    slug: "saas-dashboard-hero-visual-adobe",
    title: "SaaS Dashboard Hero Visual (Adobe Text-to-Image)",
    platform: "AdobeGenAI",
    tool: "TextToImage",
    complexity: "Advanced",
    category: "Marketing",
    tags: [
      "adobe-genai",
      "texttoimage",
      "marketing",
      "creative",
      "saas",
      "dashboard",
      "hero",
      "visual"
    ],
    summary: "Advanced Firefly prompt for saas dashboard hero visual with brand controls and variant planning.",
    prompt: "Create production-grade visuals for SaaS Dashboard Hero Visual. Subject: {{subject}}. Style: {{style_reference}}. Lighting: {{lighting_setup}}. Lens/shot: {{lens_and_shot}}. Composition: {{composition_notes}} with copy-safe area. Brand palette: {{brand_palette}}. Typography mood: {{typography_guidance}}. Output variants for {{dimensions}} while keeping style consistency.",
    variables: [
      {
        key: "subject",
        label: "Subject",
        placeholder: "enterprise product, team scene, or campaign concept",
        required: true
      },
      {
        key: "style_reference",
        label: "Style reference",
        placeholder: "cinematic commercial editorial",
        required: true
      },
      {
        key: "lighting_setup",
        label: "Lighting setup",
        placeholder: "high-contrast key + fill + rim",
        required: true
      },
      {
        key: "lens_and_shot",
        label: "Lens and shot",
        placeholder: "35mm low-angle hero shot",
        required: true
      },
      {
        key: "composition_notes",
        label: "Composition notes",
        placeholder: "rule-of-thirds focal subject with text-safe area",
        required: true
      },
      {
        key: "brand_palette",
        label: "Brand palette",
        placeholder: "#0F172A #06B6D4 #F97316 #E2E8F0",
        required: true
      },
      {
        key: "typography_guidance",
        label: "Typography guidance",
        placeholder: "modern sans-serif, high contrast",
        required: true
      },
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "16:9 + 4:5 + 9:16",
        required: true
      }
    ],
    bestPractices: [
      "Lock style and palette to keep campaign consistency.",
      "Generate variants by changing one variable per run.",
      "Validate outputs for artifacts before publishing."
    ],
    exampleUse: "High-intent campaign hero and ad creative generation.",
    negativePrompt: "extra fingers, warped text, malformed logos, style drift",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-095"
  },
  {
    slug: "conference-keynote-background-set-adobe",
    title: "Conference Keynote Background Set (Adobe Text-to-Image)",
    platform: "AdobeGenAI",
    tool: "TextToImage",
    complexity: "Advanced",
    category: "Marketing",
    tags: [
      "adobe-genai",
      "texttoimage",
      "marketing",
      "creative",
      "conference",
      "keynote",
      "background"
    ],
    summary: "Advanced Firefly prompt for conference keynote background set with brand controls and variant planning.",
    prompt: "Create production-grade visuals for Conference Keynote Background Set. Subject: {{subject}}. Style: {{style_reference}}. Lighting: {{lighting_setup}}. Lens/shot: {{lens_and_shot}}. Composition: {{composition_notes}} with copy-safe area. Brand palette: {{brand_palette}}. Typography mood: {{typography_guidance}}. Output variants for {{dimensions}} while keeping style consistency.",
    variables: [
      {
        key: "subject",
        label: "Subject",
        placeholder: "enterprise product, team scene, or campaign concept",
        required: true
      },
      {
        key: "style_reference",
        label: "Style reference",
        placeholder: "cinematic commercial editorial",
        required: true
      },
      {
        key: "lighting_setup",
        label: "Lighting setup",
        placeholder: "high-contrast key + fill + rim",
        required: true
      },
      {
        key: "lens_and_shot",
        label: "Lens and shot",
        placeholder: "35mm low-angle hero shot",
        required: true
      },
      {
        key: "composition_notes",
        label: "Composition notes",
        placeholder: "rule-of-thirds focal subject with text-safe area",
        required: true
      },
      {
        key: "brand_palette",
        label: "Brand palette",
        placeholder: "#0F172A #06B6D4 #F97316 #E2E8F0",
        required: true
      },
      {
        key: "typography_guidance",
        label: "Typography guidance",
        placeholder: "modern sans-serif, high contrast",
        required: true
      },
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "16:9 + 4:5 + 9:16",
        required: true
      }
    ],
    bestPractices: [
      "Lock style and palette to keep campaign consistency.",
      "Generate variants by changing one variable per run.",
      "Validate outputs for artifacts before publishing."
    ],
    exampleUse: "High-intent campaign hero and ad creative generation.",
    negativePrompt: "extra fingers, warped text, malformed logos, style drift",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-096"
  },
  {
    slug: "luxury-packaging-macro-shot-adobe",
    title: "Luxury Packaging Macro Shot (Adobe Text-to-Image)",
    platform: "AdobeGenAI",
    tool: "TextToImage",
    complexity: "Advanced",
    category: "Marketing",
    tags: [
      "adobe-genai",
      "texttoimage",
      "marketing",
      "creative",
      "luxury",
      "packaging",
      "macro",
      "shot"
    ],
    summary: "Advanced Firefly prompt for luxury packaging macro shot with brand controls and variant planning.",
    prompt: "Create production-grade visuals for Luxury Packaging Macro Shot. Subject: {{subject}}. Style: {{style_reference}}. Lighting: {{lighting_setup}}. Lens/shot: {{lens_and_shot}}. Composition: {{composition_notes}} with copy-safe area. Brand palette: {{brand_palette}}. Typography mood: {{typography_guidance}}. Output variants for {{dimensions}} while keeping style consistency.",
    variables: [
      {
        key: "subject",
        label: "Subject",
        placeholder: "enterprise product, team scene, or campaign concept",
        required: true
      },
      {
        key: "style_reference",
        label: "Style reference",
        placeholder: "cinematic commercial editorial",
        required: true
      },
      {
        key: "lighting_setup",
        label: "Lighting setup",
        placeholder: "high-contrast key + fill + rim",
        required: true
      },
      {
        key: "lens_and_shot",
        label: "Lens and shot",
        placeholder: "35mm low-angle hero shot",
        required: true
      },
      {
        key: "composition_notes",
        label: "Composition notes",
        placeholder: "rule-of-thirds focal subject with text-safe area",
        required: true
      },
      {
        key: "brand_palette",
        label: "Brand palette",
        placeholder: "#0F172A #06B6D4 #F97316 #E2E8F0",
        required: true
      },
      {
        key: "typography_guidance",
        label: "Typography guidance",
        placeholder: "modern sans-serif, high contrast",
        required: true
      },
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "16:9 + 4:5 + 9:16",
        required: true
      }
    ],
    bestPractices: [
      "Lock style and palette to keep campaign consistency.",
      "Generate variants by changing one variable per run.",
      "Validate outputs for artifacts before publishing."
    ],
    exampleUse: "High-intent campaign hero and ad creative generation.",
    negativePrompt: "extra fingers, warped text, malformed logos, style drift",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-097"
  },
  {
    slug: "food-menu-hero-photography-adobe",
    title: "Food Menu Hero Photography (Adobe Text-to-Image)",
    platform: "AdobeGenAI",
    tool: "TextToImage",
    complexity: "Advanced",
    category: "Marketing",
    tags: [
      "adobe-genai",
      "texttoimage",
      "marketing",
      "creative",
      "food",
      "menu",
      "hero",
      "photography"
    ],
    summary: "Advanced Firefly prompt for food menu hero photography with brand controls and variant planning.",
    prompt: "Create production-grade visuals for Food Menu Hero Photography. Subject: {{subject}}. Style: {{style_reference}}. Lighting: {{lighting_setup}}. Lens/shot: {{lens_and_shot}}. Composition: {{composition_notes}} with copy-safe area. Brand palette: {{brand_palette}}. Typography mood: {{typography_guidance}}. Output variants for {{dimensions}} while keeping style consistency.",
    variables: [
      {
        key: "subject",
        label: "Subject",
        placeholder: "enterprise product, team scene, or campaign concept",
        required: true
      },
      {
        key: "style_reference",
        label: "Style reference",
        placeholder: "cinematic commercial editorial",
        required: true
      },
      {
        key: "lighting_setup",
        label: "Lighting setup",
        placeholder: "high-contrast key + fill + rim",
        required: true
      },
      {
        key: "lens_and_shot",
        label: "Lens and shot",
        placeholder: "35mm low-angle hero shot",
        required: true
      },
      {
        key: "composition_notes",
        label: "Composition notes",
        placeholder: "rule-of-thirds focal subject with text-safe area",
        required: true
      },
      {
        key: "brand_palette",
        label: "Brand palette",
        placeholder: "#0F172A #06B6D4 #F97316 #E2E8F0",
        required: true
      },
      {
        key: "typography_guidance",
        label: "Typography guidance",
        placeholder: "modern sans-serif, high contrast",
        required: true
      },
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "16:9 + 4:5 + 9:16",
        required: true
      }
    ],
    bestPractices: [
      "Lock style and palette to keep campaign consistency.",
      "Generate variants by changing one variable per run.",
      "Validate outputs for artifacts before publishing."
    ],
    exampleUse: "High-intent campaign hero and ad creative generation.",
    negativePrompt: "extra fingers, warped text, malformed logos, style drift",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-098"
  },
  {
    slug: "travel-destination-ad-visual-adobe",
    title: "Travel Destination Ad Visual (Adobe Text-to-Image)",
    platform: "AdobeGenAI",
    tool: "TextToImage",
    complexity: "Advanced",
    category: "Marketing",
    tags: [
      "adobe-genai",
      "texttoimage",
      "marketing",
      "creative",
      "travel",
      "destination",
      "visual"
    ],
    summary: "Advanced Firefly prompt for travel destination ad visual with brand controls and variant planning.",
    prompt: "Create production-grade visuals for Travel Destination Ad Visual. Subject: {{subject}}. Style: {{style_reference}}. Lighting: {{lighting_setup}}. Lens/shot: {{lens_and_shot}}. Composition: {{composition_notes}} with copy-safe area. Brand palette: {{brand_palette}}. Typography mood: {{typography_guidance}}. Output variants for {{dimensions}} while keeping style consistency.",
    variables: [
      {
        key: "subject",
        label: "Subject",
        placeholder: "enterprise product, team scene, or campaign concept",
        required: true
      },
      {
        key: "style_reference",
        label: "Style reference",
        placeholder: "cinematic commercial editorial",
        required: true
      },
      {
        key: "lighting_setup",
        label: "Lighting setup",
        placeholder: "high-contrast key + fill + rim",
        required: true
      },
      {
        key: "lens_and_shot",
        label: "Lens and shot",
        placeholder: "35mm low-angle hero shot",
        required: true
      },
      {
        key: "composition_notes",
        label: "Composition notes",
        placeholder: "rule-of-thirds focal subject with text-safe area",
        required: true
      },
      {
        key: "brand_palette",
        label: "Brand palette",
        placeholder: "#0F172A #06B6D4 #F97316 #E2E8F0",
        required: true
      },
      {
        key: "typography_guidance",
        label: "Typography guidance",
        placeholder: "modern sans-serif, high contrast",
        required: true
      },
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "16:9 + 4:5 + 9:16",
        required: true
      }
    ],
    bestPractices: [
      "Lock style and palette to keep campaign consistency.",
      "Generate variants by changing one variable per run.",
      "Validate outputs for artifacts before publishing."
    ],
    exampleUse: "High-intent campaign hero and ad creative generation.",
    negativePrompt: "extra fingers, warped text, malformed logos, style drift",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-099"
  },
  {
    slug: "fitness-campaign-portrait-adobe",
    title: "Fitness Campaign Portrait (Adobe Text-to-Image)",
    platform: "AdobeGenAI",
    tool: "TextToImage",
    complexity: "Advanced",
    category: "Marketing",
    tags: [
      "adobe-genai",
      "texttoimage",
      "marketing",
      "creative",
      "fitness",
      "campaign",
      "portrait"
    ],
    summary: "Advanced Firefly prompt for fitness campaign portrait with brand controls and variant planning.",
    prompt: "Create production-grade visuals for Fitness Campaign Portrait. Subject: {{subject}}. Style: {{style_reference}}. Lighting: {{lighting_setup}}. Lens/shot: {{lens_and_shot}}. Composition: {{composition_notes}} with copy-safe area. Brand palette: {{brand_palette}}. Typography mood: {{typography_guidance}}. Output variants for {{dimensions}} while keeping style consistency.",
    variables: [
      {
        key: "subject",
        label: "Subject",
        placeholder: "enterprise product, team scene, or campaign concept",
        required: true
      },
      {
        key: "style_reference",
        label: "Style reference",
        placeholder: "cinematic commercial editorial",
        required: true
      },
      {
        key: "lighting_setup",
        label: "Lighting setup",
        placeholder: "high-contrast key + fill + rim",
        required: true
      },
      {
        key: "lens_and_shot",
        label: "Lens and shot",
        placeholder: "35mm low-angle hero shot",
        required: true
      },
      {
        key: "composition_notes",
        label: "Composition notes",
        placeholder: "rule-of-thirds focal subject with text-safe area",
        required: true
      },
      {
        key: "brand_palette",
        label: "Brand palette",
        placeholder: "#0F172A #06B6D4 #F97316 #E2E8F0",
        required: true
      },
      {
        key: "typography_guidance",
        label: "Typography guidance",
        placeholder: "modern sans-serif, high contrast",
        required: true
      },
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "16:9 + 4:5 + 9:16",
        required: true
      }
    ],
    bestPractices: [
      "Lock style and palette to keep campaign consistency.",
      "Generate variants by changing one variable per run.",
      "Validate outputs for artifacts before publishing."
    ],
    exampleUse: "High-intent campaign hero and ad creative generation.",
    negativePrompt: "extra fingers, warped text, malformed logos, style drift",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-100"
  },
  {
    slug: "fintech-trust-hero-visual-adobe",
    title: "Fintech Trust Hero Visual (Adobe Text-to-Image)",
    platform: "AdobeGenAI",
    tool: "TextToImage",
    complexity: "Advanced",
    category: "Marketing",
    tags: [
      "adobe-genai",
      "texttoimage",
      "marketing",
      "creative",
      "fintech",
      "trust",
      "hero",
      "visual"
    ],
    summary: "Advanced Firefly prompt for fintech trust hero visual with brand controls and variant planning.",
    prompt: "Create production-grade visuals for Fintech Trust Hero Visual. Subject: {{subject}}. Style: {{style_reference}}. Lighting: {{lighting_setup}}. Lens/shot: {{lens_and_shot}}. Composition: {{composition_notes}} with copy-safe area. Brand palette: {{brand_palette}}. Typography mood: {{typography_guidance}}. Output variants for {{dimensions}} while keeping style consistency.",
    variables: [
      {
        key: "subject",
        label: "Subject",
        placeholder: "enterprise product, team scene, or campaign concept",
        required: true
      },
      {
        key: "style_reference",
        label: "Style reference",
        placeholder: "cinematic commercial editorial",
        required: true
      },
      {
        key: "lighting_setup",
        label: "Lighting setup",
        placeholder: "high-contrast key + fill + rim",
        required: true
      },
      {
        key: "lens_and_shot",
        label: "Lens and shot",
        placeholder: "35mm low-angle hero shot",
        required: true
      },
      {
        key: "composition_notes",
        label: "Composition notes",
        placeholder: "rule-of-thirds focal subject with text-safe area",
        required: true
      },
      {
        key: "brand_palette",
        label: "Brand palette",
        placeholder: "#0F172A #06B6D4 #F97316 #E2E8F0",
        required: true
      },
      {
        key: "typography_guidance",
        label: "Typography guidance",
        placeholder: "modern sans-serif, high contrast",
        required: true
      },
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "16:9 + 4:5 + 9:16",
        required: true
      }
    ],
    bestPractices: [
      "Lock style and palette to keep campaign consistency.",
      "Generate variants by changing one variable per run.",
      "Validate outputs for artifacts before publishing."
    ],
    exampleUse: "High-intent campaign hero and ad creative generation.",
    negativePrompt: "extra fingers, warped text, malformed logos, style drift",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-101"
  },
  {
    slug: "cybersecurity-concept-art-adobe",
    title: "Cybersecurity Concept Art (Adobe Text-to-Image)",
    platform: "AdobeGenAI",
    tool: "TextToImage",
    complexity: "Advanced",
    category: "Marketing",
    tags: [
      "adobe-genai",
      "texttoimage",
      "marketing",
      "creative",
      "cybersecurity",
      "concept"
    ],
    summary: "Advanced Firefly prompt for cybersecurity concept art with brand controls and variant planning.",
    prompt: "Create production-grade visuals for Cybersecurity Concept Art. Subject: {{subject}}. Style: {{style_reference}}. Lighting: {{lighting_setup}}. Lens/shot: {{lens_and_shot}}. Composition: {{composition_notes}} with copy-safe area. Brand palette: {{brand_palette}}. Typography mood: {{typography_guidance}}. Output variants for {{dimensions}} while keeping style consistency.",
    variables: [
      {
        key: "subject",
        label: "Subject",
        placeholder: "enterprise product, team scene, or campaign concept",
        required: true
      },
      {
        key: "style_reference",
        label: "Style reference",
        placeholder: "cinematic commercial editorial",
        required: true
      },
      {
        key: "lighting_setup",
        label: "Lighting setup",
        placeholder: "high-contrast key + fill + rim",
        required: true
      },
      {
        key: "lens_and_shot",
        label: "Lens and shot",
        placeholder: "35mm low-angle hero shot",
        required: true
      },
      {
        key: "composition_notes",
        label: "Composition notes",
        placeholder: "rule-of-thirds focal subject with text-safe area",
        required: true
      },
      {
        key: "brand_palette",
        label: "Brand palette",
        placeholder: "#0F172A #06B6D4 #F97316 #E2E8F0",
        required: true
      },
      {
        key: "typography_guidance",
        label: "Typography guidance",
        placeholder: "modern sans-serif, high contrast",
        required: true
      },
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "16:9 + 4:5 + 9:16",
        required: true
      }
    ],
    bestPractices: [
      "Lock style and palette to keep campaign consistency.",
      "Generate variants by changing one variable per run.",
      "Validate outputs for artifacts before publishing."
    ],
    exampleUse: "High-intent campaign hero and ad creative generation.",
    negativePrompt: "extra fingers, warped text, malformed logos, style drift",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-102"
  },
  {
    slug: "fashion-editorial-scene-adobe",
    title: "Fashion Editorial Scene (Adobe Text-to-Image)",
    platform: "AdobeGenAI",
    tool: "TextToImage",
    complexity: "Advanced",
    category: "Marketing",
    tags: [
      "adobe-genai",
      "texttoimage",
      "marketing",
      "creative",
      "fashion",
      "editorial",
      "scene"
    ],
    summary: "Advanced Firefly prompt for fashion editorial scene with brand controls and variant planning.",
    prompt: "Create production-grade visuals for Fashion Editorial Scene. Subject: {{subject}}. Style: {{style_reference}}. Lighting: {{lighting_setup}}. Lens/shot: {{lens_and_shot}}. Composition: {{composition_notes}} with copy-safe area. Brand palette: {{brand_palette}}. Typography mood: {{typography_guidance}}. Output variants for {{dimensions}} while keeping style consistency.",
    variables: [
      {
        key: "subject",
        label: "Subject",
        placeholder: "enterprise product, team scene, or campaign concept",
        required: true
      },
      {
        key: "style_reference",
        label: "Style reference",
        placeholder: "cinematic commercial editorial",
        required: true
      },
      {
        key: "lighting_setup",
        label: "Lighting setup",
        placeholder: "high-contrast key + fill + rim",
        required: true
      },
      {
        key: "lens_and_shot",
        label: "Lens and shot",
        placeholder: "35mm low-angle hero shot",
        required: true
      },
      {
        key: "composition_notes",
        label: "Composition notes",
        placeholder: "rule-of-thirds focal subject with text-safe area",
        required: true
      },
      {
        key: "brand_palette",
        label: "Brand palette",
        placeholder: "#0F172A #06B6D4 #F97316 #E2E8F0",
        required: true
      },
      {
        key: "typography_guidance",
        label: "Typography guidance",
        placeholder: "modern sans-serif, high contrast",
        required: true
      },
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "16:9 + 4:5 + 9:16",
        required: true
      }
    ],
    bestPractices: [
      "Lock style and palette to keep campaign consistency.",
      "Generate variants by changing one variable per run.",
      "Validate outputs for artifacts before publishing."
    ],
    exampleUse: "High-intent campaign hero and ad creative generation.",
    negativePrompt: "extra fingers, warped text, malformed logos, style drift",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-103"
  },
  {
    slug: "architecture-moodboard-visual-adobe",
    title: "Architecture Moodboard Visual (Adobe Text-to-Image)",
    platform: "AdobeGenAI",
    tool: "TextToImage",
    complexity: "Advanced",
    category: "Marketing",
    tags: [
      "adobe-genai",
      "texttoimage",
      "marketing",
      "creative",
      "architecture",
      "moodboard",
      "visual"
    ],
    summary: "Advanced Firefly prompt for architecture moodboard visual with brand controls and variant planning.",
    prompt: "Create production-grade visuals for Architecture Moodboard Visual. Subject: {{subject}}. Style: {{style_reference}}. Lighting: {{lighting_setup}}. Lens/shot: {{lens_and_shot}}. Composition: {{composition_notes}} with copy-safe area. Brand palette: {{brand_palette}}. Typography mood: {{typography_guidance}}. Output variants for {{dimensions}} while keeping style consistency.",
    variables: [
      {
        key: "subject",
        label: "Subject",
        placeholder: "enterprise product, team scene, or campaign concept",
        required: true
      },
      {
        key: "style_reference",
        label: "Style reference",
        placeholder: "cinematic commercial editorial",
        required: true
      },
      {
        key: "lighting_setup",
        label: "Lighting setup",
        placeholder: "high-contrast key + fill + rim",
        required: true
      },
      {
        key: "lens_and_shot",
        label: "Lens and shot",
        placeholder: "35mm low-angle hero shot",
        required: true
      },
      {
        key: "composition_notes",
        label: "Composition notes",
        placeholder: "rule-of-thirds focal subject with text-safe area",
        required: true
      },
      {
        key: "brand_palette",
        label: "Brand palette",
        placeholder: "#0F172A #06B6D4 #F97316 #E2E8F0",
        required: true
      },
      {
        key: "typography_guidance",
        label: "Typography guidance",
        placeholder: "modern sans-serif, high contrast",
        required: true
      },
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "16:9 + 4:5 + 9:16",
        required: true
      }
    ],
    bestPractices: [
      "Lock style and palette to keep campaign consistency.",
      "Generate variants by changing one variable per run.",
      "Validate outputs for artifacts before publishing."
    ],
    exampleUse: "High-intent campaign hero and ad creative generation.",
    negativePrompt: "extra fingers, warped text, malformed logos, style drift",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-104"
  },
  {
    slug: "enterprise-office-scene-pack-adobe",
    title: "Enterprise Office Scene Pack (Adobe Text-to-Image)",
    platform: "AdobeGenAI",
    tool: "TextToImage",
    complexity: "Advanced",
    category: "Marketing",
    tags: [
      "adobe-genai",
      "texttoimage",
      "marketing",
      "creative",
      "enterprise",
      "office",
      "scene",
      "pack"
    ],
    summary: "Advanced Firefly prompt for enterprise office scene pack with brand controls and variant planning.",
    prompt: "Create production-grade visuals for Enterprise Office Scene Pack. Subject: {{subject}}. Style: {{style_reference}}. Lighting: {{lighting_setup}}. Lens/shot: {{lens_and_shot}}. Composition: {{composition_notes}} with copy-safe area. Brand palette: {{brand_palette}}. Typography mood: {{typography_guidance}}. Output variants for {{dimensions}} while keeping style consistency.",
    variables: [
      {
        key: "subject",
        label: "Subject",
        placeholder: "enterprise product, team scene, or campaign concept",
        required: true
      },
      {
        key: "style_reference",
        label: "Style reference",
        placeholder: "cinematic commercial editorial",
        required: true
      },
      {
        key: "lighting_setup",
        label: "Lighting setup",
        placeholder: "high-contrast key + fill + rim",
        required: true
      },
      {
        key: "lens_and_shot",
        label: "Lens and shot",
        placeholder: "35mm low-angle hero shot",
        required: true
      },
      {
        key: "composition_notes",
        label: "Composition notes",
        placeholder: "rule-of-thirds focal subject with text-safe area",
        required: true
      },
      {
        key: "brand_palette",
        label: "Brand palette",
        placeholder: "#0F172A #06B6D4 #F97316 #E2E8F0",
        required: true
      },
      {
        key: "typography_guidance",
        label: "Typography guidance",
        placeholder: "modern sans-serif, high contrast",
        required: true
      },
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "16:9 + 4:5 + 9:16",
        required: true
      }
    ],
    bestPractices: [
      "Lock style and palette to keep campaign consistency.",
      "Generate variants by changing one variable per run.",
      "Validate outputs for artifacts before publishing."
    ],
    exampleUse: "High-intent campaign hero and ad creative generation.",
    negativePrompt: "extra fingers, warped text, malformed logos, style drift",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-105"
  },
  {
    slug: "perspective-matched-product-replacement-adobe",
    title: "Perspective-Matched Product Replacement (Adobe Generative Fill)",
    platform: "AdobeGenAI",
    tool: "GenerativeFill",
    complexity: "Advanced",
    category: "Photo Edit",
    tags: [
      "adobe-genai",
      "generativefill",
      "photo-edit",
      "creative",
      "perspective",
      "matched",
      "product",
      "replacement"
    ],
    summary: "Advanced Generative Fill workflow prompt for perspective-matched product replacement with realism controls.",
    prompt: "Perspective-Matched Product Replacement: remove or replace {target_object} in {target_area}; rebuild realistic {surface_texture} with matching perspective and lighting.",
    variables: [
      {
        key: "target_object",
        label: "Target object",
        placeholder: "placeholder or complex distraction",
        required: true
      },
      {
        key: "target_area",
        label: "Target area",
        placeholder: "midground right side",
        required: true
      },
      {
        key: "surface_texture",
        label: "Surface texture",
        placeholder: "architecture, fabric, foliage",
        required: true
      }
    ],
    bestPractices: [
      "Work in layered passes for complex scenes.",
      "Preserve perspective guides before fill.",
      "Inspect seams and edge halos at 100% zoom."
    ],
    exampleUse: "Complex retouch and compositing for campaign assets.",
    negativePrompt: "perspective mismatch, repeated patterns, edge halos",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-106"
  },
  {
    slug: "billboard-surface-replacement-adobe",
    title: "Billboard Surface Replacement (Adobe Generative Fill)",
    platform: "AdobeGenAI",
    tool: "GenerativeFill",
    complexity: "Advanced",
    category: "Photo Edit",
    tags: [
      "adobe-genai",
      "generativefill",
      "photo-edit",
      "creative",
      "billboard",
      "surface",
      "replacement"
    ],
    summary: "Advanced Generative Fill workflow prompt for billboard surface replacement with realism controls.",
    prompt: "Billboard Surface Replacement: remove or replace {target_object} in {target_area}; rebuild realistic {surface_texture} with matching perspective and lighting.",
    variables: [
      {
        key: "target_object",
        label: "Target object",
        placeholder: "placeholder or complex distraction",
        required: true
      },
      {
        key: "target_area",
        label: "Target area",
        placeholder: "midground right side",
        required: true
      },
      {
        key: "surface_texture",
        label: "Surface texture",
        placeholder: "architecture, fabric, foliage",
        required: true
      }
    ],
    bestPractices: [
      "Work in layered passes for complex scenes.",
      "Preserve perspective guides before fill.",
      "Inspect seams and edge halos at 100% zoom."
    ],
    exampleUse: "Complex retouch and compositing for campaign assets.",
    negativePrompt: "perspective mismatch, repeated patterns, edge halos",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-107"
  },
  {
    slug: "realistic-reflection-addition-adobe",
    title: "Realistic Reflection Addition (Adobe Generative Fill)",
    platform: "AdobeGenAI",
    tool: "GenerativeFill",
    complexity: "Advanced",
    category: "Photo Edit",
    tags: [
      "adobe-genai",
      "generativefill",
      "photo-edit",
      "creative",
      "realistic",
      "reflection",
      "addition"
    ],
    summary: "Advanced Generative Fill workflow prompt for realistic reflection addition with realism controls.",
    prompt: "Realistic Reflection Addition: remove or replace {target_object} in {target_area}; rebuild realistic {surface_texture} with matching perspective and lighting.",
    variables: [
      {
        key: "target_object",
        label: "Target object",
        placeholder: "placeholder or complex distraction",
        required: true
      },
      {
        key: "target_area",
        label: "Target area",
        placeholder: "midground right side",
        required: true
      },
      {
        key: "surface_texture",
        label: "Surface texture",
        placeholder: "architecture, fabric, foliage",
        required: true
      }
    ],
    bestPractices: [
      "Work in layered passes for complex scenes.",
      "Preserve perspective guides before fill.",
      "Inspect seams and edge halos at 100% zoom."
    ],
    exampleUse: "Complex retouch and compositing for campaign assets.",
    negativePrompt: "perspective mismatch, repeated patterns, edge halos",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-108"
  },
  {
    slug: "rain-on-glass-effect-adobe",
    title: "Rain-on-Glass Effect (Adobe Generative Fill)",
    platform: "AdobeGenAI",
    tool: "GenerativeFill",
    complexity: "Advanced",
    category: "Photo Edit",
    tags: [
      "adobe-genai",
      "generativefill",
      "photo-edit",
      "creative",
      "rain",
      "glass",
      "effect"
    ],
    summary: "Advanced Generative Fill workflow prompt for rain-on-glass effect with realism controls.",
    prompt: "Rain-on-Glass Effect: remove or replace {target_object} in {target_area}; rebuild realistic {surface_texture} with matching perspective and lighting.",
    variables: [
      {
        key: "target_object",
        label: "Target object",
        placeholder: "placeholder or complex distraction",
        required: true
      },
      {
        key: "target_area",
        label: "Target area",
        placeholder: "midground right side",
        required: true
      },
      {
        key: "surface_texture",
        label: "Surface texture",
        placeholder: "architecture, fabric, foliage",
        required: true
      }
    ],
    bestPractices: [
      "Work in layered passes for complex scenes.",
      "Preserve perspective guides before fill.",
      "Inspect seams and edge halos at 100% zoom."
    ],
    exampleUse: "Complex retouch and compositing for campaign assets.",
    negativePrompt: "perspective mismatch, repeated patterns, edge halos",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-109"
  },
  {
    slug: "crowd-area-reconstruction-adobe",
    title: "Crowd Area Reconstruction (Adobe Generative Fill)",
    platform: "AdobeGenAI",
    tool: "GenerativeFill",
    complexity: "Advanced",
    category: "Photo Edit",
    tags: [
      "adobe-genai",
      "generativefill",
      "photo-edit",
      "creative",
      "crowd",
      "area",
      "reconstruction"
    ],
    summary: "Advanced Generative Fill workflow prompt for crowd area reconstruction with realism controls.",
    prompt: "Crowd Area Reconstruction: remove or replace {target_object} in {target_area}; rebuild realistic {surface_texture} with matching perspective and lighting.",
    variables: [
      {
        key: "target_object",
        label: "Target object",
        placeholder: "placeholder or complex distraction",
        required: true
      },
      {
        key: "target_area",
        label: "Target area",
        placeholder: "midground right side",
        required: true
      },
      {
        key: "surface_texture",
        label: "Surface texture",
        placeholder: "architecture, fabric, foliage",
        required: true
      }
    ],
    bestPractices: [
      "Work in layered passes for complex scenes.",
      "Preserve perspective guides before fill.",
      "Inspect seams and edge halos at 100% zoom."
    ],
    exampleUse: "Complex retouch and compositing for campaign assets.",
    negativePrompt: "perspective mismatch, repeated patterns, edge halos",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-110"
  },
  {
    slug: "wall-art-style-swap-adobe",
    title: "Wall Art Style Swap (Adobe Generative Fill)",
    platform: "AdobeGenAI",
    tool: "GenerativeFill",
    complexity: "Advanced",
    category: "Photo Edit",
    tags: [
      "adobe-genai",
      "generativefill",
      "photo-edit",
      "creative",
      "wall",
      "style",
      "swap"
    ],
    summary: "Advanced Generative Fill workflow prompt for wall art style swap with realism controls.",
    prompt: "Wall Art Style Swap: remove or replace {target_object} in {target_area}; rebuild realistic {surface_texture} with matching perspective and lighting.",
    variables: [
      {
        key: "target_object",
        label: "Target object",
        placeholder: "placeholder or complex distraction",
        required: true
      },
      {
        key: "target_area",
        label: "Target area",
        placeholder: "midground right side",
        required: true
      },
      {
        key: "surface_texture",
        label: "Surface texture",
        placeholder: "architecture, fabric, foliage",
        required: true
      }
    ],
    bestPractices: [
      "Work in layered passes for complex scenes.",
      "Preserve perspective guides before fill.",
      "Inspect seams and edge halos at 100% zoom."
    ],
    exampleUse: "Complex retouch and compositing for campaign assets.",
    negativePrompt: "perspective mismatch, repeated patterns, edge halos",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-111"
  },
  {
    slug: "complex-fence-removal-rebuild-adobe",
    title: "Complex Fence Removal + Rebuild (Adobe Generative Fill)",
    platform: "AdobeGenAI",
    tool: "GenerativeFill",
    complexity: "Advanced",
    category: "Photo Edit",
    tags: [
      "adobe-genai",
      "generativefill",
      "photo-edit",
      "creative",
      "complex",
      "fence",
      "removal",
      "rebuild"
    ],
    summary: "Advanced Generative Fill workflow prompt for complex fence removal + rebuild with realism controls.",
    prompt: "Complex Fence Removal + Rebuild: remove or replace {target_object} in {target_area}; rebuild realistic {surface_texture} with matching perspective and lighting.",
    variables: [
      {
        key: "target_object",
        label: "Target object",
        placeholder: "placeholder or complex distraction",
        required: true
      },
      {
        key: "target_area",
        label: "Target area",
        placeholder: "midground right side",
        required: true
      },
      {
        key: "surface_texture",
        label: "Surface texture",
        placeholder: "architecture, fabric, foliage",
        required: true
      }
    ],
    bestPractices: [
      "Work in layered passes for complex scenes.",
      "Preserve perspective guides before fill.",
      "Inspect seams and edge halos at 100% zoom."
    ],
    exampleUse: "Complex retouch and compositing for campaign assets.",
    negativePrompt: "perspective mismatch, repeated patterns, edge halos",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-112"
  },
  {
    slug: "environmental-composite-enhancer-adobe",
    title: "Environmental Composite Enhancer (Adobe Generative Fill)",
    platform: "AdobeGenAI",
    tool: "GenerativeFill",
    complexity: "Advanced",
    category: "Photo Edit",
    tags: [
      "adobe-genai",
      "generativefill",
      "photo-edit",
      "creative",
      "environmental",
      "composite",
      "enhancer"
    ],
    summary: "Advanced Generative Fill workflow prompt for environmental composite enhancer with realism controls.",
    prompt: "Environmental Composite Enhancer: remove or replace {target_object} in {target_area}; rebuild realistic {surface_texture} with matching perspective and lighting.",
    variables: [
      {
        key: "target_object",
        label: "Target object",
        placeholder: "placeholder or complex distraction",
        required: true
      },
      {
        key: "target_area",
        label: "Target area",
        placeholder: "midground right side",
        required: true
      },
      {
        key: "surface_texture",
        label: "Surface texture",
        placeholder: "architecture, fabric, foliage",
        required: true
      }
    ],
    bestPractices: [
      "Work in layered passes for complex scenes.",
      "Preserve perspective guides before fill.",
      "Inspect seams and edge halos at 100% zoom."
    ],
    exampleUse: "Complex retouch and compositing for campaign assets.",
    negativePrompt: "perspective mismatch, repeated patterns, edge halos",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-113"
  },
  {
    slug: "panoramic-hero-expansion-adobe",
    title: "Panoramic Hero Expansion (Adobe Generative Expand)",
    platform: "AdobeGenAI",
    tool: "GenerativeExpand",
    complexity: "Advanced",
    category: "Marketing",
    tags: [
      "adobe-genai",
      "generativeexpand",
      "marketing",
      "creative",
      "panoramic",
      "hero",
      "expansion"
    ],
    summary: "Advanced Generative Expand prompt for panoramic hero expansion with multi-format continuity.",
    prompt: "Panoramic Hero Expansion: expand image to {dimensions}; continue {scene_elements} naturally with consistent depth, perspective, and lighting.",
    variables: [
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "2400x1200, 1080x1920",
        required: true
      },
      {
        key: "scene_elements",
        label: "Scene elements",
        placeholder: "architecture, foreground depth, ambient light",
        required: true
      }
    ],
    bestPractices: [
      "Expand incrementally for better geometric stability.",
      "Keep subject-safe zones mapped before generation.",
      "Test outputs across target crops before export."
    ],
    exampleUse: "Cross-channel hero and social format adaptation.",
    negativePrompt: "stretched architecture, repeated blocks, horizon warping",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-114"
  },
  {
    slug: "multi-format-crop-safe-expansion-kit-adobe",
    title: "Multi-Format Crop-Safe Expansion Kit (Adobe Generative Expand)",
    platform: "AdobeGenAI",
    tool: "GenerativeExpand",
    complexity: "Advanced",
    category: "Marketing",
    tags: [
      "adobe-genai",
      "generativeexpand",
      "marketing",
      "creative",
      "multi",
      "format",
      "crop",
      "safe"
    ],
    summary: "Advanced Generative Expand prompt for multi-format crop-safe expansion kit with multi-format continuity.",
    prompt: "Multi-Format Crop-Safe Expansion Kit: expand image to {dimensions}; continue {scene_elements} naturally with consistent depth, perspective, and lighting.",
    variables: [
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "2400x1200, 1080x1920",
        required: true
      },
      {
        key: "scene_elements",
        label: "Scene elements",
        placeholder: "architecture, foreground depth, ambient light",
        required: true
      }
    ],
    bestPractices: [
      "Expand incrementally for better geometric stability.",
      "Keep subject-safe zones mapped before generation.",
      "Test outputs across target crops before export."
    ],
    exampleUse: "Cross-channel hero and social format adaptation.",
    negativePrompt: "stretched architecture, repeated blocks, horizon warping",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-115"
  },
  {
    slug: "carousel-continuity-expansion-adobe",
    title: "Carousel Continuity Expansion (Adobe Generative Expand)",
    platform: "AdobeGenAI",
    tool: "GenerativeExpand",
    complexity: "Advanced",
    category: "Marketing",
    tags: [
      "adobe-genai",
      "generativeexpand",
      "marketing",
      "creative",
      "carousel",
      "continuity",
      "expansion"
    ],
    summary: "Advanced Generative Expand prompt for carousel continuity expansion with multi-format continuity.",
    prompt: "Carousel Continuity Expansion: expand image to {dimensions}; continue {scene_elements} naturally with consistent depth, perspective, and lighting.",
    variables: [
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "2400x1200, 1080x1920",
        required: true
      },
      {
        key: "scene_elements",
        label: "Scene elements",
        placeholder: "architecture, foreground depth, ambient light",
        required: true
      }
    ],
    bestPractices: [
      "Expand incrementally for better geometric stability.",
      "Keep subject-safe zones mapped before generation.",
      "Test outputs across target crops before export."
    ],
    exampleUse: "Cross-channel hero and social format adaptation.",
    negativePrompt: "stretched architecture, repeated blocks, horizon warping",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-116"
  },
  {
    slug: "landscape-to-reel-expansion-workflow-adobe",
    title: "Landscape-to-Reel Expansion Workflow (Adobe Generative Expand)",
    platform: "AdobeGenAI",
    tool: "GenerativeExpand",
    complexity: "Advanced",
    category: "Marketing",
    tags: [
      "adobe-genai",
      "generativeexpand",
      "marketing",
      "creative",
      "landscape",
      "reel",
      "expansion",
      "workflow"
    ],
    summary: "Advanced Generative Expand prompt for landscape-to-reel expansion workflow with multi-format continuity.",
    prompt: "Landscape-to-Reel Expansion Workflow: expand image to {dimensions}; continue {scene_elements} naturally with consistent depth, perspective, and lighting.",
    variables: [
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "2400x1200, 1080x1920",
        required: true
      },
      {
        key: "scene_elements",
        label: "Scene elements",
        placeholder: "architecture, foreground depth, ambient light",
        required: true
      }
    ],
    bestPractices: [
      "Expand incrementally for better geometric stability.",
      "Keep subject-safe zones mapped before generation.",
      "Test outputs across target crops before export."
    ],
    exampleUse: "Cross-channel hero and social format adaptation.",
    negativePrompt: "stretched architecture, repeated blocks, horizon warping",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-117"
  },
  {
    slug: "short-ad-storyboard-frames-adobe",
    title: "Short Ad Storyboard Frames (Adobe Video)",
    platform: "AdobeGenAI",
    tool: "Video",
    complexity: "Advanced",
    category: "Marketing",
    tags: [
      "adobe-genai",
      "video",
      "marketing",
      "creative",
      "short",
      "storyboard",
      "frames"
    ],
    summary: "Advanced Video direction prompt for short ad storyboard frames with production-ready structure.",
    prompt: "Build a structured Video prompt pack for Short Ad Storyboard Frames. Subject: {{subject}}. Style: {{style_reference}}. Lighting: {{lighting_setup}}. Composition: {{composition_notes}}. Palette: {{brand_palette}}. Output ratios: {{dimensions}}.",
    variables: [
      {
        key: "subject",
        label: "Subject",
        placeholder: "campaign concept or brand asset",
        required: true
      },
      {
        key: "style_reference",
        label: "Style reference",
        placeholder: "clean modern editorial",
        required: true
      },
      {
        key: "lighting_setup",
        label: "Lighting setup",
        placeholder: "soft directional with subtle rim",
        required: true
      },
      {
        key: "composition_notes",
        label: "Composition notes",
        placeholder: "clear focal hierarchy + copy-safe area",
        required: true
      },
      {
        key: "brand_palette",
        label: "Brand palette",
        placeholder: "navy, cyan, orange, slate",
        required: true
      },
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "16:9 + 9:16 variants",
        required: true
      }
    ],
    bestPractices: [
      "Define one master style before generating variants.",
      "Keep export dimensions explicit for handoff.",
      "Review consistency against brand guidelines."
    ],
    exampleUse: "Creative direction for campaign production workflows.",
    negativePrompt: "style drift, inconsistent geometry, noisy artifacts",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-118"
  },
  {
    slug: "vector-mascot-style-guide-adobe",
    title: "Vector Mascot Style Guide (Adobe Vector)",
    platform: "AdobeGenAI",
    tool: "Vector",
    complexity: "Advanced",
    category: "Branding",
    tags: [
      "adobe-genai",
      "vector",
      "branding",
      "creative",
      "mascot",
      "style",
      "guide"
    ],
    summary: "Advanced Vector direction prompt for vector mascot style guide with production-ready structure.",
    prompt: "Build a structured Vector prompt pack for Vector Mascot Style Guide. Subject: {{subject}}. Style: {{style_reference}}. Lighting: {{lighting_setup}}. Composition: {{composition_notes}}. Palette: {{brand_palette}}. Output ratios: {{dimensions}}.",
    variables: [
      {
        key: "subject",
        label: "Subject",
        placeholder: "campaign concept or brand asset",
        required: true
      },
      {
        key: "style_reference",
        label: "Style reference",
        placeholder: "clean modern editorial",
        required: true
      },
      {
        key: "lighting_setup",
        label: "Lighting setup",
        placeholder: "soft directional with subtle rim",
        required: true
      },
      {
        key: "composition_notes",
        label: "Composition notes",
        placeholder: "clear focal hierarchy + copy-safe area",
        required: true
      },
      {
        key: "brand_palette",
        label: "Brand palette",
        placeholder: "navy, cyan, orange, slate",
        required: true
      },
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "16:9 + 9:16 variants",
        required: true
      }
    ],
    bestPractices: [
      "Define one master style before generating variants.",
      "Keep export dimensions explicit for handoff.",
      "Review consistency against brand guidelines."
    ],
    exampleUse: "Creative direction for campaign production workflows.",
    negativePrompt: "style drift, inconsistent geometry, noisy artifacts",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-119"
  },
  {
    slug: "logo-direction-board-adobe",
    title: "Logo Direction Board (Adobe Vector)",
    platform: "AdobeGenAI",
    tool: "Vector",
    complexity: "Advanced",
    category: "Branding",
    tags: [
      "adobe-genai",
      "vector",
      "branding",
      "creative",
      "logo",
      "direction",
      "board"
    ],
    summary: "Advanced Vector direction prompt for logo direction board with production-ready structure.",
    prompt: "Build a structured Vector prompt pack for Logo Direction Board. Subject: {{subject}}. Style: {{style_reference}}. Lighting: {{lighting_setup}}. Composition: {{composition_notes}}. Palette: {{brand_palette}}. Output ratios: {{dimensions}}.",
    variables: [
      {
        key: "subject",
        label: "Subject",
        placeholder: "campaign concept or brand asset",
        required: true
      },
      {
        key: "style_reference",
        label: "Style reference",
        placeholder: "clean modern editorial",
        required: true
      },
      {
        key: "lighting_setup",
        label: "Lighting setup",
        placeholder: "soft directional with subtle rim",
        required: true
      },
      {
        key: "composition_notes",
        label: "Composition notes",
        placeholder: "clear focal hierarchy + copy-safe area",
        required: true
      },
      {
        key: "brand_palette",
        label: "Brand palette",
        placeholder: "navy, cyan, orange, slate",
        required: true
      },
      {
        key: "dimensions",
        label: "Dimensions",
        placeholder: "16:9 + 9:16 variants",
        required: true
      }
    ],
    bestPractices: [
      "Define one master style before generating variants.",
      "Keep export dimensions explicit for handoff.",
      "Review consistency against brand guidelines."
    ],
    exampleUse: "Creative direction for campaign production workflows.",
    negativePrompt: "style drift, inconsistent geometry, noisy artifacts",
    outputFormat: "None",
    updatedAt: "2026-03-04T00:00:00.000Z",
    id: "genai-120"
  }
];

const slugSet = new Set<string>();
for (const prompt of genaiPrompts) {
  if (slugSet.has(prompt.slug)) {
    throw new Error(`Duplicate GenAI prompt slug detected: ${prompt.slug}`);
  }
  slugSet.add(prompt.slug);
}
