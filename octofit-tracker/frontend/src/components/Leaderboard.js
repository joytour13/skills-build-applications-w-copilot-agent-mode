import React, { useEffect, useState } from 'react';

const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
const apiHost = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
  : 'http://localhost:8000/api/leaderboard/';
const endpoint = `${apiHost}`;

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchLeaderboard = () => {
    setLoading(true);
    setError(null);
    console.log('Leaderboard endpoint:', endpoint);
    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Leaderboard fetched data:', data);
        setRawData(data);
        const payload = Array.isArray(data) ? data : data.results ?? [];
        setEntries(payload);
        setFilteredEntries(payload);
      })
      .catch((fetchError) => {
        console.error('Leaderboard fetch error:', fetchError);
        setError(fetchError.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      setFilteredEntries(entries);
      return;
    }
    setFilteredEntries(
      entries.filter((entry) =>
        Object.values(entry)
          .join(' ')
          .toLowerCase()
          .includes(q)
      )
    );
  }, [search, entries]);

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <h2 className="h5 mb-1">Leaderboard</h2>
          <p className="mb-0 text-muted">
            REST API endpoint:{' '}
            <a href={endpoint} target="_blank" rel="noreferrer" className="link-primary">
              {endpoint}
            </a>
          </p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <button type="button" className="btn btn-primary" onClick={fetchLeaderboard}>
            Refresh
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(true)}>
            View JSON
          </button>
        </div>
      </div>

      <div className="card-body">
        <form className="row g-2 mb-3" onSubmit={(event) => event.preventDefault()}>
          <div className="col-12 col-md-8">
            <label htmlFor="leaderboardSearch" className="form-label visually-hidden">
              Search leaderboard
            </label>
            <input
              id="leaderboardSearch"
              type="search"
              className="form-control"
              placeholder="Search leaderboard..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="col-12 col-md-4 d-grid">
            <button type="button" className="btn btn-outline-primary" onClick={() => setSearch('')}>
              Clear search
            </button>
          </div>
        </form>

        {loading && <div className="alert alert-info">Loading leaderboard...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && filteredEntries.length === 0 && (
          <div className="alert alert-warning">No leaderboard entries found.</div>
        )}

        {!loading && filteredEntries.length > 0 && (
          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>User</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry, index) => (
                  <tr key={entry.id ?? entry.pk ?? index}>
                    <td>{entry.rank ?? index + 1}</td>
                    <td>{entry.user ?? entry.username ?? '-'}</td>
                    <td>{entry.score ?? entry.points ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && rawData && (
        <>
          <div className="modal-backdrop-custom" onClick={() => setShowModal(false)} />
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Leaderboard JSON</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)} />
                </div>
                <div className="modal-body">
                  <pre>{JSON.stringify(rawData, null, 2)}</pre>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Leaderboard;
