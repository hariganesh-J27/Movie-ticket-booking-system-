import React, { useState } from 'react';
import { X, Play, Database, FileText, Trash2, PlusCircle, CheckCircle, AlertCircle, RefreshCw, Copy, Download } from 'lucide-react';
import { executeAdminSql } from '../api';

export default function AdminSqlConsole({ onClose, onDatabaseChanged }) {
  const [activeTab, setActiveTab] = useState('console'); // 'console' | 'oracle-schema' | 'oracle-queries'
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM theaters;');
  const [executionResult, setExecutionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Sample Preset Queries for quick demo
  const presets = [
    { label: 'View 3 Theaters', query: 'SELECT * FROM theaters;' },
    { label: 'View All Movies', query: 'SELECT * FROM movies;' },
    { label: 'View All Bookings', query: 'SELECT * FROM bookings;' },
    {
      label: 'SQL INSERT Movie',
      query: "INSERT INTO movies (title, genre, duration, rating, language, description) VALUES ('Pushpa 2: The Rule', 'Action / Drama', 180, 8.9, 'Hindi', 'The rule of Pushpa Raj continues in this epic action sequel.');"
    },
    {
      label: 'SQL DELETE Movie',
      query: "DELETE FROM movies WHERE title LIKE '%Pushpa%';"
    },
    {
      label: 'SQL DELETE Booking',
      query: "DELETE FROM bookings WHERE booking_id = 1;"
    }
  ];

  const handleRunQuery = async () => {
    if (!sqlQuery.trim()) return;
    setLoading(true);
    setStatusMessage('');
    setExecutionResult(null);

    try {
      const res = await executeAdminSql(sqlQuery);
      setExecutionResult(res);

      if (res.success) {
        setStatusMessage('SQL Query Executed Successfully!');
        if (onDatabaseChanged) onDatabaseChanged();
      } else {
        setStatusMessage(`Error: ${res.error}`);
      }
    } catch (err) {
      setExecutionResult({ success: false, error: err.message });
      setStatusMessage(`Failed to execute query: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const oracleSchemaContent = `-- Oracle SQL Database Schema (BookMyShow)
CREATE TABLE MOVIES (
    movie_id NUMBER PRIMARY KEY,
    title VARCHAR2(150) NOT NULL,
    genre VARCHAR2(100) NOT NULL,
    duration NUMBER NOT NULL,
    rating NUMBER(3,1),
    language VARCHAR2(50) DEFAULT 'English'
);

CREATE TABLE THEATERS (
    theater_id NUMBER PRIMARY KEY,
    name VARCHAR2(150) NOT NULL,
    location VARCHAR2(200) NOT NULL,
    city VARCHAR2(100) DEFAULT 'Mumbai'
);

CREATE TABLE SHOWTIMES (
    showtime_id NUMBER PRIMARY KEY,
    movie_id NUMBER REFERENCES MOVIES(movie_id),
    theater_id NUMBER REFERENCES THEATERS(theater_id),
    show_date DATE NOT NULL,
    show_time VARCHAR2(20) NOT NULL
);

CREATE TABLE BOOKINGS (
    booking_id NUMBER PRIMARY KEY,
    booking_ref VARCHAR2(30) UNIQUE NOT NULL,
    user_name VARCHAR2(100) NOT NULL,
    user_email VARCHAR2(100) NOT NULL,
    total_amount NUMBER(10,2) NOT NULL
);`;

  const oracleQueriesContent = `-- Oracle SQL CRUD Queries
-- 1. INSERT Movie Command
INSERT INTO MOVIES (movie_id, title, genre, duration, rating, language)
VALUES (movie_seq.NEXTVAL, 'Jawan: Extended Cut', 'Action/Thriller', 169, 8.4, 'Hindi');

-- 2. INSERT 3 Theaters Command
INSERT INTO THEATERS (theater_id, name, location, city) VALUES (1, 'PVR: Forum Mall', 'Koramangala', 'Bengaluru');
INSERT INTO THEATERS (theater_id, name, location, city) VALUES (2, 'INOX: Megaplex', 'MG Road', 'Mumbai');
INSERT INTO THEATERS (theater_id, name, location, city) VALUES (3, 'Cinépolis: Nexus Galleria', 'Viman Nagar', 'Pune');

-- 3. DELETE Booking Command
DELETE FROM BOOKINGS WHERE booking_ref = 'BMS-982341';

-- 4. DELETE Movie Command
DELETE FROM MOVIES WHERE movie_id = 3;`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-gray-900 text-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="bg-bms-darker p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-bms-red rounded-lg">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Interactive SQL Command Console & Oracle SQL Scripts</h2>
              <p className="text-xs text-gray-400">Execute live SQL commands (INSERT, DELETE, SELECT) or view Oracle SQL DDL</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-800 px-4 border-b border-gray-700 flex items-center gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('console')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'console' ? 'border-bms-red text-bms-red font-bold' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            ⚡ Live SQL Console
          </button>
          <button
            onClick={() => setActiveTab('oracle-schema')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'oracle-schema' ? 'border-bms-red text-bms-red font-bold' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            📄 Oracle SQL Schema (`oracle_schema.sql`)
          </button>
          <button
            onClick={() => setActiveTab('oracle-queries')}
            className={`py-3 border-b-2 transition ${
              activeTab === 'oracle-queries' ? 'border-bms-red text-bms-red font-bold' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            📄 Oracle CRUD Queries (`oracle_queries.sql`)
          </button>
        </div>

        {/* Tab 1: Live SQL Console */}
        {activeTab === 'console' && (
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            
            {/* Presets Bar */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">Quick Preset Commands (Click to load):</label>
              <div className="flex flex-wrap gap-2">
                {presets.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setSqlQuery(p.query)}
                    className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 rounded-lg text-xs font-medium transition cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SQL Input Area */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-gray-300">Type SQL Query (SELECT, INSERT, UPDATE, DELETE):</label>
                <span className="text-[10px] text-emerald-400">SQL Engine Connected</span>
              </div>
              <textarea
                rows={4}
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                className="w-full p-3 font-mono text-xs bg-black text-emerald-400 border border-gray-700 rounded-xl focus:ring-2 focus:ring-bms-red focus:outline-none"
              />

              <div className="flex items-center justify-between mt-3">
                <button
                  onClick={handleRunQuery}
                  disabled={loading}
                  className="flex items-center gap-2 bg-bms-red hover:bg-red-600 text-white font-bold px-6 py-2 rounded-xl text-xs shadow transition active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  <span>Run SQL Query</span>
                </button>

                {statusMessage && (
                  <span className={`text-xs font-medium ${executionResult?.success ? 'text-emerald-400' : 'text-red-400'}`}>
                    {statusMessage}
                  </span>
                )}
              </div>
            </div>

            {/* Query Output Display */}
            {executionResult && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Execution Output</h4>

                {executionResult.success ? (
                  executionResult.result?.type === 'SELECT' ? (
                    <div className="overflow-x-auto bg-black rounded-xl border border-gray-800 max-h-60">
                      <table className="w-full text-left text-xs text-gray-300 font-mono">
                        <thead className="bg-gray-800 text-gray-200 uppercase text-[10px] sticky top-0">
                          <tr>
                            {executionResult.result.rows.length > 0 &&
                              Object.keys(executionResult.result.rows[0]).map((key) => (
                                <th key={key} className="p-2 border-b border-gray-700">{key}</th>
                              ))}
                          </tr>
                        </thead>
                        <tbody>
                          {executionResult.result.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-gray-900 border-b border-gray-800/50">
                              {Object.values(row).map((val, cIdx) => (
                                <td key={cIdx} className="p-2 truncate max-w-xs">{String(val)}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-4 bg-emerald-950/50 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-mono">
                      Query executed successfully! Rows affected / modified: {executionResult.result?.changes || 1}
                    </div>
                  )
                ) : (
                  <div className="p-4 bg-red-950/50 border border-red-800 text-red-300 rounded-xl text-xs font-mono">
                    {executionResult.error}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Oracle SQL Schema */}
        {activeTab === 'oracle-schema' && (
          <div className="p-6 overflow-y-auto space-y-4 flex-1 font-mono text-xs">
            <div className="flex justify-between items-center text-gray-400">
              <span>File: <strong className="text-white">/oracle_sql/oracle_schema.sql</strong></span>
              <span className="text-[11px] text-emerald-400">Oracle Database DDL Specification</span>
            </div>
            <pre className="p-4 bg-black text-blue-300 rounded-xl border border-gray-800 overflow-x-auto whitespace-pre-wrap">
              {oracleSchemaContent}
            </pre>
          </div>
        )}

        {/* Tab 3: Oracle SQL Queries */}
        {activeTab === 'oracle-queries' && (
          <div className="p-6 overflow-y-auto space-y-4 flex-1 font-mono text-xs">
            <div className="flex justify-between items-center text-gray-400">
              <span>File: <strong className="text-white">/oracle_sql/oracle_queries.sql</strong></span>
              <span className="text-[11px] text-emerald-400">Oracle DML & CRUD Queries</span>
            </div>
            <pre className="p-4 bg-black text-amber-300 rounded-xl border border-gray-800 overflow-x-auto whitespace-pre-wrap">
              {oracleQueriesContent}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
}
