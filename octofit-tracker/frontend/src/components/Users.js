import React, { useEffect, useState } from 'react';

const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
const apiHost = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/users/`
  : 'http://localhost:8000/api/users/';
const endpoint = `${apiHost}`;

function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    setError(null);
    console.log('Users endpoint:', endpoint);
    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Users fetched data:', data);
        setRawData(data);
        const payload = Array.isArray(data) ? data : data.results ?? [];
        setUsers(payload);
        setFilteredUsers(payload);
      })
      .catch((fetchError) => {
        console.error('Users fetch error:', fetchError);
        setError(fetchError.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      setFilteredUsers(users);
      return;
    }
    setFilteredUsers(
      users.filter((user) =>
        Object.values(user)
          .join(' ')
          .toLowerCase()
          .includes(query)
      )
    );
  }, [search, users]);

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <h2 className="h5 mb-1">Users</h2>
          <p className="mb-0 text-muted">
            REST API endpoint:{' '}
            <a href={endpoint} target="_blank" rel="noreferrer" className="link-primary">
              {endpoint}
            </a>
          </p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <button type="button" className="btn btn-primary" onClick={fetchUsers}>
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
            <label htmlFor="userSearch" className="form-label visually-hidden">
              Search users
            </label>
            <input
              id="userSearch"
              type="search"
              className="form-control"
              placeholder="Search users..."
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

        {loading && <div className="alert alert-info">Loading users...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && filteredUsers.length === 0 && (
          <div className="alert alert-warning">No users found.</div>
        )}

        {!loading && filteredUsers.length > 0 && (
          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id ?? user.pk ?? user.username}>
                    <td>{user.id ?? user.pk ?? '-'}</td>
                    <td>{user.username ?? user.name ?? '-'}</td>
                    <td>{user.email ?? '-'}</td>
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
                  <h5 className="modal-title">Users JSON</h5>
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

export default Users;
