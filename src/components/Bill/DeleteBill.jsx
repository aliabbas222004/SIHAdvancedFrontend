import React, { useState } from 'react';
import ToastMessage from '../ToastMessage';

const DeleteBill = () => {
  const [billId, setBillId] = useState('');
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();

    if (!billId.trim()) {
      setMessage('Please enter Bill ID');
      setStatus('danger');
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bill/deleteBill`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            billId: billId.trim()
          })
        }
      );

      const data = await res.json();

      setMessage(data.message);
      setStatus(
        data.status === "success"
          ? "success"
          : "danger"
      );

      if (res.ok) setBillId('');

    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
      setStatus("danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container">
        <div className="row justify-content-center mt-5">
          <div className="col-md-6">

            <h2 className="text-center mb-4">
              Delete Bill
            </h2>

            <form onSubmit={handleDelete}>
              <div className="mb-3">
                <label className="form-label">
                  Bill ID
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Bill ID"
                  value={billId}
                  onChange={(e) =>
                    setBillId(e.target.value)
                  }
                />
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-danger"
                  disabled={loading}
                >
                  {loading
                    ? "Deleting..."
                    : "Delete Bill"}
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>

      <ToastMessage
        message={message}
        type={status}
        onClose={() => {
          setMessage(null);
          setStatus('');
        }}
      />
    </>
  );
};

export default DeleteBill;