import React, { useEffect, useState } from 'react';

const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
const apiHost = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
  : 'http://localhost:8000/api/activities/';
const endpoint = `${apiHost}`;

function Activities() {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchActivities = () => {
    setLoading(true);
    setError(null);
    console.log('Activities endpoint:', endpoint);
    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Activities fetched data:', data);
        setRawData(data);
        const payload = Array.isArray(data) ? data : data.results ?? [];
        setActivities(payload);
        setFilteredActivities(payload);
      })
      .catch((fetchError) => {
        console.error('Activities fetch error:', fetchError);
        setError(fetchError.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    const lowerSearch = search.trim().toLowerCase();
    if (!lowerSearch) {
      setFilteredActivities(activities);
      return;
    }
    setFilteredActivities(
      activities.filter((activity) =>
        Object.values(activity)
          .join(' ')
          .toLowerCase()
          .includes(lowerSearch)
      )
    );
  }, [search, activities]);

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <h2 className="h5 mb-1">Activities</h2>
          <p className="mb-0 text-muted">
            REST API endpoint:{' '}
            <a href={endpoint} target="_blank" rel="noreferrer" className="link-primary">
              {endpoint}
            </a>
          </p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <button type="button" className="btn btn-primary" onClick={fetchActivities}>
            Refresh
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(true)}>
            View JSON
          </button>
        </div>
      </div>

      <div className="card-body">
        <form
          className="row g-2 mb-3"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <div className="col-12 col-md-8">
            <label htmlFor="activitySearch" className="form-label visually-hidden">
              Search activities
            </label>
            <input
              id="activitySearch"
              type="search"
              className="form-control"
              placeholder="Search activities..."
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

        {loading && <div className="alert alert-info">Loading activities...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && filteredActivities.length === 0 && (
          <div className="alert alert-warning">No activities found.</div>
        )}

        {!loading && filteredActivities.length > 0 && (
          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.map((activity) => (
                  <tr key={activity.id ?? activity.pk ?? activity.name}>
                    <td>{activity.id ?? activity.pk ?? '-'}</td>
                    <td>{activity.name ?? activity.title ?? '-'}</td>
                    <td>{activity.type ?? '-'}</td>
                    <td>{activity.duration ?? '-'}</td>
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
                  <h5 className="modal-title">Activities JSON</h5>
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

export default Activities;
