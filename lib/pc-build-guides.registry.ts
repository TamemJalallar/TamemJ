import type {
  PCBuildBudgetBand,
  PCBuildDifficulty,
  PCBuildGuide,
  PCBuildGuideCategory,
  PCBuildStep,
  PCPartRecommendation
} from "@/types/pc-build";

interface PCBuildGuideSeed {
  slug: string;
  title: string;
  description: string;
  category: PCBuildGuideCategory;
  difficulty?: PCBuildDifficulty;
  budgetBand?: PCBuildBudgetBand;
  estimatedTime?: string;
  useCases: string[];
  tags: string[];
  partRecommendations: PCPartRecommendation[];
  checklist: string[];
  steps: PCBuildStep[];
  commands?: PCBuildGuide["commands"];
  safetyNotes?: string[];
}

const defaultSafetyNotes = [
  "Validate compatibility in manufacturer QVL and support pages before purchase.",
  "Do not disable Secure Boot, TPM, or endpoint protections to work around instability.",
  "Use official BIOS/firmware sources only and avoid beta firmware on production systems.",
  "If a component arrives damaged or fails burn-in testing, process an RMA instead of forcing deployment."
];

function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase();
}

function buildGuide(seed: PCBuildGuideSeed): PCBuildGuide {
  return {
    slug: seed.slug,
    title: seed.title,
    description: seed.description,
    category: seed.category,
    difficulty: seed.difficulty ?? "Beginner",
    budgetBand: seed.budgetBand ?? "Midrange",
    estimatedTime: seed.estimatedTime ?? "20-40 min",
    useCases: [...seed.useCases],
    tags: [...new Set(seed.tags.map(normalizeTag))],
    partRecommendations: seed.partRecommendations.map((part) => ({
      ...part,
      compatibilityChecks: [...part.compatibilityChecks]
    })),
    checklist: [...seed.checklist],
    steps: seed.steps.map((step) => ({ ...step })),
    commands: seed.commands ? seed.commands.map((command) => ({ ...command })) : [],
    safetyNotes: seed.safetyNotes ? [...seed.safetyNotes] : [...defaultSafetyNotes],
    relatedGuideSlugs: []
  };
}

