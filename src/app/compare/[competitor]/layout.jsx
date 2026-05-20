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
      description: "Compare Automixa with other Instagram automation platforms to find the safest, most effective tool for modern creators."
    };
  }

  return {
    title: data.metaTitle,
    description: data.metaDesc,
    alternates: {
      canonical: `https://automixa.in/compare/${competitor}`,
    }
  };
}

export default function CompareLayout({ children }) {
  return children;
}
