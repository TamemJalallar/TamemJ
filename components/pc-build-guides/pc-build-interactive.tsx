"use client";

import { useEffect, useMemo, useState } from "react";
import { buildAmazonSearchLink } from "@/lib/amazon-affiliate";

type CaseSize = "Small Form" | "Mid Size" | "Big Tower" | "Extra Big Tower";
type Workload = "Gaming" | "Creative" | "Development" | "Work/Office" | "Streaming" | "AI/ML";
type CpuPlatform = "No Preference" | "AMD AM5" | "Intel LGA1700";
type StorageProfile = "Balanced" | "Speed First" | "Capacity First" | "Creator/Project" | "AI/ML";
type NoiseProfile = "Quiet" | "Balanced" | "Performance";
type BudgetBand = "Entry" | "Midrange" | "High-End" | "Enthusiast";

type Recommendation = {
  title: string;
  description: string;
  amazonQuery: string;
  note?: string;
};

type TaggedRecommendation = Recommendation & {
  badge?: "Best Value" | "Balanced" | "Performance" | "Max Performance";
  badgeTone?: "value" | "balanced" | "performance";
};

type FormFactor = {
  name: string;
  inches: string;
  millimeters: string;
  guidance: string;
  amazonQuery: string;
};

type CaseOption = {
  value: CaseSize;
  summary: string;
  amazonQuery: string;
  formFactors: FormFactor[];
};

const budgetMin = 500;
const budgetMaxStandard = 8000;
const budgetMaxOverkill = 15000;
const budgetStep = 100;
const overkillSuggestedBudget = 10000;

const caseOptions: CaseOption[] = [
  {
    value: "Small Form",
    summary: "Compact, easy to move, best for minimalist desks or space-limited builds.",
    amazonQuery: "Mini-ITX PC case",
    formFactors: [
      {
        name: "Mini-ITX",
        inches: "6.7 × 6.7 in",
        millimeters: "170 × 170 mm",
        guidance: "Smallest mainstream form factor with limited expansion slots.",
        amazonQuery: "Mini-ITX motherboard"
      },
      {
        name: "Mini-DTX",
        inches: "8.0 × 6.7 in",
        millimeters: "203 × 170 mm",
        guidance: "Adds a bit more expansion over Mini-ITX while staying compact.",
        amazonQuery: "Mini-DTX motherboard"
      }
    ]
  },
  {
    value: "Mid Size",
    summary: "Most common, balanced airflow and expansion without taking over your desk.",
    amazonQuery: "Mid tower PC case",
    formFactors: [
      {
        name: "Micro-ATX",
        inches: "9.6 × 9.6 in",
        millimeters: "244 × 244 mm",
        guidance: "Great balance of size and expansion for most builds.",
        amazonQuery: "Micro-ATX motherboard"
      },
      {
        name: "ATX",
        inches: "12.0 × 9.6 in",
        millimeters: "305 × 244 mm",
        guidance: "Full-size mainstream boards with more PCIe slots and M.2 lanes.",
        amazonQuery: "ATX motherboard"
      }
    ]
  },
  {
    value: "Big Tower",
    summary: "Room for high-end GPUs, larger coolers, and more airflow.",
    amazonQuery: "Full tower PC case",
    formFactors: [
      {
        name: "ATX",
        inches: "12.0 × 9.6 in",
        millimeters: "305 × 244 mm",
        guidance: "Standard ATX fits most full towers with ample room for GPUs.",
        amazonQuery: "ATX motherboard"
      },
      {
        name: "E-ATX",
        inches: "12.0 × 13.0 in",
        millimeters: "305 × 330 mm",
        guidance: "Extra width for more M.2, PCIe lanes, and VRMs.",
        amazonQuery: "E-ATX motherboard"
      }
    ]
  },
  {
    value: "Extra Big Tower",
    summary: "Maximum airflow and clearance for multi-GPU or workstation builds.",
    amazonQuery: "Extra large PC case",
    formFactors: [
      {
        name: "E-ATX",
        inches: "12.0 × 13.0 in",
        millimeters: "305 × 330 mm",
        guidance: "Best for workstations, heavy expansion, and high power draw.",
        amazonQuery: "E-ATX motherboard"
      }
    ]
  }
];

const workloadOptions: Array<{ value: Workload; summary: string }> = [
  { value: "Gaming", summary: "High FPS and strong GPU emphasis." },
  { value: "Creative", summary: "Video, 3D, and content creation workloads." },
  { value: "Development", summary: "Compiling, containers, VMs, and multitasking." },
  { value: "Work/Office", summary: "Productivity, web apps, and day-to-day tasks." },
  { value: "Streaming", summary: "Gaming + encoding or live production." },
  { value: "AI/ML", summary: "Local inference, training, and GPU compute." }
];

const coolingOptions = [
  {
    title: "Heatsink (Air)",
    description:
      "Reliable, low maintenance, and great value. Large tower coolers handle most CPUs quietly.",
    amazonQuery: "CPU air cooler heatsink"
  },
  {
    title: "AIO Liquid",
    description:
      "Cleaner look with higher peak cooling for boost clocks. Good for mid to high-end CPUs.",
    amazonQuery: "AIO liquid CPU cooler 240mm"
  },
  {
    title: "Custom Water",
    description:
      "Maximum thermal headroom and aesthetics. Best for enthusiasts willing to maintain the loop.",
    amazonQuery: "custom water cooling kit PC"
  }
];

const cpuPlatformOptions: Array<{ value: CpuPlatform; summary: string }> = [
  { value: "No Preference", summary: "Show both AMD AM5 and Intel LGA1700 chipsets." },
  { value: "AMD AM5", summary: "Great efficiency and future CPU upgrade path." },
  { value: "Intel LGA1700", summary: "Strong mixed workloads and wide motherboard selection." }
];

const storageOptions: Array<{ value: StorageProfile; summary: string }> = [
  { value: "Balanced", summary: "NVMe for OS/apps + room for projects." },
  { value: "Speed First", summary: "Fastest NVMe for scratch and heavy reads/writes." },
  { value: "Capacity First", summary: "Large storage for big libraries and backups." },
  { value: "Creator/Project", summary: "Separate OS, scratch, and archive drives." },
  { value: "AI/ML", summary: "High-capacity NVMe for datasets and checkpoints." }
];

const noiseOptions: Array<{ value: NoiseProfile; summary: string }> = [
  { value: "Quiet", summary: "Lower fan curves and quieter cooling components." },
  { value: "Balanced", summary: "Mix of low noise and thermal headroom." },
  { value: "Performance", summary: "Prioritize thermals and boost clocks over noise." }
];

function classNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

