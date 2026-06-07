"use client";

export function KycActions() {
  const handleApprove = async () => {
    const id = prompt('Investor ID para KYC approve?');
    if (id) {
      try {
        const res = await fetch('/api/admin/compliance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ investorId: id, action: 'approve' })
        });
        if (res.ok) {
          alert('KYC approved real DB');
          location.reload();
        } else {
          alert('Error approving KYC');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to connect to API');
      }
    }
  };

  const handleReject = async () => {
    const id = prompt('Investor ID para KYC reject?');
    if (id) {
      try {
        const res = await fetch('/api/admin/compliance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ investorId: id, action: 'reject' })
        });
        if (res.ok) {
          alert('KYC rejected real DB');
          location.reload();
        } else {
          alert('Error rejecting KYC');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to connect to API');
      }
    }
  };

  return (
    <>
      <button 
        onClick={handleApprove} 
        className="px-2 py-1 text-xs border border-emerald-700 rounded text-emerald-400 hover:bg-emerald-900/20 transition-colors"
      >
        Approve KYC real
      </button>
      <button 
        onClick={handleReject} 
        className="px-2 py-1 text-xs border border-red-700 rounded text-red-400 hover:bg-red-900/20 transition-colors"
      >
        Reject KYC real
      </button>
    </>
  );
}
