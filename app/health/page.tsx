type HealthStatus = {
    status: string;
    source: string;
  };
  
  async function getHealthStatus(): Promise<HealthStatus> {
    await new Promise((resolve) => setTimeout(resolve, 300));
  
    return {
      status: "healthy",
      source: "mock health check",
    };
  }
  
  export default async function HealthPage() {
    const health = await getHealthStatus();
  
    return (
      <main className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Health Check
          </h1>
          <p className="text-muted">
            A simple server-side check using mock data.
          </p>
        </header>
  
        <section className="rounded-lg border border-border bg-white p-6">
          <h2 className="text-lg font-semibold">Service status</h2>
  
          <dl className="mt-4 space-y-3">
            <div>
              <dt className="text-sm text-muted">Status</dt>
              <dd className="font-medium">{health.status}</dd>
            </div>
  
            <div>
              <dt className="text-sm text-muted">Data source</dt>
              <dd className="font-medium">{health.source}</dd>
            </div>
          </dl>
        </section>
      </main>
    );
  }
  