function badgeClass(tone?: TaggedRecommendation["badgeTone"]): string {
  switch (tone) {
    case "performance":
      return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200";
    case "balanced":
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200";
    default:
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200";
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getBudgetBand(budget: number): BudgetBand {
  if (budget < 800) return "Entry";
  if (budget < 1500) return "Midrange";
  if (budget < 2500) return "High-End";
  return "Enthusiast";
}

function caseToParam(value: CaseSize): string {
  switch (value) {
    case "Small Form":
      return "small";
    case "Mid Size":
      return "mid";
    case "Big Tower":
      return "big";
    case "Extra Big Tower":
      return "xl";
  }
}

function paramToCase(value: string | null): CaseSize {
  switch ((value || "").toLowerCase()) {
    case "small":
      return "Small Form";
    case "big":
      return "Big Tower";
    case "xl":
      return "Extra Big Tower";
    case "mid":
    default:
      return "Mid Size";
  }
}

function workloadToParam(value: Workload): string {
  switch (value) {
    case "Work/Office":
      return "office";
    case "AI/ML":
      return "ai";
    default:
      return value.toLowerCase();
  }
}

function paramToWorkload(value: string | null): Workload {
  switch ((value || "").toLowerCase()) {
    case "gaming":
      return "Gaming";
    case "creative":
      return "Creative";
    case "development":
      return "Development";
    case "office":
      return "Work/Office";
    case "streaming":
      return "Streaming";
    case "ai":
      return "AI/ML";
    default:
      return "Gaming";
  }
}

function platformToParam(value: CpuPlatform): string {
  switch (value) {
    case "AMD AM5":
      return "amd";
    case "Intel LGA1700":
      return "intel";
    default:
      return "any";
  }
}

function paramToPlatform(value: string | null): CpuPlatform {
  switch ((value || "").toLowerCase()) {
    case "amd":
      return "AMD AM5";
    case "intel":
      return "Intel LGA1700";
    default:
      return "No Preference";
  }
}

function storageToParam(value: StorageProfile): string {
  switch (value) {
    case "Speed First":
      return "speed";
    case "Capacity First":
      return "capacity";
    case "Creator/Project":
      return "creator";
    case "AI/ML":
      return "ai";
    default:
      return "balanced";
  }
}

function paramToStorage(value: string | null): StorageProfile {
  switch ((value || "").toLowerCase()) {
    case "speed":
      return "Speed First";
    case "capacity":
      return "Capacity First";
    case "creator":
      return "Creator/Project";
    case "ai":
      return "AI/ML";
    default:
      return "Balanced";
  }
}

function noiseToParam(value: NoiseProfile): string {
  switch (value) {
    case "Quiet":
      return "quiet";
    case "Performance":
      return "perf";
    default:
      return "balanced";
  }
}

function paramToNoise(value: string | null): NoiseProfile {
  switch ((value || "").toLowerCase()) {
    case "quiet":
      return "Quiet";
    case "perf":
      return "Performance";
    default:
      return "Balanced";
  }
}

function parseBudgetParam(value: string | null, maxBudget: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 1500;
  return clamp(parsed, budgetMin, maxBudget);
}

function getFanRecommendation(
  caseSize: CaseSize,
  workload: Workload,
  noiseProfile: NoiseProfile
): Recommendation {
  const base = caseSize === "Small Form" ? 2 : caseSize === "Mid Size" ? 3 : caseSize === "Big Tower" ? 4 : 6;
  const extra = workload === "AI/ML" || workload === "Creative" ? 2 : workload === "Gaming" || workload === "Streaming" ? 1 : 0;
  const fanCount = base + extra;
  const noiseNote =
    noiseProfile === "Quiet"
      ? "Use PWM fans and tune for lower RPM to keep noise down."
      : noiseProfile === "Performance"
        ? "Higher RPM improves thermals but increases noise."
        : "Balance airflow and noise with a mild fan curve.";
  return {
    title: `${fanCount}+ case fans (120mm or 140mm)` ,
    description:
      `Front intake + rear/top exhaust keeps GPU and VRM temps in check. ${noiseNote}`,
    amazonQuery: "120mm case fan 3 pack"
  };
}

function pickByBudget(list: Recommendation[], band: BudgetBand): Recommendation[] {
  if (list.length <= 1) return list;
  if (band === "Entry") return list.slice(0, 1);
  if (band === "Midrange") return list.slice(0, Math.min(2, list.length));
  if (band === "High-End") {
    if (list.length >= 3) return list.slice(1, 3);
    return list.slice(0, Math.min(2, list.length));
  }
  return list.length >= 3 ? list.slice(Math.max(list.length - 3, 0)) : list;
}

function tagRecommendations(items: Recommendation[], band: BudgetBand): TaggedRecommendation[] {
  if (items.length === 0) return [];
  const tagged: TaggedRecommendation[] = items.map((item) => ({ ...item }));
  if (items.length === 1) {
    tagged[0].badge = "Best Value";
    tagged[0].badgeTone = "value";
    return tagged;
  }

  tagged[0].badge = "Best Value";
  tagged[0].badgeTone = "value";
  const lastIndex = items.length - 1;
  tagged[lastIndex].badge = band === "Enthusiast" ? "Max Performance" : "Performance";
  tagged[lastIndex].badgeTone = "performance";
  if (items.length > 2) {
    const midIndex = Math.floor(items.length / 2);
    if (!tagged[midIndex].badge) {
      tagged[midIndex].badge = "Balanced";
      tagged[midIndex].badgeTone = "balanced";
    }
  }
  return tagged;
}

export function PCBuildInteractive({ className }: { className?: string }) {
  const [selectedCase, setSelectedCase] = useState<CaseSize>("Mid Size");
  const [selectedWorkload, setSelectedWorkload] = useState<Workload>("Gaming");
  const [gpuNeeded, setGpuNeeded] = useState<boolean>(true);
  const [cpuPlatform, setCpuPlatform] = useState<CpuPlatform>("No Preference");
  const [storageProfile, setStorageProfile] = useState<StorageProfile>("Balanced");
  const [noiseProfile, setNoiseProfile] = useState<NoiseProfile>("Balanced");
  const [budgetTarget, setBudgetTarget] = useState<number>(1500);
  const [overkillMode, setOverkillMode] = useState<boolean>(false);
  const [gpuLengthMm, setGpuLengthMm] = useState<string>("");
  const [caseClearanceMm, setCaseClearanceMm] = useState<string>("");
  const [shareUrl, setShareUrl] = useState<string>("");
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [mounted, setMounted] = useState(false);

  const budgetBand = useMemo(() => getBudgetBand(budgetTarget), [budgetTarget]);
  const budgetMax = overkillMode ? budgetMaxOverkill : budgetMaxStandard;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setSelectedCase(paramToCase(params.get("case")));
    setSelectedWorkload(paramToWorkload(params.get("workload")));
    setGpuNeeded(params.get("gpu") !== "0");
    setCpuPlatform(paramToPlatform(params.get("platform")));
    setStorageProfile(paramToStorage(params.get("storage")));
    setNoiseProfile(paramToNoise(params.get("noise")));
    setBudgetTarget(parseBudgetParam(params.get("budget"), budgetMaxOverkill));
    setOverkillMode(params.get("overkill") === "1");
    setGpuLengthMm(params.get("gpuLen") ?? "");
    setCaseClearanceMm(params.get("caseClear") ?? "");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!overkillMode && budgetTarget > budgetMaxStandard) {
      setBudgetTarget(budgetMaxStandard);
    }
  }, [mounted, overkillMode, budgetTarget]);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("case", caseToParam(selectedCase));
    url.searchParams.set("workload", workloadToParam(selectedWorkload));
    url.searchParams.set("gpu", gpuNeeded ? "1" : "0");
    url.searchParams.set("platform", platformToParam(cpuPlatform));
    url.searchParams.set("storage", storageToParam(storageProfile));
    url.searchParams.set("noise", noiseToParam(noiseProfile));
    url.searchParams.set("budget", String(budgetTarget));
    if (overkillMode) {
      url.searchParams.set("overkill", "1");
    } else {
      url.searchParams.delete("overkill");
    }
    if (gpuLengthMm.trim()) {
      url.searchParams.set("gpuLen", gpuLengthMm.trim());
    } else {
      url.searchParams.delete("gpuLen");
    }

    if (caseClearanceMm.trim()) {
      url.searchParams.set("caseClear", caseClearanceMm.trim());
    } else {
      url.searchParams.delete("caseClear");
    }

    window.history.replaceState({}, "", url.toString());
    setShareUrl(url.toString());
  }, [
    mounted,
    selectedCase,
    selectedWorkload,
    gpuNeeded,
    cpuPlatform,
    storageProfile,
    noiseProfile,
    budgetTarget,
    overkillMode,
    gpuLengthMm,
    caseClearanceMm
  ]);

  const caseDetail = useMemo(
    () => caseOptions.find((option) => option.value === selectedCase) ?? caseOptions[1],
    [selectedCase]
  );

  const workloadDetail = useMemo(
    () => workloadOptions.find((option) => option.value === selectedWorkload) ?? workloadOptions[0],
    [selectedWorkload]
  );

  const fanRecommendation = useMemo(
    () => getFanRecommendation(selectedCase, selectedWorkload, noiseProfile),
    [selectedCase, selectedWorkload, noiseProfile]
  );

  const psuFormFactorNote = useMemo(() => {
    if (selectedCase === "Small Form") {
      return "Small form builds often require SFX or SFX-L power supplies. Confirm PSU length in the case specs.";
    }
    return "Most mid and full towers support standard ATX power supplies. Check depth if using a long GPU.";
  }, [selectedCase]);

  const recommendedCooling = useMemo(() => {
    if (noiseProfile === "Quiet") return "Heatsink (Air)";
    if (noiseProfile === "Performance") {
      return selectedWorkload === "AI/ML" || selectedWorkload === "Creative" ? "Custom Water" : "AIO Liquid";
    }
    return selectedWorkload === "AI/ML" || selectedWorkload === "Creative" ? "AIO Liquid" : "Heatsink (Air)";
  }, [noiseProfile, selectedWorkload]);

  const chipsetRecommendations = useMemo(() => {
    const amd: Recommendation[] = [
      {
        title: "B650 / B650E",
        description: "Balanced AM5 chipset with solid VRMs and PCIe 4.0 for most builds.",
        amazonQuery: "B650 motherboard"
      },
      {
        title: "X670 / X670E",
        description: "More PCIe lanes and I/O for high-end or expansion-heavy builds.",
        amazonQuery: "X670 motherboard"
      }
    ];

    const intel: Recommendation[] = [
      {
        title: "B760",
        description: "Best value for LGA1700 builds without heavy overclocking needs.",
        amazonQuery: "B760 motherboard"
      },
      {
        title: "Z790",
        description: "More tuning headroom, better power delivery, and extra I/O.",
        amazonQuery: "Z790 motherboard"
      }
    ];

    if (cpuPlatform === "AMD AM5") return { title: "AMD AM5 chipsets", items: amd };
    if (cpuPlatform === "Intel LGA1700") return { title: "Intel LGA1700 chipsets", items: intel };
    return {
      title: "Chipsets to consider",
      items: [...amd, ...intel]
    };
  }, [cpuPlatform]);

  const storageRecommendations = useMemo(() => {
    switch (storageProfile) {
      case "Speed First":
        return [
          {
            title: "1-2TB NVMe Gen4 OS + Apps",
            description: "Fast boot and load times with strong sustained performance.",
            amazonQuery: "2TB NVMe Gen4 SSD"
          },
          {
            title: "1-2TB NVMe Gen4 Scratch",
            description: "Dedicated scratch for caches, renders, and builds.",
            amazonQuery: "1TB NVMe Gen4 SSD"
          }
        ];
      case "Capacity First":
        return [
          {
            title: "1TB NVMe OS drive",
            description: "Quick OS and app launches.",
            amazonQuery: "1TB NVMe SSD"
          },
          {
            title: "4-8TB SATA SSD or HDD",
            description: "Large library storage for games, media, or backups.",
            amazonQuery: "4TB SATA SSD"
          }
        ];
      case "Creator/Project":
        return [
          {
            title: "1TB NVMe OS drive",
            description: "Keep OS and apps isolated for stability.",
            amazonQuery: "1TB NVMe SSD"
          },
          {
            title: "2TB NVMe project drive",
            description: "Fast read/write for active projects.",
            amazonQuery: "2TB NVMe Gen4 SSD"
          },
          {
            title: "4TB archive drive",
            description: "For finished projects and backups.",
            amazonQuery: "4TB SATA HDD"
          }
        ];
      case "AI/ML":
        return [
          {
            title: "2-4TB NVMe Gen4",
            description: "Fast dataset and checkpoint access.",
            amazonQuery: "4TB NVMe Gen4 SSD"
          },
          {
            title: "Secondary 2TB NVMe",
            description: "Separate datasets from system drive.",
            amazonQuery: "2TB NVMe SSD"
          }
        ];
      default:
        return [
          {
            title: "1TB NVMe OS + Apps",
            description: "Solid baseline for most builds.",
            amazonQuery: "1TB NVMe SSD"
          },
          {
            title: "2TB NVMe or SATA SSD",
            description: "Room for games, projects, or work files.",
            amazonQuery: "2TB SSD"
          }
        ];
    }
  }, [storageProfile]);

  const recommendations = useMemo(() => {
    const cpu: Recommendation[] = [];
    const ram: Recommendation[] = [];
    const motherboard: Recommendation[] = [];
    const gpu: Recommendation[] = [];
    const psu: Recommendation[] = [];
    const peripherals: Recommendation[] = [];
    const essentials: Recommendation[] = [];

    switch (selectedWorkload) {
      case "Gaming":
        cpu.push(
          {
            title: "Value 6-core",
            description: "Strong FPS per dollar for 1080p and 1440p builds.",
            amazonQuery: "Ryzen 5 7600 CPU"
          },
          {
            title: "Balanced 8-10 core",
            description: "Great all-rounder for gaming + background apps.",
            amazonQuery: "Intel i5 14600K CPU"
          },
          {
            title: "High-FPS 8-core cache",
            description: "Top-tier gaming performance with massive cache.",
            amazonQuery: "Ryzen 7 7800X3D CPU"
          }
        );
        ram.push(
          {
            title: "16 GB DDR5 (2×8)",
            description: "Budget-friendly option for 1080p-first builds.",
            amazonQuery: "16GB DDR5 kit"
          },
          {
            title: "32 GB DDR5 (2×16)",
            description: "Sweet spot for modern games and background apps.",
            amazonQuery: "32GB DDR5 6000 kit"
          }
        );
        if (gpuNeeded) {
          gpu.push(
            {
              title: "Entry GPU (1080p)",
              description: "Great for esports and 1080p high settings.",
              amazonQuery: "RTX 4060 graphics card"
            },
            {
              title: "Midrange GPU (1080p-1440p)",
              description: "Solid gaming performance with balanced price/perf.",
              amazonQuery: "RTX 4060 Ti graphics card"
            },
            {
              title: "High-end GPU (1440p-4K)",
              description: "Best for high refresh and ray tracing at higher resolutions.",
              amazonQuery: "RTX 4070 Super graphics card"
            }
          );
        }
        psu.push({
          title: gpuNeeded ? "650-850W 80+ Gold" : "550-650W 80+ Gold",
          description: "Leaves headroom for GPU spikes and future upgrades.",
          amazonQuery: "750W 80+ Gold power supply"
        });
        peripherals.push(
          {
            title: "High refresh monitor",
            description: "144Hz+ panel for smoother motion.",
            amazonQuery: "144Hz gaming monitor 27 inch"
          },
          {
            title: "Mechanical keyboard + gaming mouse",
            description: "Improved response and comfort for long sessions.",
            amazonQuery: "mechanical keyboard and gaming mouse"
          }
        );
        break;
      case "Creative":
        cpu.push(
          {
            title: "8-core creator CPU",
            description: "Great entry point for video and photo workflows.",
            amazonQuery: "Ryzen 7 7700X CPU"
          },
          {
            title: "12-16 core creator CPU",
            description: "Strong multi-thread for rendering and encoding.",
            amazonQuery: "Ryzen 9 7900X CPU"
          },
          {
            title: "High-end Intel i9",
            description: "Great for mixed single and multi-thread workloads.",
            amazonQuery: "Intel i9 14900K CPU"
          }
        );
        ram.push(
          {
            title: "32 GB DDR5 (2×16)",
            description: "Minimum recommended for content creation.",
            amazonQuery: "32GB DDR5 kit"
          },
          {
            title: "64 GB DDR5 (2×32)",
            description: "Headroom for large timelines and complex scenes.",
            amazonQuery: "64GB DDR5 kit"
          }
        );
        if (gpuNeeded) {
          gpu.push(
            {
              title: "Creator GPU (12-16 GB VRAM)",
              description: "Good value for editing and light 3D scenes.",
              amazonQuery: "RTX 4060 Ti 16GB graphics card"
            },
            {
              title: "GPU with 12-16 GB VRAM",
              description: "Accelerates render and viewport performance.",
              amazonQuery: "RTX 4070 Ti Super graphics card"
            },
            {
              title: "GPU with 20-24 GB VRAM",
              description: "Better for heavy 3D scenes or large textures.",
              amazonQuery: "RTX 4080 graphics card"
            }
          );
        }
        psu.push({
          title: gpuNeeded ? "750-1000W 80+ Gold/Platinum" : "650-750W 80+ Gold",
          description: "Sustains long renders with stable power delivery.",
          amazonQuery: "850W 80+ Gold power supply"
        });
        peripherals.push(
          {
            title: "Color-accurate monitor",
            description: "Look for high sRGB/DCI-P3 coverage.",
            amazonQuery: "color accurate monitor 27 inch"
          },
          {
            title: "Creator keyboard + mouse",
            description: "Ergonomics matter for long sessions.",
            amazonQuery: "ergonomic keyboard mouse combo"
          }
        );
        break;
      case "Development":
        cpu.push(
          {
            title: "Efficient 6-core",
            description: "Great for web and app development on a budget.",
            amazonQuery: "Ryzen 5 7600 CPU"
          },
          {
            title: "Balanced 8-10 core",
            description: "Strong for compiles, containers, and multitasking.",
            amazonQuery: "Intel i5 14600K CPU"
          },
          {
            title: "8-12 core productivity CPU",
            description: "Great for builds, containers, and multitasking.",
            amazonQuery: "Ryzen 7 7700X CPU"
          }
        );
        ram.push(
          {
            title: "32 GB DDR5",
            description: "Enough for Docker, VMs, and IDEs.",
            amazonQuery: "32GB DDR5 kit"
          },
          {
            title: "64 GB DDR5",
            description: "Recommended for heavy VM and data workloads.",
            amazonQuery: "64GB DDR5 kit"
          }
        );
        if (gpuNeeded) {
          gpu.push(
            {
              title: "Entry GPU (compute optional)",
              description: "Enough for GPU-accelerated dev workflows.",
              amazonQuery: "RTX 4060 graphics card"
            },
            {
              title: "Midrange GPU (compute optional)",
              description: "Extra headroom for local AI/graphics testing.",
              amazonQuery: "RTX 4070 graphics card"
            }
          );
        }
        psu.push({
          title: gpuNeeded ? "650-750W 80+ Gold" : "550-650W 80+ Gold",
          description: "Stable power for sustained compiles and multitasking.",
          amazonQuery: "650W 80+ Gold power supply"
        });
        peripherals.push(
          {
            title: "Ultrawide or dual monitors",
            description: "Boosts productivity for code + docs side-by-side.",
            amazonQuery: "ultrawide monitor 34 inch"
          },
          {
            title: "Ergonomic keyboard + mouse",
            description: "Comfort for long coding sessions.",
            amazonQuery: "ergonomic keyboard mouse"
          }
        );
        break;
      case "Work/Office":
        cpu.push(
          {
            title: "Efficient 6-8 core CPU",
            description: "Quiet, cool, and reliable for daily productivity.",
            amazonQuery: "Ryzen 5 7600 CPU"
          },
          {
            title: "Integrated graphics option",
            description: "Avoids discrete GPU cost and power.",
            amazonQuery: "Intel i5 14400 CPU"
          }
        );
        ram.push(
          {
            title: "16 GB DDR5",
            description: "Baseline for office multitasking.",
            amazonQuery: "16GB DDR5 kit"
          },
          {
            title: "32 GB DDR5",
            description: "Extra headroom for heavy spreadsheets or many apps.",
            amazonQuery: "32GB DDR5 kit"
          }
        );
        psu.push({
          title: "450-550W 80+ Bronze/Gold",
          description: "Plenty for integrated graphics builds.",
          amazonQuery: "500W 80+ Gold power supply"
        });
        peripherals.push(
          {
            title: "Dual 27-inch monitors",
            description: "Great for email, spreadsheets, and research.",
            amazonQuery: "27 inch monitor pair"
          },
          {
            title: "Webcam + headset",
            description: "Clean video calls and audio.",
            amazonQuery: "webcam and headset"
          }
        );
        break;
      case "Streaming":
        cpu.push(
          {
            title: "Efficient 6-8 core",
            description: "Solid entry point for single-PC streaming.",
            amazonQuery: "Intel i5 13600K CPU"
          },
          {
            title: "8-12 core CPU",
            description: "Handles game + encoding workloads smoothly.",
            amazonQuery: "Ryzen 7 7800X CPU"
          },
          {
            title: "High-thread Intel i7",
            description: "Extra headroom for scenes, alerts, and multi-cam setups.",
            amazonQuery: "Intel i7 14700K CPU"
          }
        );
        ram.push(
          {
            title: "32 GB DDR5",
            description: "Enough for game + streaming software + browser.",
            amazonQuery: "32GB DDR5 kit"
          },
          {
            title: "64 GB DDR5",
            description: "For multi-scene production and plugins.",
            amazonQuery: "64GB DDR5 kit"
          }
        );
        if (gpuNeeded) {
          gpu.push(
            {
              title: "Entry GPU with strong encoder",
              description: "Great for 1080p streaming + esports gaming.",
              amazonQuery: "RTX 4060 graphics card"
            },
            {
              title: "GPU with strong encoder",
              description: "Hardware encoding keeps streams smooth.",
              amazonQuery: "RTX 4070 graphics card"
            },
            {
              title: "High-end GPU",
              description: "If streaming + high FPS at 1440p/4K.",
              amazonQuery: "RTX 4070 Super graphics card"
            }
          );
        }
        psu.push({
          title: gpuNeeded ? "650-850W 80+ Gold" : "550-650W 80+ Gold",
          description: "Headroom for GPU + capture hardware.",
          amazonQuery: "750W 80+ Gold power supply"
        });
        peripherals.push(
          {
            title: "Broadcast mic + boom arm",
            description: "Clear voice audio for streams.",
            amazonQuery: "USB microphone boom arm"
          },
          {
            title: "Capture card",
            description: "Needed for console or dual-PC setups.",
            amazonQuery: "4K capture card"
          }
        );
        break;
      case "AI/ML":
        cpu.push(
          {
            title: "12-core data prep CPU",
            description: "Strong entry point for local inference pipelines.",
            amazonQuery: "Ryzen 9 7900X CPU"
          },
          {
            title: "High-end Intel i9",
            description: "Strong single and multi-thread performance.",
            amazonQuery: "Intel i9 14900K CPU"
          },
          {
            title: "16-core workstation CPU",
            description: "Keeps data pipelines and preprocessing fast.",
            amazonQuery: "Ryzen 9 7950X CPU"
          }
        );
        ram.push(
          {
            title: "64 GB DDR5",
            description: "Baseline for datasets and multiple environments.",
            amazonQuery: "64GB DDR5 kit"
          },
          {
            title: "128 GB DDR5",
            description: "Recommended for large local models.",
            amazonQuery: "128GB DDR5 kit"
          }
        );
        if (gpuNeeded) {
          gpu.push(
            {
              title: "GPU with 16 GB VRAM",
              description: "Balanced option for local inference and training.",
              amazonQuery: "RTX 4070 Ti Super graphics card"
            },
            {
              title: "GPU with 16-20 GB VRAM",
              description: "More headroom for larger models.",
              amazonQuery: "RTX 4080 graphics card"
            },
            {
              title: "GPU with 16-24 GB VRAM",
              description: "Enables larger models and faster inference.",
              amazonQuery: "RTX 4090 graphics card"
            }
          );
        }
        psu.push({
          title: gpuNeeded ? "850-1200W 80+ Gold/Platinum" : "650-750W 80+ Gold",
          description: "AI workloads can spike power draw quickly.",
          amazonQuery: "1000W 80+ Gold power supply"
        });
        peripherals.push(
          {
            title: "High resolution monitor",
            description: "Better for data and model visualizations.",
            amazonQuery: "4K monitor 32 inch"
          },
          {
            title: "Ergonomic keyboard + mouse",
            description: "Comfort for long training sessions.",
            amazonQuery: "ergonomic keyboard mouse combo"
          }
        );
        break;
    }

    essentials.push(
      {
        title: "Thermal paste",
        description: "Reliable contact between CPU and cooler.",
        amazonQuery: "thermal paste for cpu"
      },
      {
        title: "Toolkit + anti-static strap",
        description: "Safer assembly and easier cable management.",
        amazonQuery: "pc build toolkit anti static"
      },
      {
        title: "USB installer drive",
        description: "Handy for OS installs or BIOS updates.",
        amazonQuery: "usb flash drive 32gb"
      }
    );

    return { cpu, ram, gpu, psu, peripherals, essentials };
  }, [selectedWorkload, gpuNeeded]);

  const overkillRecommendations = useMemo(() => {
    if (!overkillMode) return null;
    const cpu: Recommendation[] = [];
    const ram: Recommendation[] = [];
    const motherboard: Recommendation[] = [];
    const gpu: Recommendation[] = [];
    const psu: Recommendation[] = [];
    const storage: Recommendation[] = [];
    const enterpriseStorage: Recommendation[] = [];
    const cooling: Recommendation[] = [];
    const networking: Recommendation[] = [];
    const extras: string[] = [];

    if (cpuPlatform === "AMD AM5") {
      cpu.push({
        title: "Flagship AMD CPU",
        description: "Maximum cache + cores for long-term headroom.",
        amazonQuery: "Ryzen 9 7950X3D CPU"
      });
      cpu.push({
        title: "AMD Threadripper workstation",
        description: "Huge core counts and PCIe lanes for heavy workloads.",
        amazonQuery: "AMD Threadripper CPU"
      });
      motherboard.push({
        title: "X670E premium motherboard",
        description: "High-end AM5 boards with strong VRMs and Gen5 storage.",
        amazonQuery: "X670E motherboard"
      });
      motherboard.push({
        title: "Threadripper workstation board",
        description: "Massive PCIe lanes for GPUs and NVMe arrays.",
        amazonQuery: "TRX50 motherboard"
      });
    } else if (cpuPlatform === "Intel LGA1700") {
      cpu.push({
        title: "Flagship Intel CPU",
        description: "Top-end clocks with strong multi-thread performance.",
        amazonQuery: "Intel i9 14900KS CPU"
      });
      cpu.push({
        title: "Intel Xeon workstation",
        description: "Workstation-class stability and core counts.",
        amazonQuery: "Intel Xeon W CPU"
      });
      motherboard.push({
        title: "Z790 premium motherboard",
        description: "Strong VRMs, PCIe Gen5, and high-end connectivity.",
        amazonQuery: "Z790 motherboard"
      });
      motherboard.push({
        title: "Xeon workstation board",
        description: "Workstation chipset with enterprise reliability.",
        amazonQuery: "Intel W790 motherboard"
      });
    } else {
      cpu.push(
        {
          title: "Flagship AMD CPU",
          description: "Maximum cache + cores for longevity.",
          amazonQuery: "Ryzen 9 7950X3D CPU"
        },
        {
          title: "AMD Threadripper workstation",
          description: "Huge core counts and PCIe lanes for heavy workloads.",
          amazonQuery: "AMD Threadripper CPU"
        },
        {
          title: "Flagship Intel CPU",
          description: "Top-end clocks with strong multi-thread performance.",
          amazonQuery: "Intel i9 14900KS CPU"
        },
        {
          title: "Intel Xeon workstation",
          description: "Workstation-class stability and core counts.",
          amazonQuery: "Intel Xeon W CPU"
        }
      );
      motherboard.push(
        {
          title: "X670E premium motherboard",
          description: "High-end AM5 boards with strong VRMs and Gen5 storage.",
          amazonQuery: "X670E motherboard"
        },
        {
          title: "TRX50 workstation board",
          description: "Massive PCIe lanes for GPUs and NVMe arrays.",
          amazonQuery: "TRX50 motherboard"
        },
        {
          title: "Z790 premium motherboard",
          description: "Strong VRMs, PCIe Gen5, and high-end connectivity.",
          amazonQuery: "Z790 motherboard"
        },
        {
          title: "W790 workstation board",
          description: "Workstation chipset with enterprise reliability.",
          amazonQuery: "Intel W790 motherboard"
        }
      );
    }

    if (selectedWorkload === "AI/ML") {
      ram.push(
        {
          title: "128 GB DDR5",
          description: "Better for large datasets and multi-env workflows.",
          amazonQuery: "128GB DDR5 kit"
        },
        {
          title: "192 GB DDR5 (if supported)",
          description: "Max out memory for local training and large models.",
          amazonQuery: "192GB DDR5 kit"
        }
      );
    } else {
      ram.push(
        {
          title: "64 GB DDR5",
          description: "Futureproof for next-gen games and heavy multitasking.",
          amazonQuery: "64GB DDR5 kit"
        },
        {
          title: "128 GB DDR5",
          description: "Overkill headroom for content creation and VMs.",
          amazonQuery: "128GB DDR5 kit"
        }
      );
    }

    ram.push({
      title: "ECC DDR5 (workstation option)",
      description: "Extra stability for critical workloads (requires compatible board/CPU).",
      amazonQuery: "ECC DDR5 memory"
    });

    if (gpuNeeded) {
      gpu.push(
        {
          title: "Flagship GPU (24 GB VRAM)",
          description: "Best-in-class performance and longevity.",
          amazonQuery: "RTX 4090 graphics card"
        },
        {
          title: "Workstation-class GPU",
          description: "Built for stability and long-term driver support.",
          amazonQuery: "RTX 6000 Ada graphics card"
        }
      );
    }

    psu.push({
      title: "1200-1600W 80+ Platinum/Titanium",
      description: "Handles peak spikes, dual upgrades, and silent fan curves.",
      amazonQuery: "1200W 80+ Platinum power supply"
    });
    psu.push({
      title: "Redundant workstation PSU (if supported)",
      description: "Enterprise-grade redundancy for uptime-critical builds.",
      amazonQuery: "redundant power supply workstation"
    });

    storage.push(
      {
        title: "4-8TB NVMe Gen4/Gen5 (Primary)",
        description: "Massive headroom for OS, apps, and active projects.",
        amazonQuery: "8TB NVMe SSD"
      },
      {
        title: "4-8TB secondary SSD/HDD",
        description: "Cold storage for archives and backups.",
        amazonQuery: "8TB HDD"
      }
    );

    enterpriseStorage.push(
      {
        title: "U.2/U.3 enterprise NVMe",
        description: "High endurance and consistent performance.",
        amazonQuery: "U.2 NVMe SSD"
      },
      {
        title: "Hardware RAID card",
        description: "For redundant arrays and sustained throughput.",
        amazonQuery: "hardware RAID controller PCIe"
      },
      {
        title: "Hot-swap drive bay",
        description: "Easier swaps and expansion for storage arrays.",
        amazonQuery: "hot swap drive bay"
      }
    );

    cooling.push(
      {
        title: "420mm AIO or Custom Loop",
        description: "Maximum thermal headroom for flagship CPUs.",
        amazonQuery: "420mm AIO liquid cooler"
      },
      {
        title: "Premium case fans (quiet high airflow)",
        description: "Lower noise at higher airflow.",
        amazonQuery: "premium PWM case fans"
      }
    );

    networking.push(
      {
        title: "10GbE NIC (PCIe)",
        description: "Fast LAN for large asset transfers and NAS workflows.",
        amazonQuery: "10GbE PCIe network card"
      },
      {
        title: "Wi-Fi 7 card (if needed)",
        description: "Latest wireless standard for high-throughput environments.",
        amazonQuery: "Wi-Fi 7 PCIe card"
      }
    );

    extras.push(
      "Add a UPS for clean shutdowns during power loss.",
      "Consider a PCIe Gen5 NVMe if your motherboard supports it.",
      "Budget for a quality surge protector and extra thermal paste.",
      "If you need ECC memory or more PCIe lanes, consider a workstation platform (Threadripper / Xeon)."
    );

    return {
      cpu,
      ram,
      gpu,
      psu,
      storage,
      cooling,
      extras,
      motherboard,
      networking,
      enterpriseStorage
    };
  }, [overkillMode, cpuPlatform, gpuNeeded, selectedWorkload]);

  const buildSummary = useMemo(() => {
    const summary = [
      `Budget target: $${budgetTarget} (${budgetBand})`,
      `Futureproof mode: ${overkillMode ? `Enabled (target $8000-$${budgetMaxOverkill})` : "Off"}`,
      `Noise profile: ${noiseProfile}`,
      `Case size: ${selectedCase}`,
      `Motherboard form factors: ${caseDetail.formFactors.map((f) => f.name).join(", ")}`,
      `CPU platform: ${cpuPlatform}`,
      `Workload: ${selectedWorkload}`,
      `Dedicated GPU: ${gpuNeeded ? "Yes" : "No"}`,
      `Storage profile: ${storageProfile}`,
      `Cooling: ${recommendedCooling}`,
      `Case fans: ${fanRecommendation.title}`,
      `PSU guidance: ${recommendations.psu.map((item) => item.title).join(" or ")}`
    ];

    if (gpuLengthMm.trim() || caseClearanceMm.trim()) {
      summary.push(`GPU length: ${gpuLengthMm || "?"} mm`);
      summary.push(`Case GPU clearance: ${caseClearanceMm || "?"} mm`);
    }

    return summary.join("\n");
  }, [
    budgetTarget,
    budgetBand,
    noiseProfile,
    selectedCase,
    caseDetail,
    cpuPlatform,
    selectedWorkload,
    gpuNeeded,
    storageProfile,
    recommendedCooling,
    fanRecommendation,
    recommendations.psu,
    overkillMode,
    gpuLengthMm,
    caseClearanceMm
  ]);

  const gpuFitStatus = useMemo(() => {
    const gpuLen = Number(gpuLengthMm);
    const caseClear = Number(caseClearanceMm);
    if (!Number.isFinite(gpuLen) || !Number.isFinite(caseClear) || gpuLen <= 0 || caseClear <= 0) {
      return null;
    }
    const diff = caseClear - gpuLen;
    if (diff >= 0) {
      return {
        fits: true,
        message: `Fits with ${diff.toFixed(0)} mm clearance.`
      };
    }
    return {
      fits: false,
      message: `Too long by ${Math.abs(diff).toFixed(0)} mm. Consider a shorter GPU or larger case.`
    };
  }, [gpuLengthMm, caseClearanceMm]);

  async function copyText(value: string): Promise<boolean> {
    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) return false;
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      return false;
    }
  }

  async function handleCopySummary() {
    const success = await copyText(buildSummary);
    if (!success) return;
    setCopiedSummary(true);
    window.setTimeout(() => setCopiedSummary(false), 1500);
  }

  async function handleCopyLink() {
    if (!shareUrl) return;
    const success = await copyText(shareUrl);
    if (!success) return;
    setCopiedLink(true);
    window.setTimeout(() => setCopiedLink(false), 1500);
  }

  function handleReset() {
    setSelectedCase("Mid Size");
    setSelectedWorkload("Gaming");
    setGpuNeeded(true);
    setCpuPlatform("No Preference");
    setStorageProfile("Balanced");
    setNoiseProfile("Balanced");
    setBudgetTarget(1500);
    setOverkillMode(false);
    setGpuLengthMm("");
    setCaseClearanceMm("");
  }

  const cpuOptions = tagRecommendations(pickByBudget(recommendations.cpu, budgetBand), budgetBand);
  const ramOptions = tagRecommendations(pickByBudget(recommendations.ram, budgetBand), budgetBand);
  const gpuOptions = tagRecommendations(pickByBudget(recommendations.gpu, budgetBand), budgetBand);
  const psuOptions = tagRecommendations(pickByBudget(recommendations.psu, budgetBand), budgetBand);
  const storageOptionsTagged = tagRecommendations(pickByBudget(storageRecommendations, budgetBand), budgetBand);
  const essentialsTagged = tagRecommendations(pickByBudget(recommendations.essentials, budgetBand), budgetBand);
  const peripheralsTagged = tagRecommendations(pickByBudget(recommendations.peripherals, budgetBand), budgetBand);
  const selectionTally = [
    { label: "Case size", value: selectedCase },
    { label: "Form factors", value: caseDetail.formFactors.map((factor) => factor.name).join(", ") },
    { label: "Workload", value: selectedWorkload },
    { label: "CPU platform", value: cpuPlatform },
    { label: "Budget target", value: `$${budgetTarget} (${budgetBand})` },
    { label: "Noise profile", value: noiseProfile },
    { label: "Storage profile", value: storageProfile },
    { label: "Dedicated GPU", value: gpuNeeded ? "Yes" : "No" },
    { label: "Overkill mode", value: overkillMode ? "Enabled" : "Off" },
    { label: "Cooling", value: recommendedCooling }
  ];

  return (
    <section className={classNames("surface-card-strong p-6 sm:p-8 lg:p-10", className)}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Interactive PC Builder
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">
            Build recommendations based on your case and workload
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
            Choose a case size and primary workload to get motherboard sizing, chipsets, CPU, RAM,
            GPU, PSU, storage, cooling, and peripherals with Amazon affiliate links.
          </p>
        </div>
        <div className="rounded-xl border border-amber-200/80 bg-amber-50/70 px-4 py-3 text-xs text-amber-800 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-200">
          <p className="font-semibold">Affiliate Disclosure</p>
          <p className="mt-1 leading-6">
            Amazon links are affiliate links. If you purchase through them, this site may earn a
            commission at no extra cost to you.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-line/70 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Step 1
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Choose the case size
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {caseOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedCase(option.value)}
                className={classNames(
                  "rounded-xl border px-4 py-3 text-left transition",
                  selectedCase === option.value
                    ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                    : "border-line/70 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700"
                )}
              >
                <p className="text-sm font-semibold">{option.value}</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{option.summary}</p>
              </button>
            ))}
          </div>
          <a
            href={buildAmazonSearchLink(caseDetail.amazonQuery)}
            target="_blank"
            rel="sponsored nofollow noreferrer"
            className="mt-4 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800 transition hover:border-amber-300 hover:bg-amber-100 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200"
          >
            Amazon case options
          </a>
            </div>

            <div className="rounded-2xl border border-line/70 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Step 2
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Primary workload
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {workloadOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setSelectedWorkload(option.value);
                  if (option.value === "Work/Office") {
                    setGpuNeeded(false);
                  }
                }}
                className={classNames(
                  "rounded-xl border px-4 py-3 text-left transition",
                  selectedWorkload === option.value
                    ? "border-cyan-900 bg-cyan-900 text-white dark:border-cyan-200 dark:bg-cyan-200 dark:text-slate-900"
                    : "border-line/70 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700"
                )}
              >
                <p className="text-sm font-semibold">{option.value}</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{option.summary}</p>
              </button>
            ))}
          </div>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-line/70 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Step 3
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Budget target
          </h3>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            This tunes how aggressive the value-focused picks are for your workload.
          </p>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
              <span>${budgetMin}</span>
              <span>${budgetMax}</span>
            </div>
            <input
              type="range"
              min={budgetMin}
              max={budgetMax}
              step={budgetStep}
              value={budgetTarget}
              onChange={(event) => setBudgetTarget(Number(event.target.value))}
              className="mt-2 w-full"
            />
            <div className="mt-3 rounded-xl border border-line/70 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Budget target: ${budgetTarget}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Band: {budgetBand}
              </p>
              {!overkillMode ? (
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  Enable overkill to unlock budgets up to ${budgetMaxOverkill}.
                </p>
              ) : null}
            </div>
          </div>
            </div>

            <div className="rounded-2xl border border-line/70 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Step 4
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Noise profile</h3>
          <div className="mt-4 grid gap-3">
            {noiseOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setNoiseProfile(option.value)}
                className={classNames(
                  "rounded-xl border px-4 py-3 text-left transition",
                  noiseProfile === option.value
                    ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                    : "border-line/70 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700"
                )}
              >
                <p className="text-sm font-semibold">{option.value}</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{option.summary}</p>
              </button>
            ))}
          </div>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-line/70 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Step 5
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            CPU platform preference
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {cpuPlatformOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setCpuPlatform(option.value)}
                className={classNames(
                  "rounded-xl border px-4 py-3 text-left transition",
                  cpuPlatform === option.value
                    ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                    : "border-line/70 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700"
                )}
              >
                <p className="text-sm font-semibold">{option.value}</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{option.summary}</p>
              </button>
            ))}
          </div>
            </div>

            <div className="rounded-2xl border border-line/70 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Optional
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Futureproof / overkill mode ($8000+)
          </h3>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Uses flagship parts, maximum headroom, and long-term upgrade runway.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setOverkillMode(true);
                setGpuNeeded(true);
                setBudgetTarget(Math.max(overkillSuggestedBudget, budgetTarget, budgetMaxStandard));
              }}
              className={classNames(
                "rounded-full border px-4 py-2 text-xs font-semibold transition",
                overkillMode
                  ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                  : "border-line/70 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              )}
            >
              Enable
            </button>
            <button
              type="button"
              onClick={() => {
                setOverkillMode(false);
                if (budgetTarget > budgetMaxStandard) {
                  setBudgetTarget(budgetMaxStandard);
                }
              }}
              className={classNames(
                "rounded-full border px-4 py-2 text-xs font-semibold transition",
                !overkillMode
                  ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                  : "border-line/70 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              )}
            >
              Standard
            </button>
          </div>
            </div>

            <div className="rounded-2xl border border-line/70 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Step 6
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                Dedicated GPU needed?
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Turn this off for office or light dev builds using integrated graphics.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setGpuNeeded(true)}
                className={classNames(
                  "rounded-full border px-4 py-2 text-xs font-semibold transition",
                  gpuNeeded
                    ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                    : "border-line/70 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                )}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setGpuNeeded(false)}
                className={classNames(
                  "rounded-full border px-4 py-2 text-xs font-semibold transition",
                  !gpuNeeded
                    ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                    : "border-line/70 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                )}
              >
                No
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="mt-3 inline-flex items-center rounded-full border border-line/70 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            Reset selections
          </button>
            </div>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-line/70 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Motherboard sizing + chipsets
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Match the motherboard size to your case. Chipsets depend on CPU platform and expansion needs.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {caseDetail.formFactors.map((factor) => (
              <div
                key={factor.name}
                className="rounded-xl border border-line/70 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {factor.name}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {factor.inches} · {factor.millimeters}
                </p>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{factor.guidance}</p>
                <a
                  href={buildAmazonSearchLink(factor.amazonQuery)}
                  target="_blank"
                  rel="sponsored nofollow noreferrer"
                  className="mt-3 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800 transition hover:border-amber-300 hover:bg-amber-100 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200"
                >
                  Amazon options
                </a>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-line/70 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              {chipsetRecommendations.title}
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {chipsetRecommendations.items.map((chipset) => (
                <div
                  key={chipset.title}
                  className="rounded-xl border border-line/70 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-950/60"
                >
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {chipset.title}
                  </p>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{chipset.description}</p>
                  <a
                    href={buildAmazonSearchLink(chipset.amazonQuery)}
                    target="_blank"
                    rel="sponsored nofollow noreferrer"
                    className="mt-3 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800 transition hover:border-amber-300 hover:bg-amber-100 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200"
                  >
                    Amazon options
                  </a>
                </div>
              ))}
            </div>
          </div>
            </div>

            <div className="rounded-2xl border border-line/70 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Cooling options</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Pick the cooling strategy that matches your noise, budget, and performance goals.
          </p>
          <div className="mt-4 space-y-3">
            {coolingOptions.map((option) => {
              const isRecommended = option.title === recommendedCooling;
              return (
                <div
                  key={option.title}
                  className={classNames(
                    "rounded-xl border px-4 py-3 text-sm",
                    isRecommended
                      ? "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100"
                      : "border-line/70 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{option.title}</p>
                    {isRecommended ? (
                      <span className="rounded-full border border-emerald-400 bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                        Recommended
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-xs">{option.description}</p>
                  <a
                    href={buildAmazonSearchLink(option.amazonQuery)}
                    target="_blank"
                    rel="sponsored nofollow noreferrer"
                    className={classNames(
                      "mt-3 inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold transition",
                      isRecommended
                        ? "border-emerald-400 bg-emerald-100 text-emerald-700 hover:border-emerald-500 hover:bg-emerald-200 dark:border-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200"
                        : "border-amber-200 bg-amber-50 text-amber-800 hover:border-amber-300 hover:bg-amber-100 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200"
                    )}
                  >
                    Amazon options
                  </a>
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-xl border border-line/70 bg-slate-50 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Case fan guidance</p>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{fanRecommendation.description}</p>
            <a
              href={buildAmazonSearchLink(fanRecommendation.amazonQuery)}
              target="_blank"
              rel="sponsored nofollow noreferrer"
              className="mt-3 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800 transition hover:border-amber-300 hover:bg-amber-100 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200"
            >
              {fanRecommendation.title}
            </a>
          </div>
            </div>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-line/70 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Step 7
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Storage plan</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {storageOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStorageProfile(option.value)}
                className={classNames(
                  "rounded-xl border px-4 py-3 text-left transition",
                  storageProfile === option.value
                    ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                    : "border-line/70 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700"
                )}
              >
                <p className="text-sm font-semibold">{option.value}</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{option.summary}</p>
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-3">
            {storageOptionsTagged.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-line/70 bg-slate-50 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                  {item.badge ? (
                    <span
                      className={classNames(
                        "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
                        badgeClass(item.badgeTone)
                      )}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{item.description}</p>
                <a
                  href={buildAmazonSearchLink(item.amazonQuery)}
                  target="_blank"
                  rel="sponsored nofollow noreferrer"
                  className="mt-3 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800 transition hover:border-amber-300 hover:bg-amber-100 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200"
                >
                  Amazon options
                </a>
              </div>
            ))}
          </div>
            </div>

            <div className="rounded-2xl border border-line/70 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">CPU</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{workloadDetail.summary}</p>
          <div className="mt-4 space-y-3">
            {cpuOptions.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-line/70 bg-slate-50 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                  {item.badge ? (
                    <span
                      className={classNames(
                        "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
                        badgeClass(item.badgeTone)
                      )}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{item.description}</p>
                <a
                  href={buildAmazonSearchLink(item.amazonQuery)}
                  target="_blank"
                  rel="sponsored nofollow noreferrer"
                  className="mt-3 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800 transition hover:border-amber-300 hover:bg-amber-100 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200"
                >
                  Amazon options
                </a>
              </div>
            ))}
          </div>
            </div>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-line/70 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">RAM</h3>
          <div className="mt-4 space-y-3">
            {ramOptions.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-line/70 bg-slate-50 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                  {item.badge ? (
                    <span
                      className={classNames(
                        "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
                        badgeClass(item.badgeTone)
                      )}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{item.description}</p>
                <a
                  href={buildAmazonSearchLink(item.amazonQuery)}
                  target="_blank"
                  rel="sponsored nofollow noreferrer"
                  className="mt-3 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800 transition hover:border-amber-300 hover:bg-amber-100 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200"
                >
                  Amazon options
                </a>
              </div>
            ))}
          </div>
            </div>

            <div className="rounded-2xl border border-line/70 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">GPU</h3>
          {gpuNeeded && gpuOptions.length > 0 ? (
            <div className="mt-4 space-y-3">
              {gpuOptions.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-line/70 bg-slate-50 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                    {item.badge ? (
                      <span
                        className={classNames(
                          "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
                          badgeClass(item.badgeTone)
                        )}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{item.description}</p>
                  <a
                    href={buildAmazonSearchLink(item.amazonQuery)}
                    target="_blank"
                    rel="sponsored nofollow noreferrer"
                    className="mt-3 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800 transition hover:border-amber-300 hover:bg-amber-100 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200"
                  >
                    Amazon options
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-line/70 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              Integrated graphics are fine for this workload. Add a GPU only if you need gaming,
              rendering, or AI acceleration.
            </div>
          )}
        </div>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-line/70 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Power Supply</h3>
          <div className="mt-4 space-y-3">
            {psuOptions.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-line/70 bg-slate-50 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                  {item.badge ? (
                    <span
                      className={classNames(
                        "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
                        badgeClass(item.badgeTone)
                      )}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{item.description}</p>
                <a
                  href={buildAmazonSearchLink(item.amazonQuery)}
                  target="_blank"
                  rel="sponsored nofollow noreferrer"
                  className="mt-3 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800 transition hover:border-amber-300 hover:bg-amber-100 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200"
                >
                  Amazon options
                </a>
              </div>
            ))}
            <p className="text-xs text-slate-500 dark:text-slate-400">{psuFormFactorNote}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Add 100-200W of headroom for GPU spikes, upgrades, and quieter fan curves.
            </p>
          </div>
            </div>

            <div className="rounded-2xl border border-line/70 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">GPU clearance check</h3>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Check the GPU length in the card specs and your case GPU clearance (mm). If using a front
            radiator, subtract its thickness from clearance.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="text-xs text-slate-500 dark:text-slate-400">
              GPU length (mm)
              <input
                type="number"
                inputMode="numeric"
                value={gpuLengthMm}
                onChange={(event) => setGpuLengthMm(event.target.value)}
                className="mt-1 w-full rounded-lg border border-line/70 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder="e.g., 320"
              />
            </label>
            <label className="text-xs text-slate-500 dark:text-slate-400">
              Case clearance (mm)
              <input
                type="number"
                inputMode="numeric"
                value={caseClearanceMm}
                onChange={(event) => setCaseClearanceMm(event.target.value)}
                className="mt-1 w-full rounded-lg border border-line/70 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder="e.g., 340"
              />
            </label>
          </div>
          {gpuFitStatus ? (
            <p
              className={classNames(
                "mt-3 text-xs font-semibold",
                gpuFitStatus.fits ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"
              )}
            >
              {gpuFitStatus.message}
            </p>
          ) : (
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Enter both values to validate fit.</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={buildAmazonSearchLink("compact graphics card")}
              target="_blank"
              rel="sponsored nofollow noreferrer"
              className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800 transition hover:border-amber-300 hover:bg-amber-100 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200"
            >
              Compact GPU options
            </a>
            <a
              href={buildAmazonSearchLink("gpu support bracket")}
              target="_blank"
              rel="sponsored nofollow noreferrer"
              className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800 transition hover:border-amber-300 hover:bg-amber-100 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200"
            >
              GPU support bracket
            </a>
          </div>
            </div>
          </div>

          {overkillMode && overkillRecommendations ? (
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-rose-200/80 bg-rose-50/60 p-5 dark:border-rose-900/50 dark:bg-rose-950/30">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-100">
                Overkill upgrades (core parts)
              </h3>
              <span className="rounded-full border border-rose-300 bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:border-rose-800 dark:bg-rose-900/40 dark:text-rose-200">
                Futureproof tier
              </span>
            </div>
            <div className="mt-4 space-y-4">
              {[
                { title: "CPU", items: overkillRecommendations.cpu },
                { title: "Motherboard", items: overkillRecommendations.motherboard },
                { title: "RAM", items: overkillRecommendations.ram },
                ...(gpuNeeded ? [{ title: "GPU", items: overkillRecommendations.gpu }] : [])
              ].map((block) => (
                <div key={block.title} className="rounded-xl border border-rose-200/80 bg-white px-4 py-3 dark:border-rose-900/60 dark:bg-rose-950/40">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-500 dark:text-rose-300">
                    {block.title}
                  </p>
                  <div className="mt-3 space-y-3">
                    {block.items.map((item) => (
                      <div key={item.title} className="text-sm">
                        <p className="text-sm font-semibold text-rose-900 dark:text-rose-100">{item.title}</p>
                        <p className="mt-1 text-xs text-rose-700/80 dark:text-rose-200/80">{item.description}</p>
                        <a
                          href={buildAmazonSearchLink(item.amazonQuery)}
                          target="_blank"
                          rel="sponsored nofollow noreferrer"
                          className="mt-2 inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-semibold text-rose-800 transition hover:border-rose-300 hover:bg-rose-100 dark:border-rose-900/70 dark:bg-rose-950/50 dark:text-rose-200"
                        >
                          Amazon options
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

              <div className="rounded-2xl border border-rose-200/80 bg-rose-50/60 p-5 dark:border-rose-900/50 dark:bg-rose-950/30">
            <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-100">Overkill upgrades (system)</h3>
            <div className="mt-4 space-y-4">
              {[
                { title: "Power", items: overkillRecommendations.psu },
                { title: "Storage", items: overkillRecommendations.storage },
                { title: "Enterprise storage", items: overkillRecommendations.enterpriseStorage },
                { title: "Cooling", items: overkillRecommendations.cooling },
                { title: "Networking", items: overkillRecommendations.networking }
              ].map((block) => (
                <div key={block.title} className="rounded-xl border border-rose-200/80 bg-white px-4 py-3 dark:border-rose-900/60 dark:bg-rose-950/40">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-500 dark:text-rose-300">
                    {block.title}
                  </p>
                  <div className="mt-3 space-y-3">
                    {block.items.map((item) => (
                      <div key={item.title} className="text-sm">
                        <p className="text-sm font-semibold text-rose-900 dark:text-rose-100">{item.title}</p>
                        <p className="mt-1 text-xs text-rose-700/80 dark:text-rose-200/80">{item.description}</p>
                        <a
                          href={buildAmazonSearchLink(item.amazonQuery)}
                          target="_blank"
                          rel="sponsored nofollow noreferrer"
                          className="mt-2 inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-semibold text-rose-800 transition hover:border-rose-300 hover:bg-rose-100 dark:border-rose-900/70 dark:bg-rose-950/50 dark:text-rose-200"
                        >
                          Amazon options
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="rounded-xl border border-rose-200/80 bg-white px-4 py-3 text-xs text-rose-700/80 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200/80">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-500 dark:text-rose-300">
                  Futureproof notes
                </p>
                <ul className="mt-2 space-y-2 pl-4">
                  {overkillRecommendations.extras.map((item) => (
                    <li key={item} className="list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
            </div>
          ) : null}

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-line/70 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Build essentials</h3>
          <div className="mt-4 space-y-3">
            {essentialsTagged.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-line/70 bg-slate-50 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                  {item.badge ? (
                    <span
                      className={classNames(
                        "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
                        badgeClass(item.badgeTone)
                      )}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{item.description}</p>
                <a
                  href={buildAmazonSearchLink(item.amazonQuery)}
                  target="_blank"
                  rel="sponsored nofollow noreferrer"
                  className="mt-3 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800 transition hover:border-amber-300 hover:bg-amber-100 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200"
                >
                  Amazon options
                </a>
              </div>
            ))}
          </div>
            </div>

            <div className="rounded-2xl border border-line/70 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Peripherals</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {peripheralsTagged.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-line/70 bg-slate-50 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                  {item.badge ? (
                    <span
                      className={classNames(
                        "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
                        badgeClass(item.badgeTone)
                      )}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{item.description}</p>
                <a
                  href={buildAmazonSearchLink(item.amazonQuery)}
                  target="_blank"
                  rel="sponsored nofollow noreferrer"
                  className="mt-3 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800 transition hover:border-amber-300 hover:bg-amber-100 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200"
                >
                  Amazon options
                </a>
              </div>
            ))}
          </div>
            </div>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-line/70 bg-slate-50 p-5 text-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Compatibility checklist</h3>
          <ul className="mt-3 space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200">
            <li className="list-disc">Case supports {caseDetail.formFactors.map((f) => f.name).join("/")} form factor.</li>
            <li className="list-disc">CPU socket matches chipset ({cpuPlatform === "No Preference" ? "AM5 or LGA1700" : cpuPlatform}).</li>
            <li className="list-disc">RAM generation matches motherboard (DDR5 recommended).</li>
            <li className="list-disc">GPU length and thickness fit case clearance.</li>
            <li className="list-disc">PSU form factor matches case (ATX vs SFX/SFX-L).</li>
            <li className="list-disc">Cooler height or radiator size supported by case.</li>
            <li className="list-disc">Power supply wattage meets GPU and CPU peaks.</li>
            <li className="list-disc">Enough M.2 slots and SATA ports for storage plan.</li>
          </ul>
          <a
            href="https://pcpartpicker.com/list/"
            target="_blank"
            rel="nofollow noreferrer"
            className="mt-4 inline-flex items-center rounded-full border border-line/70 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            Open PCPartPicker compatibility check
          </a>
            </div>

            <div className="rounded-2xl border border-line/70 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Share this build</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Your selections are encoded in the URL so you can bookmark or share this build.
          </p>
          <div className="mt-3 rounded-xl border border-line/70 bg-slate-50 px-3 py-2 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            {shareUrl || "Loading link..."}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={handleCopyLink} className="btn-secondary">
              {copiedLink ? "Copied Link" : "Copy Share Link"}
            </button>
            <button type="button" onClick={handleCopySummary} className="btn-primary">
              {copiedSummary ? "Copied Summary" : "Copy Build Summary"}
            </button>
          </div>
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line/70 bg-white/95 p-5 shadow-card backdrop-blur transition hover:shadow-[0_18px_40px_rgba(15,23,42,0.18)] dark:border-slate-800 dark:bg-slate-950/80">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  Build Tally
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Selected options
                </h3>
              </div>
              <span className="rounded-full border border-line/70 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                {selectionTally.length} picks
              </span>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              {selectionTally.map((item) => (
                <div key={item.label} className="flex items-start justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                    {item.label}
                  </span>
                  <span className="text-right text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {item.value}
                  </span>
                </div>
              ))}
              {gpuFitStatus ? (
                <div className="rounded-xl border border-line/70 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                  <span className="font-semibold">GPU fit:</span> {gpuFitStatus.message}
                </div>
              ) : null}
            </div>

            <div className="mt-4 rounded-xl border border-line/70 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              Badges highlight the best value and performance picks for your workload.
            </div>

            <div className="mt-4 grid gap-2">
              <button type="button" onClick={handleCopySummary} className="btn-secondary w-full">
                {copiedSummary ? "Copied Summary" : "Copy Build Summary"}
              </button>
              <button type="button" onClick={handleCopyLink} className="btn-primary w-full">
                {copiedLink ? "Copied Link" : "Copy Share Link"}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
