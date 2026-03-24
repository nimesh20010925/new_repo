import React, { useState, useEffect } from 'react';
import { Activity, Baby, Calendar, Clipboard, UploadCloud, AlertCircle, CheckCircle } from 'lucide-react';

export default function Home({ token, user }) {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [childName, setChildName] = useState('');
  const [ageMonths, setAgeMonths] = useState('');
  const [pred, setPred] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
    try {
      const res = await fetch('http://localhost:3001/api/records', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch records');
      const arr = await res.json();
      setRecords(arr);
    } catch (err) {
      console.error('Fetch records error:', err);
    }
  }

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!image || !childName || !ageMonths) {
      alert('Please fill all fields: name, age, and photo');
      return;
    }

    setLoading(true);

    const fd = new FormData();
    fd.append('image', image);
    fd.append('childName', childName);
    fd.append('ageMonths', ageMonths);

    try {
      const res = await fetch('http://localhost:3001/api/predict/image', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Prediction failed');

      // Normalize prediction keys for new format
      const normalized = {
        gender: data.prediction.predicted_gender_cnn === 0 ? 'female' : 'male',
        height: data.prediction.predicted_height_cnn ?? null,
        weight: data.prediction.predicted_weight_cnn ?? null,
        ageMonths: data.prediction.manual_age_input ?? data.ageMonths,
        stuntingCategory: data.prediction.predicted_stunting_category ?? 'Unknown',
        wastingCategory: data.prediction.predicted_wasting_category ?? 'Unknown',
        // Keep old format for backward compatibility
        stuntingProb: data.prediction.stuntingProb ?? 0,
        wastingProb: data.prediction.wastingProb ?? 0,
        label: data.prediction.health_status ?? 'unknown'
      };

      setPred(normalized);
      fetchRecords();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Something went wrong during prediction');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (prob) => {
    if (prob >= 0.7) return 'bg-red-100 text-red-700 border-red-200';
    if (prob >= 0.4) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-green-100 text-green-700 border-green-200';
  };

  const activePred = pred;

  // Determine if child is at risk based on categories
  const isAtRisk =
    activePred &&
    (activePred.stuntingCategory?.toLowerCase().includes('stunted') ||
      activePred.wastingCategory?.toLowerCase().includes('wasted') ||
      activePred.wastingCategory?.toLowerCase().includes('risk') ||
      activePred.label?.toLowerCase().includes('unhealthy'));

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Child <span className="text-teal-600">Health AI</span>
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Hello, {user?.name || 'Parent'}. Monitoring growth, simplified.
          </p>
        </div>

        <div className="hidden md:block bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold">
              {user?.name?.[0]?.toUpperCase() || 'P'}
            </div>
            <span className="font-medium text-slate-700">Health Monitor Active</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column - Input */}
        <div className="lg:col-span-4 space-y-6">
          {/* Manual mode toggle */}


          <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 mb-6">
              <Baby className="text-teal-500" /> New Assessment
            </h2>

            <form onSubmit={submit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 ml-1">Child's Name</label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-teal-50 focus:border-teal-500 transition-all outline-none"
                  placeholder="e.g. Leo"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 ml-1">Age (Months)</label>
                <input
                  type="number"
                  value={ageMonths}
                  onChange={(e) => setAgeMonths(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-teal-50 focus:border-teal-500 transition-all outline-none"
                  placeholder="1-60"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 ml-1">Photo Analysis</label>
                <div className="relative group cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFile}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div
                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${imagePreview
                      ? 'border-teal-400 bg-teal-50'
                      : 'border-slate-200 group-hover:border-teal-300'
                      }`}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        className="w-full h-40 object-cover rounded-xl shadow-md"
                        alt="Preview"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-slate-400">
                        <UploadCloud size={40} className="mb-2" />
                        <span className="text-sm font-medium">Click to upload photo</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !image || !childName || !ageMonths}
                className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-teal-600 transition-all transform active:scale-[0.98] disabled:bg-slate-300 shadow-lg shadow-teal-100 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing AI Models...' : 'Run Diagnostics'}
              </button>
            </form>
          </section>
        </div>

        {/* Right column - Results + History */}
        <div className="lg:col-span-8 space-y-8">
          {activePred ? (
            <>
              {/* Results Card */}
              <div className="bg-white rounded-3xl shadow-xl border border-teal-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Analysis Results</h3>
                    <p className="text-slate-500">Generated by AI Health Engine</p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full font-bold text-sm ${isAtRisk ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}
                  >
                    {isAtRisk ? 'AT RISK' : 'NORMAL'}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <MetricCard label="Height" value={activePred.height ? `${activePred.height.toFixed(1)} cm` : '—'} icon={<Activity size={18} />} />
                  <MetricCard label="Weight" value={activePred.weight ? `${activePred.weight.toFixed(2)} kg` : '—'} icon={<Activity size={18} />} />
                  <MetricCard label="Gender" value={activePred.gender || '—'} icon={<Baby size={18} />} />
                  <MetricCard label="Age" value={activePred.ageMonths ? `${activePred.ageMonths} months` : '—'} icon={<Calendar size={18} />} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-700 mb-2">Stunting Category</h4>
                    <div className={`px-3 py-2 rounded-lg font-medium text-sm ${activePred.stuntingCategory?.toLowerCase().includes('stunted') ? 'bg-red-100 text-red-700' :
                      activePred.stuntingCategory?.toLowerCase().includes('tall') ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                      {activePred.stuntingCategory || 'Unknown'}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-700 mb-2">Wasting Category</h4>
                    <div className={`px-3 py-2 rounded-lg font-medium text-sm ${activePred.wastingCategory?.toLowerCase().includes('wasted') ? 'bg-red-100 text-red-700' :
                      activePred.wastingCategory?.toLowerCase().includes('overweight') || activePred.wastingCategory?.toLowerCase().includes('risk') ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                      {activePred.wastingCategory || 'Unknown'}
                    </div>
                  </div>
                </div>
              </div>


            </>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl text-slate-400">
              <Activity size={48} className="mb-4 opacity-20" />
              <p>Upload data or use manual mode to see results & nutrition guidance</p>
            </div>
          )}

          {/* History Table */}
          <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Clipboard size={20} className="text-teal-500" /> Recent History
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Image</th>
                    <th className="px-6 py-4 font-semibold">Child</th>
                    <th className="px-6 py-4 font-semibold">Age</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Stunting</th>
                    <th className="px-6 py-4 font-semibold">Wasting</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Height</th>
                    <th className="px-6 py-4 font-semibold">Weight</th>
                    <th className="px-6 py-4 font-semibold">Gender</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.map((r) => {
                    const isRecordAtRisk =
                      (r.prediction?.predicted_stunting_category?.toLowerCase().includes('stunted')) ||
                      (r.prediction?.predicted_wasting_category?.toLowerCase().includes('wasted')) ||
                      (r.prediction?.predicted_wasting_category?.toLowerCase().includes('risk'));
                    const imageUrl = r.imageUrl || r.prediction?.imageUrl || '';
                    const gender = r.prediction?.predicted_gender_cnn === 0 ? 'female' : r.prediction?.predicted_gender_cnn === 1 ? 'male' : '—';
                    const height = r.prediction?.predicted_height_cnn != null ? `${Number(r.prediction.predicted_height_cnn).toFixed(1)} cm` : '—';
                    const weight = r.prediction?.predicted_weight_cnn != null ? `${Number(r.prediction.predicted_weight_cnn).toFixed(2)} kg` : '—';

                    return (
                      <tr key={r._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          {imageUrl ? (
                            <img src={imageUrl} alt="child" className="h-10 w-10 rounded-full object-cover" />
                          ) : (
                            <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-slate-200 text-xs text-slate-500">No</span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900">{r.childName || '—'}</td>
                        <td className="px-6 py-4 text-slate-600">{r.ageMonths ?? '—'}</td>
                        <td className="px-6 py-4 text-slate-500 text-sm">
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold ${r.prediction?.predicted_stunting_category?.toLowerCase().includes('stunted') ? 'bg-red-100 text-red-700' :
                            r.prediction?.predicted_stunting_category?.toLowerCase().includes('tall') ? 'bg-green-100 text-green-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                            {r.prediction?.predicted_stunting_category || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold ${r.prediction?.predicted_wasting_category?.toLowerCase().includes('wasted') ? 'bg-red-100 text-red-700' :
                            r.prediction?.predicted_wasting_category?.toLowerCase().includes('overweight') ||
                              r.prediction?.predicted_wasting_category?.toLowerCase().includes('risk') ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                            {r.prediction?.predicted_wasting_category || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {isRecordAtRisk ? (
                            <span className="text-red-500 flex items-center gap-1 text-sm">
                              <AlertCircle size={14} /> At Risk
                            </span>
                          ) : (
                            <span className="text-green-500 flex items-center gap-1 text-sm">
                              <CheckCircle size={14} /> Normal
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-700">{height}</td>
                        <td className="px-6 py-4 text-slate-700">{weight}</td>
                        <td className="px-6 py-4 text-slate-700 capitalize">{gender}</td>
                      </tr>
                    );
                  })}
                  {records.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                        No assessments yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main >
    </div >
  );
}

// Sub-components (unchanged)
const MetricCard = ({ label, value, icon }) => (
  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
    <div className="text-slate-400 mb-2">{icon}</div>
    <div className="text-xs font-bold text-slate-500 uppercase">{label}</div>
    <div className="text-lg font-extrabold text-slate-800">{value}</div>
  </div>
);

const RiskBar = ({ label, prob }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm font-bold text-slate-700">
      <span>{label}</span>
      <span>{(prob * 100).toFixed(1)}%</span>
    </div>
    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
      <div
        className={`h-full transition-all duration-1000 ${prob > 0.7 ? 'bg-red-500' : prob > 0.4 ? 'bg-yellow-500' : 'bg-green-500'
          }`}
        style={{ width: `${Math.min(prob * 100, 100)}%` }}
      />
    </div>
  </div>
);