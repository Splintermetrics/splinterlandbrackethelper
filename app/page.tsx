export default function HomePage() {
  return (
    <main className="container">
      <div className="hero">
        <h1>Bracket Helper</h1>
        <p>Splinterlands Modern bracket analyzer</p>
        <p className="muted">
          Enter a username to analyze the strongest bracket fit.
        </p>

        <form action="/analyze" method="get" className="searchForm">
          <input
            type="text"
            name="username"
            placeholder="Enter Splinterlands username"
            className="input"
            required
          />
          <button type="submit" className="button">
            Analyze
          </button>
        </form>
      </div>
    </main>
  );
}
