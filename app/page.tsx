import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>AI Frontend Capstone</h1>
      <p>
        A foundation for an AI-enhanced frontend application.
      </p>

      <section>
        <h2>Foundations</h2>
        <p>
          The application structure, navigation, and health check are being
          established during the Foundations phase.
        </p>
      </section>

      <nav aria-label="Quick links">
        <Link href="/chat">Go to Chat</Link>
        <Link href="/history">View History</Link>
        <Link href="/health">Check Health</Link>
      </nav>
    </main>
  );
}
