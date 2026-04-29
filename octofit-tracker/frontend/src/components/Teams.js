import React, { useEffect, useState } from 'react';

const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
const apiHost = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
  : 'http://localhost:8000/api/teams/';
const endpoint = `${apiHost}`;

function Teams() {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchTeams = () => {
    setLoading(true);
    setError(null);
    console.log('Teams endpoint:', endpoint);
    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Teams fetched data:', data);
        setRawData(data);
        const payload = Array.isArray(data) ? data : data.results ?? [];
        setTeams(payload);
        setFilteredTeams(payload);
      })
      .catch((fetchError) => {
        console.error('Teams fetch error:', fetchError);
        setError(fetchError.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      setFilteredTeams(teams);
      return;
    }
    setFilteredTeams(
      teams.filter((team) =>
        Object.values(team)
          .join(' ')
          .toLowerCase()
          .includes(query)
      )
    );
  }, [search, teams]);

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <h2 className="h5 mb-1">Teams</h2>
          <p className="mb-0 text-muted">
            REST API endpoint:{' '}
            <a href={endpoint} target="_blank" rel="noreferrer" className="link-primary">
              {endpoint}
            </a>
          </p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <button type="button" className="btn btn-primary" onClick={fetchTeams}>
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
            <label htmlFor="teamSearch" className="form-label visually-hidden">
              Search teams
            </label>
            <input
              id="teamSearch"
              type="search"
              className="form-control"
              placeholder="Search teams..."
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

        {loading && <div className="alert alert-info">Loading teams...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && filteredTeams.length === 0 && (
          <div className="alert alert-warning">No teams found.</div>
        )}

        {!loading && filteredTeams.length > 0 && (
          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Members</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.map((team) => (
                  <tr key={team.id ?? team.pk ?? team.name}>
                    <td>{team.id ?? team.pk ?? '-'}</td>
                    <td>{team.name ?? team.title ?? '-'}</td>
                    <td>{team.members_count ?? team.members?.length ?? '-'}</td>
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
                  <h5 className="modal-title">Teams JSON</h5>
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

export default Teams;
