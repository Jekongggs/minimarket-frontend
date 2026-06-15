export default function OmsetProfitChart({ data = [], height = 220 }) {
  const chart = Array.isArray(data) ? data : [];
  const max = Math.max(
    1,
    ...chart.flatMap((d) => [Number(d.total) || 0, Number(d.profit) || 0])
  );

  if (!chart.length) {
    return (
      <div className="sales-chart sales-chart--empty" style={{ height }}>
        <p>Belum ada data omset &amp; profit.</p>
      </div>
    );
  }

  return (
    <div className="sales-chart omset-profit-chart" style={{ height }}>
      <div className="sales-chart__bars omset-profit-chart__bars">
        {chart.map((d) => {
          const omset = Number(d.total) || 0;
          const profit = Number(d.profit) || 0;
          const omsetPct = Math.round((omset / max) * 100);
          const profitPct = Math.round((profit / max) * 100);
          const label = d.date ? d.date.slice(5) : '';

          return (
            <div key={d.date} className="sales-chart__col omset-profit-chart__col">
              <div className="omset-profit-chart__pair">
                <div
                  className="omset-profit-chart__bar omset-profit-chart__bar--omset"
                  style={{ height: `${Math.max(4, omsetPct)}%` }}
                  title={`Omset: Rp ${omset.toLocaleString('id-ID')}`}
                />
                <div
                  className="omset-profit-chart__bar omset-profit-chart__bar--profit"
                  style={{ height: `${Math.max(4, profitPct)}%` }}
                  title={`Profit: Rp ${profit.toLocaleString('id-ID')}`}
                />
              </div>
              <span className="sales-chart__label">{label}</span>
            </div>
          );
        })}
      </div>
      <div className="sales-chart__legend">
        <span>
          <i className="sales-chart__dot sales-chart__dot--online" /> Omset
        </span>
        <span>
          <i className="sales-chart__dot sales-chart__dot--profit" /> Profit
        </span>
      </div>
    </div>
  );
}
