import { competitorsData } from "@/data/comparisons";

export function generateStaticParams() {
  return [
    { competitor: "manychat" },
    { competitor: "chatfuel" },
    { competitor: "instachamp" },
    { competitor: "convertdm" },
    { competitor: "whosedm" }
  ];
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const competitor = resolvedParams.competitor;
  const data = competitorsData[competitor];
  if (!data) {
    return {
      title: "Instagram Automation Comparison | Automixa",
      description: "Compare Automixa with other Instagram business messaging platforms for comment replies, DMs, Smart Bio, and customer workflow management.",
      keywords: [
        "Instagram business messaging comparison",
        "ManyChat alternative India",
        "Chatfuel alternative",
        "Instagram DM workflow",
        "Instagram comment auto reply",
        "Meta Graph API automation",
        "Customer messaging tool India",
      ],
    };
  }

  return {
    title: data.metaTitle,
    description: data.metaDesc,
    keywords: [
      "ManyChat alternative India",
      "Instagram business messaging India",
      "Instagram DM workflow India",
      "Instagram comment to DM",
      "Meta Graph API automation",
      `${competitor} alternative`,
      `Automixa vs ${competitor}`,
    ],
    alternates: {
      canonical: `https://automixa.in/compare/${competitor}`,
    }
  };
}

export default function CompareLayout({ children }) {
  return children;
}