function linkRelatedGuides(guides: PCBuildGuide[]): PCBuildGuide[] {
  return guides.map((guide) => {
    const related = guides
      .filter((candidate) => candidate.slug !== guide.slug)
      .map((candidate) => {
        let score = 0;

        if (candidate.category === guide.category) score += 3;
        if (candidate.difficulty === guide.difficulty) score += 2;
        if (candidate.budgetBand === guide.budgetBand) score += 1;

        const sharedTags = candidate.tags.filter((tag) => guide.tags.includes(tag)).length;
        const sharedUseCases = candidate.useCases.filter((useCase) =>
          guide.useCases.includes(useCase)
        ).length;

        score += sharedTags + sharedUseCases;

        return { slug: candidate.slug, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug))
      .slice(0, 4)
      .map((item) => item.slug);

    return {
      ...guide,
      relatedGuideSlugs: related
    };
  });
}

const guideSeeds: PCBuildGuideSeed[] = [
  {
    slug: "cpu-selection-workload-first",
    title: "CPU Selection: Choose for Workload, Not Marketing",
    description:
      "Pick a CPU by matching core count, clock speed, and platform lifespan to your real workload. This prevents overpaying for specs you will not use.",
    category: "Core Components",
    difficulty: "Beginner",
    budgetBand: "Midrange",
    estimatedTime: "25-35 min",
    useCases: ["Gaming", "Office", "Content Creation", "Development"],
    tags: ["cpu", "cores", "clock-speed", "platform", "motherboard", "build-planning"],
    partRecommendations: [
      {
        partType: "CPU",
        whatToBuy: "6-core/12-thread modern CPU as baseline; 8-core+ for heavier multitasking",
        benefit: "Better responsiveness in daily workloads without overspending.",
        goodFor: "General productivity, esports gaming, mixed workloads.",
        compatibilityChecks: [
          "Socket matches motherboard (e.g., AM5, LGA1700).",
          "CPU cooler mounting kit supports the socket.",
          "Motherboard BIOS supports selected CPU generation."
        ]
      },
      {
        partType: "Motherboard",
        whatToBuy: "B-series chipset for most users, higher-tier chipset only if specific I/O/OC is needed",
        benefit: "Keeps total cost controlled while retaining upgrade path.",
        goodFor: "Balanced builds where stability and value matter most.",
        compatibilityChecks: [
          "VRM quality is sufficient for CPU class.",
          "Required USB, NVMe, and PCIe lanes are present.",
          "Memory QVL includes your intended RAM kit."
        ]
      },
      {
        partType: "Cooling",
        whatToBuy: "High-quality tower air cooler for 65-125W CPUs",
        benefit: "Lower noise and strong reliability versus low-end coolers.",
        goodFor: "Office, gaming, and creator systems prioritizing uptime.",
        compatibilityChecks: [
          "Cooler height fits case clearance.",
          "Fan orientation supports front-to-back airflow.",
          "Thermal paste and mounting hardware are included."
        ]
      }
    ],
    checklist: [
      "Define primary workload split (gaming vs creation vs productivity).",
      "Set total system budget before selecting high-cost components.",
      "Confirm platform upgrade path for at least one future CPU generation.",
      "Validate cooler and motherboard support before purchase."
    ],
    steps: [
      {
        title: "Document workload and budget",
        type: "info",
        content:
          "List your top three workloads and target frame rate or render-time goals. Allocate budget percentage before choosing parts to avoid CPU overspend."
      },
      {
        title: "Map CPU options to platform lifespan",
        type: "info",
        content:
          "Compare CPU options on the same platform. Prefer platforms with active BIOS support and future upgrade options."
      },
      {
        title: "Validate thermal and power envelope",
        type: "warning",
        content:
          "Ensure the cooler and PSU can sustain the CPU under long workloads. Avoid selecting parts that require immediate replacements after first build."
      }
    ],
    commands: [
      {
        title: "Verify installed CPU details after build",
        shell: "PowerShell",
        content:
          "Get-CimInstance Win32_Processor | Select-Object Name, NumberOfCores, NumberOfLogicalProcessors, MaxClockSpeed"
      }
    ]
  },
  {
    slug: "gpu-selection-gaming-creator-ai",
    title: "GPU Selection for Gaming, Creator Work, and Local AI",
    description:
      "Choose GPU based on VRAM, encoder support, and software ecosystem for your workload. Focus on sustained value per workload, not peak synthetic benchmarks.",
    category: "Core Components",
    difficulty: "Beginner",
    budgetBand: "High-End",
    estimatedTime: "25-40 min",
    useCases: ["Gaming", "Video Editing", "3D", "AI Development"],
    tags: ["gpu", "vram", "gaming", "creator", "ai", "rendering"],
    partRecommendations: [
      {
        partType: "GPU",
        whatToBuy: "12GB VRAM class minimum for modern 1440p gaming and creator headroom",
        benefit: "Reduces stutter and improves timeline/project stability in heavier scenes.",
        goodFor: "1440p gaming, Adobe workflows, design tools, light local AI.",
        compatibilityChecks: [
          "Case supports card length and slot thickness.",
          "PSU has required PCIe power connectors.",
          "Monitor ports and refresh target match GPU outputs."
        ]
      },
      {
        partType: "Power Supply",
        whatToBuy: "ATX 3.0 / PCIe 5-ready 750W+ PSU for upper-mid cards",
        benefit: "Handles transient spikes and improves long-term stability.",
        goodFor: "Gaming and creator systems with discrete GPU.",
        compatibilityChecks: [
          "Wattage headroom is at least 25% above estimated draw.",
          "Native cable support for GPU power standard.",
          "80+ Gold or better efficiency for thermal/noise balance."
        ]
      },
      {
        partType: "Case",
        whatToBuy: "Airflow-focused mid tower with full-length GPU clearance",
        benefit: "Keeps GPU temperatures stable and fan noise lower under load.",
        goodFor: "Any discrete GPU build with long gaming/render sessions.",
        compatibilityChecks: [
          "Front intake path is unobstructed.",
          "At least two intake and one exhaust fan positions.",
          "Cable routing space supports clean airflow."
        ]
      }
    ],
    checklist: [
      "Match VRAM to target resolution and project complexity.",
      "Check app acceleration support (Adobe, DaVinci, Blender, AI stack).",
      "Verify PSU transient handling and connector compatibility.",
      "Confirm case fitment before ordering."
    ],
    steps: [
      {
        title: "Define primary GPU workload",
        type: "info",
        content:
          "Set whether the system prioritizes high-FPS gaming, creator exports, or local AI experimentation. This determines VRAM and software stack priorities."
      },
      {
        title: "Size PSU and case around the GPU",
        type: "info",
        content:
          "Select PSU and chassis only after choosing GPU class to avoid adapter-heavy cabling and thermal bottlenecks."
      },
      {
        title: "Validate thermals before final purchase",
        type: "warning",
        content:
          "If case airflow is restricted, GPU boost clocks and noise can degrade significantly. Prioritize airflow and stable thermals over cosmetic-only cases."
      }
    ],
    commands: [
      {
        title: "Confirm GPU model and driver state",
        shell: "PowerShell",
        content:
          "Get-CimInstance Win32_VideoController | Select-Object Name, AdapterRAM, DriverVersion, VideoProcessor"
      }
    ]
  },
  {
    slug: "ram-capacity-speed-planning",
    title: "RAM Planning: Capacity First, Then Speed",
    description:
      "Select memory by capacity requirements first, then tune speed/timings within platform stability limits. This avoids expensive unstable kits.",
    category: "Core Components",
    difficulty: "Beginner",
    budgetBand: "Midrange",
    estimatedTime: "20-30 min",
    useCases: ["Office", "Gaming", "Editing", "Virtualization"],
    tags: ["ram", "ddr5", "capacity", "xmp", "expo", "stability"],
    partRecommendations: [
      {
        partType: "RAM",
        whatToBuy: "32GB (2x16GB) baseline; 64GB for heavy creator or VM workloads",
        benefit: "Prevents disk swapping and improves multitasking smoothness.",
        goodFor: "Most modern builds with longevity in mind.",
        compatibilityChecks: [
          "Use dual-channel matched kit.",
          "Memory speed is on motherboard QVL.",
          "Module height does not conflict with cooler."
        ]
      },
      {
        partType: "Motherboard",
        whatToBuy: "Board with strong memory QVL and BIOS maturity",
        benefit: "Reduces random instability when enabling EXPO/XMP profiles.",
        goodFor: "Anyone prioritizing reliable daily operation.",
        compatibilityChecks: [
          "Latest stable BIOS available.",
          "Validated DIMM kit listed by capacity and speed.",
          "Two-DIMM configuration preferred for high-speed stability."
        ]
      }
    ],
    checklist: [
      "Estimate RAM usage from real apps, browser tabs, and background tools.",
      "Prefer 2-DIMM kits over 4-DIMM for easier high-speed stability.",
      "Update BIOS before enabling EXPO/XMP profiles.",
      "Run memory stress validation after first boot."
    ],
    steps: [
      {
        title: "Choose capacity by workload baseline",
        type: "info",
        content:
          "Start with capacity targets before looking at advertised peak speed. Capacity shortages cause larger real-world slowdowns than moderate speed differences."
      },
      {
        title: "Enable profile and test stability",
        type: "command",
        content:
          "Enable EXPO/XMP in BIOS, then run a stability check before production use."
      },
      {
        title: "Fallback plan if unstable",
        type: "warning",
        content:
          "If crashes occur, lower memory speed one step and retest. Do not force unstable timings for daily systems."
      }
    ],
    commands: [
      {
        title: "Check installed memory totals and speed",
        shell: "PowerShell",
        content:
          "Get-CimInstance Win32_PhysicalMemory | Select-Object Manufacturer, Capacity, Speed, PartNumber"
      }
    ]
  },
  {
    slug: "storage-planning-nvme-sata-hdd",
    title: "Storage Planning: NVMe, SATA SSD, and HDD Roles",
    description:
      "Plan storage tiers for speed, reliability, and budget. Separate OS/apps, active projects, and archival data to keep systems responsive.",
    category: "Core Components",
    difficulty: "Beginner",
    budgetBand: "Midrange",
    estimatedTime: "20-30 min",
    useCases: ["Gaming", "Creator", "Office", "Backup"],
    tags: ["storage", "nvme", "ssd", "hdd", "capacity", "backup"],
    partRecommendations: [
      {
        partType: "Storage",
        whatToBuy: "1TB NVMe Gen4 for OS/apps + optional secondary SSD/HDD",
        benefit: "Fast boot and load times while preserving low-cost bulk storage.",
        goodFor: "Balanced home office and gaming systems.",
        compatibilityChecks: [
          "Motherboard has enough M.2 slots and lane support.",
          "Heatspreaders included for high-speed drives.",
          "DRAM cache or HMB behavior is acceptable for workload."
        ]
      },
      {
        partType: "Accessories",
        whatToBuy: "External backup target or NAS strategy",
        benefit: "Protects against SSD failure, ransomware, or accidental deletion.",
        goodFor: "Any system storing valuable work.",
        compatibilityChecks: [
          "Backup schedule is automated.",
          "Recovery process is tested at least once.",
          "Critical data is stored in more than one location."
        ]
      }
    ],
    checklist: [
      "Separate active project storage from archive storage.",
      "Reserve at least 20% free space on main SSD for sustained performance.",
      "Plan backup before data migration.",
      "Verify motherboard lane sharing rules for M.2 and SATA ports."
    ],
    steps: [
      {
        title: "Define storage tiers",
        type: "info",
        content:
          "Assign drive roles: OS/apps, active projects, and archive/backup. This keeps high-IO workloads isolated from bulk file storage."
      },
      {
        title: "Check motherboard lane sharing",
        type: "info",
        content:
          "Read motherboard manual to confirm which SATA ports disable when specific M.2 slots are occupied."
      },
      {
        title: "Validate health and backup after install",
        type: "warning",
        content:
          "Do not migrate all critical data until drive health checks and backup jobs are confirmed."
      }
    ],
    commands: [
      {
        title: "Inspect disk types and health (Windows)",
        shell: "PowerShell",
        content:
          "Get-PhysicalDisk | Select-Object FriendlyName, MediaType, Size, HealthStatus\nGet-Volume | Select-Object DriveLetter, FileSystemLabel, SizeRemaining, Size"
      }
    ]
  },
  {
    slug: "motherboard-chipset-and-io-selection",
    title: "Motherboard Chipset and I/O Selection",
    description:
      "Pick motherboard features that align with your real peripherals and expansion plan. Avoid paying for unused premium features.",
    category: "Planning & Compatibility",
    difficulty: "Intermediate",
    budgetBand: "Midrange",
    estimatedTime: "25-35 min",
    useCases: ["Gaming", "Creator", "Office", "Homelab"],
    tags: ["motherboard", "chipset", "pcie", "usb", "compatibility", "io"],
    partRecommendations: [
      {
        partType: "Motherboard",
        whatToBuy: "Quality B-series board for most builds; move up chipset only for specific lane/I/O needs",
        benefit: "Delivers stable power and expansion without unnecessary spend.",
        goodFor: "Most performance and productivity systems.",
        compatibilityChecks: [
          "Socket and BIOS support chosen CPU.",
          "PCIe slot layout supports GPU and add-in cards.",
          "Rear I/O includes required USB-C and high-speed ports."
        ]
      },
      {
        partType: "Networking",
        whatToBuy: "Board with 2.5GbE and Wi-Fi 6E where needed",
        benefit: "Improves transfer speed and wireless reliability for modern networks.",
        goodFor: "Remote work, media transfer, and collaborative workflows.",
        compatibilityChecks: [
          "Router/AP supports target Wi-Fi standard.",
          "LAN chipset has solid driver support.",
          "Antenna placement is practical for desk setup."
        ]
      }
    ],
    checklist: [
      "List every required external device before buying the board.",
      "Check PCIe lane availability for future upgrades.",
      "Validate front-panel header support for case ports.",
      "Compare BIOS update workflow and vendor support cadence."
    ],
    steps: [
      {
        title: "Build an I/O requirements list",
        type: "info",
        content:
          "Document monitor outputs, USB devices, storage count, and networking needs. Select board only after this inventory is complete."
      },
      {
        title: "Check expansion roadmap",
        type: "info",
        content:
          "Ensure future upgrades (capture cards, extra NVMe, high-speed networking) are possible without replacing the board."
      },
      {
        title: "Verify firmware and support quality",
        type: "warning",
        content:
          "Avoid boards with poor BIOS support history when system stability is critical."
      }
    ]
  },
  {
    slug: "psu-sizing-and-efficiency-guide",
    title: "Power Supply Sizing and Efficiency Guide",
    description:
      "Right-size your PSU with transient headroom and modern connector support. A quality PSU improves stability and protects expensive components.",
    category: "Power & Cooling",
    difficulty: "Beginner",
    budgetBand: "Midrange",
    estimatedTime: "20-30 min",
    useCases: ["Gaming", "Creator", "Workstation"],
    tags: ["psu", "wattage", "atx3", "efficiency", "stability", "power"],
    partRecommendations: [
      {
        partType: "Power Supply",
        whatToBuy: "80+ Gold fully modular PSU from a reputable platform",
        benefit: "Lower heat, cleaner cabling, and improved long-term reliability.",
        goodFor: "Most modern midrange and high-end builds.",
        compatibilityChecks: [
          "Power budget includes 25-35% headroom.",
          "Native support for required GPU connector type.",
          "PSU length fits case and cable routing space."
        ]
      },
      {
        partType: "Case",
        whatToBuy: "Case with PSU shroud and cable channel spacing",
        benefit: "Cleaner airflow and easier maintenance.",
        goodFor: "Builders who value thermals and serviceability.",
        compatibilityChecks: [
          "Bottom intake filter present for PSU fan.",
          "Sufficient cable tie-down points.",
          "Clearance for stiff high-current GPU cables."
        ]
      }
    ],
    checklist: [
      "Calculate sustained load for CPU + GPU + peripherals.",
      "Add transient/power-spike headroom before final PSU choice.",
      "Prefer native connectors over multi-adapter setups.",
      "Use separate cables for high-power GPU inputs when recommended."
    ],
    steps: [
      {
        title: "Estimate real-world power draw",
        type: "info",
        content:
          "Use combined CPU and GPU sustained draw plus peripheral allowance. Do not size PSU solely from idle or gaming average numbers."
      },
      {
        title: "Select PSU with headroom",
        type: "info",
        content:
          "Choose wattage that keeps normal operation around the efficient mid-load range for quieter fan behavior."
      },
      {
        title: "Avoid low-quality units",
        type: "warning",
        content:
          "Cheap PSU platforms can pass initial power-on but fail under transient load, risking shutdowns or component damage."
      }
    ]
  },
  {
    slug: "airflow-and-case-fan-layout",
    title: "Airflow and Fan Layout for Stable Thermals",
    description:
      "Design front-to-back airflow with positive pressure and sensible fan curves. Good airflow improves noise, longevity, and sustained performance.",
    category: "Power & Cooling",
    difficulty: "Beginner",
    budgetBand: "Entry",
    estimatedTime: "20-30 min",
    useCases: ["Gaming", "Office", "Creator"],
    tags: ["airflow", "fans", "case", "thermals", "cooling", "noise"],
    partRecommendations: [
      {
        partType: "Case",
        whatToBuy: "Mesh-front case with at least three included quality fans",
        benefit: "Lower component temperatures with less fan noise.",
        goodFor: "All performance-focused builds.",
        compatibilityChecks: [
          "Front panel intake path is unrestricted.",
          "Radiator/fan mounts support future upgrades.",
          "Dust filters are removable for cleaning."
        ]
      },
      {
        partType: "Cooling",
        whatToBuy: "PWM fan kit with consistent static pressure and airflow",
        benefit: "More predictable cooling curve and easier fan tuning.",
        goodFor: "Builders aiming for quiet sustained performance.",
        compatibilityChecks: [
          "Motherboard has enough fan headers or hub support.",
          "Fan orientation follows clear intake/exhaust plan.",
          "Cable routing does not obstruct blades."
        ]
      }
    ],
    checklist: [
      "Use front/bottom as intake and rear/top as exhaust in most tower cases.",
      "Keep slight positive pressure to reduce dust ingress.",
      "Set practical fan curve targets for idle, gaming, and sustained load.",
      "Recheck airflow after adding extra storage or cabling."
    ],
    steps: [
      {
        title: "Plan airflow zones",
        type: "info",
        content:
          "Map intake and exhaust paths before installing components so hot GPU and CPU air is exhausted efficiently."
      },
      {
        title: "Tune fan curves",
        type: "info",
        content:
          "Create fan curves that ramp progressively instead of aggressive spikes to keep acoustics stable."
      },
      {
        title: "Monitor temperatures after assembly",
        type: "warning",
        content:
          "If GPU/CPU temperatures stay high despite fan speed, revisit case airflow obstruction and cooler mounting."
      }
    ]
  },
  {
    slug: "cpu-cooler-air-vs-aio-selection",
    title: "CPU Cooling: Air Cooler vs AIO Decision Framework",
    description:
      "Select between tower air and AIO liquid cooling by thermal demand, noise goals, and maintenance tolerance.",
    category: "Power & Cooling",
    difficulty: "Intermediate",
    budgetBand: "Midrange",
    estimatedTime: "20-30 min",
    useCases: ["Gaming", "Creator", "Workstation"],
    tags: ["cpu-cooler", "aio", "air-cooler", "thermals", "noise"],
    partRecommendations: [
      {
        partType: "Cooling",
        whatToBuy: "High-end dual-tower air cooler for most mid/high CPUs",
        benefit: "Excellent reliability, low noise, and minimal maintenance.",
        goodFor: "Long-term workstations and daily systems.",
        compatibilityChecks: [
          "RAM clearance is compatible with front fan.",
          "Case height supports cooler dimensions.",
          "Backplate and bracket are included for socket."
        ]
      },
      {
        partType: "Cooling",
        whatToBuy: "240/360mm AIO for sustained heavy all-core load builds",
        benefit: "Can improve peak sustained thermals in high power workloads.",
        goodFor: "Heavy rendering and high-heat desktop CPUs.",
        compatibilityChecks: [
          "Radiator mount position fits without tubing strain.",
          "Pump header and fan header mapping is planned.",
          "AIO model has solid warranty and failure response process."
        ]
      }
    ],
    checklist: [
      "Match cooler class to CPU sustained power draw.",
      "Verify case clearance and RAM fitment before purchase.",
      "Use proper mounting pressure and fresh thermal paste.",
      "Recheck idle and load temperatures after first week."
    ],
    steps: [
      {
        title: "Determine thermal target",
        type: "info",
        content:
          "Choose cooling based on sustained workload, not just short benchmark bursts."
      },
      {
        title: "Install with correct orientation",
        type: "info",
        content:
          "Mount coolers to align with case airflow and avoid tube/fan conflicts."
      },
      {
        title: "Watch for pump or fan anomalies",
        type: "warning",
        content:
          "Unexpected noise or temperature spikes after install should be treated as mounting or component health issues and corrected immediately."
      }
    ]
  },
  {
    slug: "bios-and-firmware-update-safely",
    title: "BIOS and Firmware Update Safely",
    description:
      "Apply motherboard BIOS and key firmware updates in a controlled manner to improve compatibility and stability without unnecessary risk.",
    category: "Assembly & Setup",
    difficulty: "Intermediate",
    budgetBand: "Midrange",
    estimatedTime: "30-45 min",
    useCases: ["New Build", "CPU Upgrade", "Stability Fix"],
    tags: ["bios", "firmware", "update", "stability", "compatibility"],
    partRecommendations: [
      {
        partType: "Motherboard",
        whatToBuy: "Board with BIOS flashback/recovery support",
        benefit: "Reduces risk if update is interrupted or boot fails post-update.",
        goodFor: "Any builder expecting future CPU upgrades.",
        compatibilityChecks: [
          "USB flash method is documented by vendor.",
          "Correct revision-specific BIOS file is used.",
          "Stable power source is available during update."
        ]
      },
      {
        partType: "Accessories",
        whatToBuy: "Small UPS for update and flash operations",
        benefit: "Protects firmware update process from power interruptions.",
        goodFor: "Areas with unstable power or critical workstations.",
        compatibilityChecks: [
          "UPS runtime covers full update process.",
          "System is connected to battery-backed outlet.",
          "Update planned during low-risk maintenance window."
        ]
      }
    ],
    checklist: [
      "Read vendor release notes and known issues before flashing.",
      "Use stable power and reset overclocks to default.",
      "Back up BIOS profiles before update where supported.",
      "Confirm memory profile and boot order after update."
    ],
    steps: [
      {
        title: "Confirm update necessity",
        type: "info",
        content:
          "Update firmware when it solves compatibility, stability, or security issues relevant to your build. Avoid unnecessary firmware churn."
      },
      {
        title: "Execute controlled update",
        type: "command",
        content:
          "Use vendor-approved in-BIOS update workflow. Do not interrupt power or reset while flashing."
      },
      {
        title: "Post-update validation",
        type: "warning",
        content:
          "Revalidate memory profile, storage detection, and operating system boot before returning system to production use."
      }
    ]
  },
  {
    slug: "first-boot-post-and-os-install-checklist",
    title: "First Boot, POST, and OS Install Checklist",
    description:
      "Use a structured bring-up checklist after a new build to ensure hardware detection, thermals, and baseline stability are correct.",
    category: "Assembly & Setup",
    difficulty: "Beginner",
    budgetBand: "Entry",
    estimatedTime: "35-60 min",
    useCases: ["New Build", "System Bring-Up"],
    tags: ["post", "first-boot", "windows-install", "checklist", "validation"],
    partRecommendations: [
      {
        partType: "Storage",
        whatToBuy: "Dedicated clean USB installer and verified OS image",
        benefit: "Reduces installation errors and corrupted setup media issues.",
        goodFor: "All fresh build deployments.",
        compatibilityChecks: [
          "Installer media created from official source.",
          "UEFI boot mode configured as intended.",
          "Target drive selected correctly before install."
        ]
      },
      {
        partType: "Accessories",
        whatToBuy: "Basic diagnostics kit (USB drive, screwdriver set, spare cable)",
        benefit: "Speeds up bring-up and avoids avoidable delays.",
        goodFor: "First-time builders and repeat deployment workflows.",
        compatibilityChecks: [
          "Display cable is known-good.",
          "Keyboard works in BIOS environment.",
          "Network path for driver updates is available."
        ]
      }
    ],
    checklist: [
      "Confirm CPU, memory, and storage are detected in BIOS.",
      "Enable memory profile only after stable baseline boot.",
      "Install chipset/network/GPU drivers from official vendor sources.",
      "Run initial temperature and stability check before full data migration."
    ],
    steps: [
      {
        title: "Complete BIOS hardware verification",
        type: "info",
        content:
          "Before OS install, verify POST consistency and all core components in firmware hardware screens."
      },
      {
        title: "Install OS and core drivers",
        type: "command",
        content:
          "Install OS from clean media, then apply chipset, network, and GPU drivers in that order."
      },
      {
        title: "Baseline stability check",
        type: "warning",
        content:
          "Do not migrate critical files or install heavy software until thermal and stability checks pass."
      }
    ]
  },
  {
    slug: "no-display-after-build-troubleshooting",
    title: "No Display After Build: Fast Triage Runbook",
    description:
      "Troubleshoot black screen / no display after assembly with a safe, ordered checklist that isolates power, memory, GPU, and cable issues.",
    category: "Troubleshooting",
    difficulty: "Intermediate",
    budgetBand: "Entry",
    estimatedTime: "25-45 min",
    useCases: ["New Build", "Upgrade Recovery", "Repair"],
    tags: ["no-display", "post-failure", "gpu", "ram", "troubleshooting"],
    partRecommendations: [
      {
        partType: "GPU",
        whatToBuy: "Known-good spare low-power GPU (optional bench tool)",
        benefit: "Rapidly isolates GPU hardware path versus platform issue.",
        goodFor: "Builders frequently assembling systems.",
        compatibilityChecks: [
          "Spare card supports board output standard.",
          "PSU connectors match test GPU.",
          "Monitor input source is set correctly."
        ]
      },
      {
        partType: "Accessories",
        whatToBuy: "Motherboard speaker/buzzer for POST beep diagnostics",
        benefit: "Adds fast diagnostic signal when no on-screen output exists.",
        goodFor: "Troubleshooting-focused build workflows.",
        compatibilityChecks: [
          "Board header pinout is confirmed.",
          "POST code mapping is available in manual.",
          "Case front-panel cables are connected correctly."
        ]
      }
    ],
    checklist: [
      "Confirm monitor cable is connected to GPU output, not motherboard video out (if no iGPU).",
      "Reseat RAM and test one stick in the primary slot.",
      "Verify CPU EPS and GPU power cables are fully seated.",
      "Clear CMOS and test at stock defaults."
    ],
    steps: [
      {
        title: "Start with external checks",
        type: "info",
        content:
          "Validate display cable, monitor input source, and GPU output path first before opening the case."
      },
      {
        title: "Perform minimum boot configuration",
        type: "info",
        content:
          "Boot with CPU, one RAM stick, GPU (if required), and boot drive only. Remove non-essential USB and PCIe devices."
      },
      {
        title: "Escalate component swap testing",
        type: "warning",
        content:
          "If no POST after reseat and CMOS clear, test known-good RAM/GPU/PSU components to isolate hardware failure."
      }
    ]
  },
  {
    slug: "random-restarts-bsod-power-memory-stability",
    title: "Random Restarts / BSOD: Power and Memory Stability Triage",
    description:
      "Stabilize systems with intermittent crashes by validating memory profile stability, thermals, and power delivery health in a controlled order.",
    category: "Troubleshooting",
    difficulty: "Advanced",
    budgetBand: "Midrange",
    estimatedTime: "40-70 min",
    useCases: ["Stability Repair", "New Build Validation"],
    tags: ["bsod", "restarts", "memory", "psu", "stability", "diagnostics"],
    partRecommendations: [
      {
        partType: "RAM",
        whatToBuy: "QVL-validated memory kit for platform",
        benefit: "Reduces random crashes tied to borderline profiles.",
        goodFor: "Systems with XMP/EXPO-related instability.",
        compatibilityChecks: [
          "Test at JEDEC baseline first.",
          "Enable profile only after stable baseline.",
          "Run extended memory validation before production use."
        ]
      },
      {
        partType: "Power Supply",
        whatToBuy: "Higher-quality PSU if random shutdowns persist",
        benefit: "Improves transient handling and load stability.",
        goodFor: "Systems with high GPU load transitions.",
        compatibilityChecks: [
          "Rails and connectors match system demands.",
          "No daisy-chained high-power GPU connectors when not recommended.",
          "Wattage overhead remains above peak load."
        ]
      }
    ],
    checklist: [
      "Return BIOS to stable defaults and retest.",
      "Check thermal behavior under sustained CPU and GPU load.",
      "Run memory diagnostics before changing multiple components at once.",
      "Update chipset, storage, and GPU drivers from official sources."
    ],
    steps: [
      {
        title: "Revert to known-stable baseline",
        type: "info",
        content:
          "Disable overclocking and memory profiles temporarily. Reproduce workload at default firmware settings to isolate tuning-related instability."
      },
      {
        title: "Collect crash evidence",
        type: "command",
        content:
          "Capture event logs and memory dump references before making additional changes."
      },
      {
        title: "Swap-test suspected weak links",
        type: "warning",
        content:
          "If instability persists, isolate with known-good RAM/PSU/GPU one at a time to avoid introducing multiple unknowns."
      }
    ],
    commands: [
      {
        title: "Review recent critical events",
        shell: "PowerShell",
        content:
          "Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2; StartTime=(Get-Date).AddDays(-3)} | Select-Object TimeCreated, Id, ProviderName, Message -First 30"
      },
      {
        title: "Launch Windows memory diagnostic",
        shell: "CMD",
        content: "mdsched.exe"
      }
    ]
  },
  {
    slug: "1080p-value-gaming-build-guide",
    title: "1080p Value Gaming Build Guide",
    description:
      "A cost-efficient build profile for high-FPS 1080p gaming with sensible upgrade paths and low operational complexity.",
    category: "Build Profiles",
    difficulty: "Beginner",
    budgetBand: "Entry",
    estimatedTime: "30-45 min",
    useCases: ["1080p Gaming", "Esports", "General Use"],
    tags: ["1080p", "gaming-build", "value", "entry-level", "upgrade-path"],
    partRecommendations: [
      {
        partType: "CPU",
        whatToBuy: "6-core gaming-focused CPU",
        benefit: "Strong gaming frame pacing while keeping budget under control.",
        goodFor: "Esports and mainstream 1080p titles.",
        compatibilityChecks: [
          "Use board BIOS with CPU support.",
          "Pair with dual-channel DDR5 kit.",
          "Use adequate tower cooler for sustained boosts."
        ]
      },
      {
        partType: "GPU",
        whatToBuy: "8-12GB class midrange GPU",
        benefit: "Delivers smooth 1080p high settings and better longevity.",
        goodFor: "Competitive and AAA mixed gaming.",
        compatibilityChecks: [
          "Card length and slot width fit case.",
          "PSU includes required connectors.",
          "Monitor refresh aligns with expected FPS."
        ]
      },
      {
        partType: "RAM",
        whatToBuy: "32GB (2x16GB) DDR5",
        benefit: "Supports modern games plus background apps without stutter.",
        goodFor: "Users who game while streaming or multitasking.",
        compatibilityChecks: [
          "Enable XMP/EXPO after baseline validation.",
          "Use supported speed range from motherboard QVL.",
          "Install in recommended DIMM slots."
        ]
      }
    ],
    checklist: [
      "Prioritize GPU budget over premium motherboard aesthetics.",
      "Choose monitor that matches target frame-rate range.",
      "Validate PSU headroom for future GPU upgrade.",
      "Use at least 1TB NVMe storage for modern game footprints."
    ],
    steps: [
      {
        title: "Allocate budget by performance impact",
        type: "info",
        content:
          "For 1080p gaming, allocate a higher share to GPU and adequate CPU while keeping motherboard/case spend disciplined."
      },
      {
        title: "Select upgrade-friendly platform",
        type: "info",
        content:
          "Prefer a platform that supports future CPU and GPU upgrades without replacing core infrastructure."
      },
      {
        title: "Validate target titles",
        type: "warning",
        content:
          "Check target games and mod packs for VRAM and CPU requirements before final purchase."
      }
    ]
  },
  {
    slug: "1440p-balanced-gaming-build-guide",
    title: "1440p Balanced Gaming Build Guide",
    description:
      "A balanced 1440p profile optimized for visual quality, stable frame pacing, and practical thermals.",
    category: "Build Profiles",
    difficulty: "Intermediate",
    budgetBand: "High-End",
    estimatedTime: "35-50 min",
    useCases: ["1440p Gaming", "Streaming", "General Creator"],
    tags: ["1440p", "gaming-build", "balanced", "high-refresh", "thermal-planning"],
    partRecommendations: [
      {
        partType: "GPU",
        whatToBuy: "12-16GB class GPU for 1440p high/ultra settings",
        benefit: "Stronger 1% lows and improved texture headroom in modern titles.",
        goodFor: "High-refresh 1440p gaming and occasional creator tasks.",
        compatibilityChecks: [
          "PSU is ATX 3.0 and has required connectors.",
          "Case airflow and GPU clearance are sufficient.",
          "CPU pairing avoids major bottlenecks."
        ]
      },
      {
        partType: "CPU",
        whatToBuy: "8-core class CPU",
        benefit: "Better background-task handling while gaming and streaming.",
        goodFor: "Users running voice, browser, capture, and game simultaneously.",
        compatibilityChecks: [
          "Board VRM quality handles sustained load.",
          "Cooler chosen for all-core workloads.",
          "BIOS supports memory profile stability."
        ]
      },
      {
        partType: "Power Supply",
        whatToBuy: "850W 80+ Gold PSU",
        benefit: "Stable power under load spikes and future GPU upgrade room.",
        goodFor: "High-refresh gaming systems.",
        compatibilityChecks: [
          "Native high-power GPU connector available.",
          "Cable routing is clean and strain-free.",
          "Load target leaves thermal and acoustic margin."
        ]
      }
    ],
    checklist: [
      "Target monitor resolution and refresh before selecting GPU.",
      "Ensure airflow can handle sustained gaming sessions.",
      "Tune fan curves after initial stress checks.",
      "Leave PSU and thermal headroom for summer ambient conditions."
    ],
    steps: [
      {
        title: "Lock display target first",
        type: "info",
        content:
          "Choose monitor specs first, then build around required FPS and quality targets for your top games."
      },
      {
        title: "Balance CPU/GPU budget",
        type: "info",
        content:
          "Do not over-index on CPU for 1440p workloads where GPU performance typically dominates."
      },
      {
        title: "Validate thermal curve",
        type: "warning",
        content:
          "If frame rates drop during long sessions, check GPU temperature and case exhaust efficiency before replacing parts."
      }
    ]
  },
  {
    slug: "creator-workstation-build-adobe-guide",
    title: "Adobe Creator Workstation Build Guide",
    description:
      "Build a workstation profile for Premiere Pro, After Effects, Photoshop, and Lightroom with reliability and media throughput in focus.",
    category: "Build Profiles",
    difficulty: "Advanced",
    budgetBand: "High-End",
    estimatedTime: "45-70 min",
    useCases: ["Video Editing", "Motion Graphics", "Design"],
    tags: ["adobe", "creator-build", "premiere", "after-effects", "workstation"],
    partRecommendations: [
      {
        partType: "CPU",
        whatToBuy: "8-16 core productivity-focused CPU",
        benefit: "Improves export/render throughput and multitasking headroom.",
        goodFor: "Heavy timeline editing and concurrent app workflows.",
        compatibilityChecks: [
          "Sustained cooling capacity matches CPU class.",
          "Motherboard power delivery is workstation-grade.",
          "BIOS supports memory capacity target."
        ]
      },
      {
        partType: "RAM",
        whatToBuy: "64GB baseline, 128GB for large After Effects comps",
        benefit: "Reduces timeline cache pressure and background render stalls.",
        goodFor: "Professional media projects with large assets.",
        compatibilityChecks: [
          "DIMM population strategy supports stable speed.",
          "QVL includes intended kit density.",
          "System pagefile strategy is configured for heavy workloads."
        ]
      },
      {
        partType: "Storage",
        whatToBuy: "Separate NVMe drives for OS/apps, cache/scratch, and project media",
        benefit: "Improves timeline responsiveness and reduces I/O contention.",
        goodFor: "4K editing and high-bitrate workflows.",
        compatibilityChecks: [
          "Motherboard lane allocation supports all planned drives.",
          "Cache drive endurance rating fits workload.",
          "Backup strategy protects active project storage."
        ]
      },
      {
        partType: "GPU",
        whatToBuy: "12GB+ VRAM GPU with strong encoder support",
        benefit: "Improves playback acceleration and render offload in supported effects.",
        goodFor: "Premiere timelines and mixed graphics workflows.",
        compatibilityChecks: [
          "App version uses chosen GPU acceleration path.",
          "Driver branch is studio/stable class.",
          "Case airflow supports sustained creator workloads."
        ]
      }
    ],
    checklist: [
      "Prioritize CPU, RAM, and storage layout for creator workloads.",
      "Use separate scratch/cache disk from project media.",
      "Install studio-focused GPU drivers for production systems.",
      "Run export benchmark and thermal tests before production cutover."
    ],
    steps: [
      {
        title: "Design the storage topology first",
        type: "info",
        content:
          "Split cache/scratch and active media to avoid bottlenecks under heavy timeline operations."
      },
      {
        title: "Tune for sustained creator sessions",
        type: "info",
        content:
          "Prioritize sustained cooling and acoustic control over short-burst benchmark numbers."
      },
      {
        title: "Validate on real project files",
        type: "warning",
        content:
          "Synthetic benchmarks alone are insufficient. Validate with your actual codec, effects, and project structure."
      }
    ]
  },
  {
    slug: "local-ai-llm-development-build-guide",
    title: "Local AI / LLM Development Build Guide",
    description:
      "Build a practical local AI workstation focusing on VRAM, memory capacity, storage throughput, and thermals for sustained inference workflows.",
    category: "Build Profiles",
    difficulty: "Advanced",
    budgetBand: "Enthusiast",
    estimatedTime: "45-75 min",
    useCases: ["AI Development", "Inference", "Python Workloads"],
    tags: ["ai", "llm", "vram", "cuda", "workstation", "local-inference"],
    partRecommendations: [
      {
        partType: "GPU",
        whatToBuy: "16GB+ VRAM GPU minimum for meaningful local model work",
        benefit: "Enables larger context windows and model variants without aggressive quantization compromises.",
        goodFor: "Local inference, experimentation, and lightweight finetuning.",
        compatibilityChecks: [
          "CUDA/ROCm ecosystem compatibility aligns with toolchain.",
          "PSU and case airflow support sustained GPU load.",
          "PCIe slot spacing supports cooling performance."
        ]
      },
      {
        partType: "RAM",
        whatToBuy: "64GB system RAM baseline",
        benefit: "Improves dataset handling and multitasking while running notebooks/services.",
        goodFor: "Developers with multiple local services and toolchains.",
        compatibilityChecks: [
          "Memory kit stability validated at target profile.",
          "Motherboard supports future expansion.",
          "Swap/page configuration reviewed for large workloads."
        ]
      },
      {
        partType: "Storage",
        whatToBuy: "2TB+ NVMe for models, datasets, and environments",
        benefit: "Faster model load times and fewer storage bottlenecks.",
        goodFor: "Frequent model switching and dataset iteration.",
        compatibilityChecks: [
          "Sustained write performance meets workload.",
          "Thermal pad/heatsink support for long reads.",
          "Backup strategy includes model configs and environment manifests."
        ]
      }
    ],
    checklist: [
      "Validate framework compatibility with chosen GPU vendor.",
      "Budget for VRAM first, then CPU and RAM.",
      "Ensure cooling and acoustics can handle long-running jobs.",
      "Plan backup for notebooks, scripts, and model configs."
    ],
    steps: [
      {
        title: "Set model and context-window targets",
        type: "info",
        content:
          "Define model size and expected context requirements first; VRAM and storage decisions follow directly from this."
      },
      {
        title: "Build around sustained load",
        type: "info",
        content:
          "Choose cooling and PSU for continuous inference sessions rather than intermittent gaming-like bursts."
      },
      {
        title: "Avoid unstable tuning",
        type: "warning",
        content:
          "Do not run aggressive overclocking on development machines that must remain reproducible and stable."
      }
    ]
  },
  {
    slug: "silent-productivity-office-build-guide",
    title: "Silent Productivity / Office Build Guide",
    description:
      "Design a low-noise desktop for office productivity, browser-heavy workflows, and video calls with excellent reliability and minimal heat.",
    category: "Build Profiles",
    difficulty: "Beginner",
    budgetBand: "Entry",
    estimatedTime: "25-40 min",
    useCases: ["Office", "Remote Work", "Light Editing"],
    tags: ["silent-build", "office", "low-noise", "productivity", "integrated-graphics"],
    partRecommendations: [
      {
        partType: "CPU",
        whatToBuy: "Efficient 6-core CPU with strong integrated graphics",
        benefit: "Reduces system complexity, noise, and power draw.",
        goodFor: "Office suites, conferencing, browser workloads.",
        compatibilityChecks: [
          "iGPU supports monitor resolution and output count.",
          "Motherboard has required display outputs.",
          "Cooler profile matches quiet operation goal."
        ]
      },
      {
        partType: "Cooling",
        whatToBuy: "Large low-RPM air cooler and quality case fans",
        benefit: "Lower acoustic footprint in quiet office environments.",
        goodFor: "Desks where background noise matters.",
        compatibilityChecks: [
          "Fan curves tuned for low idle noise.",
          "Case airflow remains adequate under conference call loads.",
          "Dust filters are maintained regularly."
        ]
      },
      {
        partType: "Storage",
        whatToBuy: "1TB NVMe SSD",
        benefit: "Fast wake/resume and application launches without HDD noise.",
        goodFor: "Daily productivity and business app usage.",
        compatibilityChecks: [
          "Drive has sufficient endurance for workload.",
          "Motherboard M.2 slot supports intended speed.",
          "Backups are configured for business documents."
        ]
      }
    ],
    checklist: [
      "Prioritize acoustics and reliability over peak benchmark targets.",
      "Use integrated graphics when workload allows.",
      "Tune fan curves for silent idle and moderate ramp under load.",
      "Keep cable layout clear for unobstructed airflow."
    ],
    steps: [
      {
        title: "Choose efficient platform",
        type: "info",
        content:
          "Select low-power components that meet productivity needs without dedicated GPU heat/noise overhead."
      },
      {
        title: "Tune for acoustics",
        type: "info",
        content:
          "Set BIOS fan curves to avoid sharp ramping during normal app bursts and calls."
      },
      {
        title: "Validate thermals quietly",
        type: "warning",
        content:
          "A silent system that overheats is not production-ready. Validate both temperatures and sound profile."
      }
    ]
  },
  {
    slug: "compact-sff-build-planning-guide",
    title: "Compact SFF Build Planning Guide",
    description:
      "Plan small-form-factor systems with tight clearance, thermals, and cable constraints accounted for before purchase.",
    category: "Planning & Compatibility",
    difficulty: "Advanced",
    budgetBand: "High-End",
    estimatedTime: "35-60 min",
    useCases: ["SFF", "Minimal Desk Setup", "Portable Workstation"],
    tags: ["sff", "small-form-factor", "itx", "clearance", "thermals"],
    partRecommendations: [
      {
        partType: "Case",
        whatToBuy: "ITX case with documented compatibility matrix",
        benefit: "Reduces build risk in tight layouts.",
        goodFor: "Travel or space-constrained builds.",
        compatibilityChecks: [
          "GPU length and thickness limits verified.",
          "PSU form factor (SFX/SFX-L/ATX) confirmed.",
          "Cooler and radiator support checked exactly."
        ]
      },
      {
        partType: "Power Supply",
        whatToBuy: "High-quality SFX/SFX-L PSU with flexible cables",
        benefit: "Improves routing and airflow in compact enclosures.",
        goodFor: "SFF builders prioritizing clean assembly.",
        compatibilityChecks: [
          "Cable lengths suit case volume.",
          "Connector count meets GPU requirements.",
          "Thermal profile is acceptable in tight PSU chambers."
        ]
      },
      {
        partType: "Cooling",
        whatToBuy: "Case-compatible low-profile air cooler or slim AIO",
        benefit: "Maintains stability under sustained load despite constrained volume.",
        goodFor: "Compact builds with productivity/gaming mix.",
        compatibilityChecks: [
          "CPU cooler height or radiator thickness fits case limits.",
          "Fan orientation supports case-specific airflow design.",
          "Memory height does not conflict with cooler."
        ]
      }
    ],
    checklist: [
      "Model full component fit before purchase.",
      "Use shortest clean cable paths to preserve airflow.",
      "Plan assembly order in advance (SFF is sequence-sensitive).",
      "Test thermals under sustained load before daily use."
    ],
    steps: [
      {
        title: "Use a clearance-first checklist",
        type: "info",
        content:
          "In SFF builds, physical fit is the first failure point. Validate dimensions from official manufacturer specs for every component."
      },
      {
        title: "Assemble in planned order",
        type: "info",
        content:
          "Install components in case-specific order to avoid full disassembly during final cable or cooler placement."
      },
      {
        title: "Thermal stress test mandatory",
        type: "warning",
        content:
          "Compact systems can appear stable at idle but fail under sustained load if airflow is constrained."
      }
    ]
  },
  {
    slug: "upgrade-path-gpu-ram-storage-planning",
    title: "Upgrade Path Planning: GPU, RAM, and Storage",
    description:
      "Plan staged upgrades to maximize value and avoid replacing core platform components too early.",
    category: "Upgrades & Maintenance",
    difficulty: "Beginner",
    budgetBand: "Midrange",
    estimatedTime: "20-35 min",
    useCases: ["Upgrade", "Longevity", "Budget Optimization"],
    tags: ["upgrade-path", "gpu-upgrade", "ram-upgrade", "storage-upgrade", "planning"],
    partRecommendations: [
      {
        partType: "Power Supply",
        whatToBuy: "PSU sized for next GPU tier at initial build",
        benefit: "Prevents expensive PSU replacement during GPU upgrade.",
        goodFor: "Builders planning staged improvements.",
        compatibilityChecks: [
          "Future GPU connector standard supported.",
          "Headroom remains after CPU and peripheral growth.",
          "PSU quality supports long service life."
        ]
      },
      {
        partType: "Motherboard",
        whatToBuy: "Board with spare M.2 slot and two free DIMM slots where possible",
        benefit: "Enables low-friction RAM and storage growth.",
        goodFor: "Users who expect capacity expansion.",
        compatibilityChecks: [
          "Lane sharing impact is documented.",
          "Memory expansion path maintains stable profile.",
          "BIOS support roadmap is active."
        ]
      }
    ],
    checklist: [
      "Identify the first likely bottleneck for your workload.",
      "Upgrade the bottlenecked component before platform-wide replacement.",
      "Verify PSU, thermals, and physical fit for each planned upgrade.",
      "Re-test system stability after every hardware change."
    ],
    steps: [
      {
        title: "Profile current bottlenecks",
        type: "info",
        content:
          "Track whether limits are GPU, memory capacity, or storage throughput before buying upgrades."
      },
      {
        title: "Sequence upgrades for maximum value",
        type: "info",
        content:
          "Use staged upgrades that keep existing platform useful while addressing highest-impact constraints."
      },
      {
        title: "Avoid mixed instability",
        type: "warning",
        content:
          "Do not change multiple critical components at once if you need clear fault isolation."
      }
    ]
  },
  {
    slug: "wifi-bluetooth-networking-upgrade-guide",
    title: "Wi-Fi and Bluetooth Upgrade Guide for Desktop PCs",
    description:
      "Improve wireless reliability and throughput by selecting the right PCIe/M.2 networking hardware for your environment.",
    category: "Upgrades & Maintenance",
    difficulty: "Beginner",
    budgetBand: "Entry",
    estimatedTime: "20-30 min",
    useCases: ["Remote Work", "Streaming", "Bluetooth Peripherals"],
    tags: ["wifi", "bluetooth", "networking", "desktop-upgrade", "latency"],
    partRecommendations: [
      {
        partType: "Networking",
        whatToBuy: "Wi-Fi 6E/7 desktop adapter with external antenna",
        benefit: "Higher throughput and lower congestion in dense wireless environments.",
        goodFor: "Homes/offices with multiple simultaneous wireless devices.",
        compatibilityChecks: [
          "Router supports target standard and channels.",
          "PCIe slot availability is confirmed.",
          "Antenna placement has clear line of sight."
        ]
      },
      {
        partType: "Accessories",
        whatToBuy: "Quality USB Bluetooth adapter if board lacks stable BT",
        benefit: "Improves headset and keyboard/mouse reliability.",
        goodFor: "Wireless peripheral-heavy setups.",
        compatibilityChecks: [
          "Driver support exists for operating system version.",
          "BT version supports intended audio/peripheral profile.",
          "USB port placement minimizes interference."
        ]
      }
    ],
    checklist: [
      "Confirm router capability before buying latest Wi-Fi hardware.",
      "Use external antennas with good placement for desktop towers.",
      "Install latest stable networking drivers.",
      "Prefer Ethernet for latency-sensitive competitive workloads."
    ],
    steps: [
      {
        title: "Assess current wireless bottleneck",
        type: "info",
        content:
          "Check whether bottleneck is adapter generation, router capability, channel congestion, or poor antenna placement."
      },
      {
        title: "Install and position hardware correctly",
        type: "info",
        content:
          "Place antennas away from metal obstructions and tune adapter settings after driver installation."
      },
      {
        title: "Set realistic expectations",
        type: "warning",
        content:
          "Wireless upgrades improve convenience, but wired Ethernet remains preferred for lowest-latency and highest-stability scenarios."
      }
    ],
    commands: [
      {
        title: "Check Wi-Fi adapter and signal info (Windows)",
        shell: "CMD",
        content:
          "netsh wlan show interfaces\nnetsh wlan show drivers"
      }
    ]
  },
  {
    slug: "windows-gaming-optimization-safe-baseline",
    title: "Windows Gaming Optimization (Safe Baseline)",
    description:
      "Apply safe OS-level optimizations for gaming performance without disabling core security controls or stability safeguards.",
    category: "Assembly & Setup",
    difficulty: "Intermediate",
    budgetBand: "Entry",
    estimatedTime: "25-35 min",
    useCases: ["Gaming", "Streaming"],
    tags: ["windows", "gaming-optimization", "drivers", "safe-tuning", "latency"],
    partRecommendations: [
      {
        partType: "Storage",
        whatToBuy: "Fast NVMe system drive",
        benefit: "Improves load times and reduces stutter from background storage contention.",
        goodFor: "Game-heavy installations.",
        compatibilityChecks: [
          "Drive has healthy free-space margin.",
          "Chipset drivers installed correctly.",
          "Firmware up to date from official vendor source."
        ]
      },
      {
        partType: "GPU",
        whatToBuy: "Current-generation GPU with stable driver branch",
        benefit: "Consistent frame pacing and fewer driver regressions.",
        goodFor: "Competitive and AAA gaming.",
        compatibilityChecks: [
          "Driver installed cleanly from official source.",
          "Game profiles are updated as needed.",
          "Thermal envelope remains stable under load."
        ]
      }
    ],
    checklist: [
      "Install latest chipset and GPU drivers from official vendors.",
      "Enable Game Mode and test impact on your primary titles.",
      "Keep security controls enabled; avoid risky registry tweak packs.",
      "Benchmark before and after each change to measure real impact."
    ],
    steps: [
      {
        title: "Start from clean driver baseline",
        type: "info",
        content:
          "Update platform and GPU drivers first, then benchmark before applying optional tuning changes."
      },
      {
        title: "Apply measured optimizations only",
        type: "info",
        content:
          "Apply one change at a time and keep notes so you can revert if performance or stability worsens."
      },
      {
        title: "Do not disable security protections",
        type: "warning",
        content:
          "Avoid guides that require disabling security, virtualization, or update controls globally."
      }
    ],
    commands: [
      {
        title: "Quick hardware and driver summary",
        shell: "PowerShell",
        content:
          "Get-ComputerInfo | Select-Object OSName, OSVersion, WindowsBuildLabEx\nGet-CimInstance Win32_VideoController | Select-Object Name, DriverVersion"
      }
    ]
  },
  {
    slug: "dual-monitor-and-dock-setup-guide",
    title: "Dual Monitor and Dock Setup Guide (Desktop/Workstation)",
    description:
      "Configure dual-monitor workflows with correct cable standards, GPU output mapping, and docking considerations for stable daily use.",
    category: "Upgrades & Maintenance",
    difficulty: "Beginner",
    budgetBand: "Entry",
    estimatedTime: "20-30 min",
    useCases: ["Remote Work", "Creator", "Trading", "Productivity"],
    tags: ["dual-monitor", "displayport", "hdmi", "dock", "productivity"],
    partRecommendations: [
      {
        partType: "Accessories",
        whatToBuy: "Certified DisplayPort/HDMI cables for target refresh/resolution",
        benefit: "Reduces flicker, handshake errors, and random black-screen events.",
        goodFor: "Any multi-monitor productivity or creator setup.",
        compatibilityChecks: [
          "Cable spec supports desired resolution/refresh.",
          "GPU port version matches display requirement.",
          "Cable length does not exceed reliable range for chosen spec."
        ]
      },
      {
        partType: "GPU",
        whatToBuy: "GPU with sufficient display outputs and encoding features",
        benefit: "Supports multi-monitor productivity and conferencing without adapter chains.",
        goodFor: "Office and creator multitasking setups.",
        compatibilityChecks: [
          "Native outputs cover monitor count.",
          "Driver supports intended scaling and color depth.",
          "Dock passthrough limitations are understood."
        ]
      }
    ],
    checklist: [
      "Use native outputs where possible before daisy-chain adapters.",
      "Match cable spec to refresh and color depth goals.",
      "Set primary monitor and scaling intentionally in OS display settings.",
      "Test wake-from-sleep behavior with all monitors attached."
    ],
    steps: [
      {
        title: "Validate hardware path",
        type: "info",
        content:
          "Map each monitor to GPU output and cable standard. Confirm no unsupported adapter chain in the signal path."
      },
      {
        title: "Configure display order and scaling",
        type: "info",
        content:
          "Set monitor arrangement, refresh rates, and scaling manually to avoid mixed-DPI usability issues."
      },
      {
        title: "Stability checks",
        type: "warning",
        content:
          "If monitors drop signal after sleep, update GPU and dock firmware before replacing hardware."
      }
    ]
  },
  {
    slug: "streaming-and-recording-pc-build-guide",
    title: "Streaming and Recording PC Build Guide",
    description:
      "Build for stable streaming and recording by balancing encoder capability, CPU overhead, and I/O throughput.",
    category: "Build Profiles",
    difficulty: "Intermediate",
    budgetBand: "High-End",
    estimatedTime: "35-50 min",
    useCases: ["Streaming", "Content Creation", "Gaming"],
    tags: ["streaming", "recording", "encoder", "obs", "creator-build"],
    partRecommendations: [
      {
        partType: "GPU",
        whatToBuy: "GPU with high-quality hardware encoder support",
        benefit: "Offloads stream encoding and preserves game/app performance.",
        goodFor: "Single-PC streaming setups.",
        compatibilityChecks: [
          "Encoder support aligns with streaming platform requirements.",
          "Driver branch is stable for recording workloads.",
          "VRAM is sufficient for game + stream overlay workload."
        ]
      },
      {
        partType: "CPU",
        whatToBuy: "8-core class CPU",
        benefit: "Handles background capture, browser sources, and chat moderation tools smoothly.",
        goodFor: "Mixed game and broadcast workloads.",
        compatibilityChecks: [
          "Cooling supports sustained encode sessions.",
          "Motherboard power delivery is stable.",
          "RAM capacity sufficient for scene complexity."
        ]
      },
      {
        partType: "Storage",
        whatToBuy: "Dedicated recording SSD for media captures",
        benefit: "Prevents dropped frames from disk contention.",
        goodFor: "High-bitrate local recording workflows.",
        compatibilityChecks: [
          "Write throughput matches capture bitrate.",
          "Free-space policy prevents recording interruptions.",
          "Post-processing workflow includes archival backup."
        ]
      }
    ],
    checklist: [
      "Choose encoder strategy (hardware vs software) before final part list.",
      "Separate recording writes from OS/system drive.",
      "Validate stream stability under real scene complexity.",
      "Monitor thermals for long sessions."
    ],
    steps: [
      {
        title: "Design around encoder workflow",
        type: "info",
        content:
          "Pick platform based on target stream resolution, bitrate, and encoder quality requirements."
      },
      {
        title: "Isolate recording storage",
        type: "info",
        content:
          "Use a dedicated recording target to avoid contention with game and OS reads/writes."
      },
      {
        title: "Run long-session validation",
        type: "warning",
        content:
          "Short tests can miss thermal throttling and dropped frames that appear only in extended sessions."
      }
    ]
  },
  {
    slug: "home-office-reliability-build-guide",
    title: "Home Office Reliability Build Guide",
    description:
      "Build a reliability-first workstation for remote work with dependable networking, quiet thermals, and backup-oriented storage choices.",
    category: "Build Profiles",
    difficulty: "Beginner",
    budgetBand: "Midrange",
    estimatedTime: "25-40 min",
    useCases: ["Remote Work", "Business Apps", "Video Conferencing"],
    tags: ["home-office", "reliability", "backup", "networking", "quiet-pc"],
    partRecommendations: [
      {
        partType: "CPU",
        whatToBuy: "Efficient midrange CPU with integrated graphics or low-power discrete option",
        benefit: "Delivers reliable productivity with lower thermals and power cost.",
        goodFor: "Business users prioritizing uptime over gaming peak performance.",
        compatibilityChecks: [
          "iGPU output support matches monitor count.",
          "Cooling profile targets low sustained noise.",
          "Platform supports future memory/storage upgrades."
        ]
      },
      {
        partType: "Networking",
        whatToBuy: "2.5GbE onboard LAN and optional Wi-Fi 6E backup connectivity",
        benefit: "Provides reliable meetings and data transfer with redundancy.",
        goodFor: "Work-from-home setups with mixed wired/wireless needs.",
        compatibilityChecks: [
          "Primary desk location supports wired Ethernet path.",
          "Wi-Fi adapter driver stability verified.",
          "Router firmware is current and stable."
        ]
      },
      {
        partType: "Storage",
        whatToBuy: "Primary NVMe + scheduled backup destination",
        benefit: "Fast daily responsiveness and controlled data-protection workflow.",
        goodFor: "Knowledge workers handling business-critical files.",
        compatibilityChecks: [
          "Backup target is always available.",
          "Automated backup schedule is active.",
          "Restore test completed successfully."
        ]
      }
    ],
    checklist: [
      "Prioritize uptime, acoustics, and backup over benchmark chasing.",
      "Use wired networking as primary path when possible.",
      "Create and test a simple restore procedure.",
      "Keep firmware and drivers on stable release branches."
    ],
    steps: [
      {
        title: "Define reliability requirements",
        type: "info",
        content:
          "Document work-critical applications and acceptable downtime target before selecting parts."
      },
      {
        title: "Implement backup from day one",
        type: "info",
        content:
          "Configure scheduled backups during initial setup, not after first incident."
      },
      {
        title: "Avoid risky performance tweaks",
        type: "warning",
        content:
          "Keep office systems on stable defaults and vendor-supported settings."
      }
    ]
  },
  {
    slug: "pc-build-tools-and-bench-testing-guide",
    title: "PC Build Tools and Bench Testing Guide",
    description:
      "Set up a repeatable bench-testing workflow with essential tools and validation checkpoints before full production use.",
    category: "Assembly & Setup",
    difficulty: "Intermediate",
    budgetBand: "Entry",
    estimatedTime: "30-45 min",
    useCases: ["New Build", "System Integrator", "Troubleshooting"],
    tags: ["bench-test", "build-tools", "validation", "stability-test", "checklist"],
    partRecommendations: [
      {
        partType: "Accessories",
        whatToBuy: "Magnetic screwdriver kit, antistatic strap, thermal paste, cable ties",
        benefit: "Reduces assembly mistakes and improves serviceability.",
        goodFor: "All builders, especially first-time or repeat deployments.",
        compatibilityChecks: [
          "Tools fit common motherboard/case screws.",
          "Antistatic handling process is understood.",
          "Spare screws and standoffs are available."
        ]
      },
      {
        partType: "Accessories",
        whatToBuy: "USB toolkit with firmware files and diagnostics utilities",
        benefit: "Speeds up bring-up and issue isolation in early setup.",
        goodFor: "Anyone assembling multiple systems.",
        compatibilityChecks: [
          "USB media is tested and bootable.",
          "Firmware files match exact motherboard revision.",
          "Toolkit content is version-controlled."
        ]
      }
    ],
    checklist: [
      "Bench test core components before full cable management.",
      "Keep a known-good bootable USB for diagnostics.",
      "Document baseline temperatures and stability results.",
      "Store BIOS version and key configuration for future reference."
    ],
    steps: [
      {
        title: "Prepare controlled work area",
        type: "info",
        content:
          "Use static-safe handling, proper lighting, and labeled components to reduce assembly and troubleshooting errors."
      },
      {
        title: "Run staged validation",
        type: "info",
        content:
          "Validate POST, thermals, and storage health before final cable routing and panel closure."
      },
      {
        title: "Record baseline data",
        type: "warning",
        content:
          "Without baseline records, future regression troubleshooting becomes slower and less reliable."
      }
    ]
  }
];

const pcBuildGuides = linkRelatedGuides(guideSeeds.map(buildGuide));

export function getPCBuildGuides(): PCBuildGuide[] {
  return pcBuildGuides.map((guide) => ({
    ...guide,
    useCases: [...guide.useCases],
    tags: [...guide.tags],
    partRecommendations: guide.partRecommendations.map((part) => ({
      ...part,
      compatibilityChecks: [...part.compatibilityChecks]
    })),
    checklist: [...guide.checklist],
    steps: guide.steps.map((step) => ({ ...step })),
    commands: guide.commands.map((command) => ({ ...command })),
    safetyNotes: [...guide.safetyNotes],
    relatedGuideSlugs: [...guide.relatedGuideSlugs]
  }));
}

export function getPCBuildGuideBySlug(slug: string): PCBuildGuide | undefined {
  return pcBuildGuides.find((guide) => guide.slug === slug);
}

export function getPCBuildGuideCategories(): PCBuildGuideCategory[] {
  return [...new Set(pcBuildGuides.map((guide) => guide.category))].sort((a, b) =>
    a.localeCompare(b)
  ) as PCBuildGuideCategory[];
}

export function getPCBuildGuideTags(): string[] {
  return [...new Set(pcBuildGuides.flatMap((guide) => guide.tags))].sort((a, b) =>
    a.localeCompare(b)
  );
}

export function getPCBuildGuideDifficulties(): PCBuildDifficulty[] {
  return ["Beginner", "Intermediate", "Advanced"].filter((difficulty) =>
    pcBuildGuides.some((guide) => guide.difficulty === difficulty)
  ) as PCBuildDifficulty[];
}

export function getPCBuildGuideBudgetBands(): PCBuildBudgetBand[] {
  return ["Entry", "Midrange", "High-End", "Enthusiast"].filter((budgetBand) =>
    pcBuildGuides.some((guide) => guide.budgetBand === budgetBand)
  ) as PCBuildBudgetBand[];
}
