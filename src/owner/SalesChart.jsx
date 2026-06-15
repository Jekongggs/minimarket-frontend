export default function SalesChart({ data = [], height = 220 }) {
  const chart = Array.isArray(data) ? data : [];
  const max = Math.max(
    1,
    ...chart.map((d) => Number(d.total) || 0)
  );

  if (!chart.length) {
    return (
      <div className="sales-chart sales-chart--empty" style={{ height }}>
        <p>Belum ada data penjualan.</p>
      </div>
    );
  }

  return (
    <div className="sales-chart" style={{ height }}>
      <div className="sales-chart__bars">
        {chart.map((d) => {
          const online = Number(d.online) || 0;
          const pos = Number(d.pos) || 0;
          const total = Number(d.total) || 0;
          const pct = Math.round((total / max) * 100);
          const label = d.date ? d.date.slice(5) : '';

          return (
            <div
              key={d.date}
              className="sales-chart__col"
              title={`Total: Rp ${total.toLocaleString('id-ID')} (Online: Rp ${online.toLocaleString('id-ID')}, POS: Rp ${pos.toLocaleString('id-ID')})`}
            >
              <div className="sales-chart__stack" style={{ height: `${Math.max(4, pct)}%` }}>
                {online > 0 && (
                  <span className="sales-chart__seg sales-chart__seg--online" style={{ flex: online }} />
                )}
                {pos > 0 && (
                  <span className="sales-chart__seg sales-chart__seg--pos" style={{ flex: pos }} />
                )}
              </div>
              <span className="sales-chart__label">{label}</span>
            </div>
          );
        })}
      </div>
      <div className="sales-chart__legend">
        <span>
          <i className="sales-chart__dot sales-chart__dot--online" /> Online (pembayaran terverifikasi)
        </span>
        <span>
          <i className="sales-chart__dot sales-chart__dot--pos" /> Kasir POS
        </span>
      </div>
    </div>
  );
}
