type AnalyzeUserPageProps = {
  params: Promise<{
    username: string;
  }>;
};

async function getAnalysis(username: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL?.startsWith("http")
      ? process.env.VERCEL_URL
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";

  const resolvedBaseUrl =
    typeof baseUrl === "string" ? baseUrl : "http://localhost:3000";

  const response = await fetch(
    `${resolvedBaseUrl}/api/analyze/${encodeURIComponent(username)}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("Failed to analyze collection");
  }

  return response.json();
}

export default async function AnalyzeUserPage({
  params,
}: AnalyzeUserPageProps) {
  const { username } = await params;
  const data = await getAnalysis(username);

  return (
    <main className="container">
      <div className="panel">
        <h1>Bracket Analysis</h1>
        <p>
          <strong>Player:</strong> {data.username}
        </p>
        <p>
          <strong>Best Bracket:</strong> {data.bestBracket}
        </p>
        <p>
          <strong>Confidence:</strong> {data.confidence}%
        </p>

        <h2>Bracket Scores</h2>
        <ul>
          {Object.entries(data.bracketScores).map(([bracket, score]) => (
  <li key={bracket}>
    {bracket}: {Number(score)}
  </li>
          ))}
        </ul>

        <h2>Recommendations</h2>
        <ul>
          {data.recommendations.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <p className="muted">
          This is the starter results page. Heatmap and richer UI can be added
          next.
        </p>
      </div>
    </main>
  );
}
