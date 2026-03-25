import React, { useState } from 'react';

const COLORS = ['#7c3aed','#22c77a','#4a9eff','#e05252','#f59e0b','#06b6d4','#9d5ff5','#5b21b6'];

export default function StackQueue() {
  const [stack, setStack]     = useState([]);
  const [queue, setQueue]     = useState([]);
  const [stackVal, setStackVal] = useState('');
  const [queueVal, setQueueVal] = useState('');
  const [stackLog, setStackLog] = useState('$ _');
  const [queueLog, setQueueLog] = useState('$ _');

  // Stack
  const stackPush = () => {
    if (!stackVal.trim()) return;
    setStack(s => [...s, stackVal.trim()]);
    setStackLog(`Pushed: "${stackVal}"\nStack: [${[...stack, stackVal].join(', ')}]\nSize: ${stack.length + 1}`);
    setStackVal('');
  };
  const stackPop = () => {
    if (!stack.length) { setStackLog('Error: Stack Underflow — stack is empty'); return; }
    const top = stack[stack.length - 1];
    const newStack = stack.slice(0, -1);
    setStack(newStack);
    setStackLog(`Popped: "${top}"\nStack: [${newStack.join(', ')}]\nSize: ${newStack.length}`);
  };
  const stackPeek = () => {
    setStackLog(stack.length ? `Top: "${stack[stack.length - 1]}"\nSize: ${stack.length}` : 'Stack is empty');
  };
  const stackClear = () => { setStack([]); setStackLog('Stack cleared'); };

  // Queue
  const enqueue = () => {
    if (!queueVal.trim()) return;
    setQueue(q => [...q, queueVal.trim()]);
    setQueueLog(`Enqueued: "${queueVal}"\nQueue: [${[...queue, queueVal].join(', ')}]\nSize: ${queue.length + 1}`);
    setQueueVal('');
  };
  const dequeue = () => {
    if (!queue.length) { setQueueLog('Error: Queue Underflow — queue is empty'); return; }
    const front = queue[0];
    const newQueue = queue.slice(1);
    setQueue(newQueue);
    setQueueLog(`Dequeued: "${front}"\nQueue: [${newQueue.join(', ')}]\nSize: ${newQueue.length}`);
  };
  const queueFront = () => {
    setQueueLog(queue.length ? `Front: "${queue[0]}"\nRear: "${queue[queue.length - 1]}"\nSize: ${queue.length}` : 'Queue is empty');
  };
  const queueClear = () => { setQueue([]); setQueueLog('Queue cleared'); };

  const nodeStyle = (i) => ({
    background: COLORS[i % COLORS.length], borderRadius: 8, padding: '8px 16px',
    color: '#fff', fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-head)',
    animation: 'none', flexShrink: 0,
  });

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Stack &amp; Queue</h1><p>Welspun AWD · LIFO Stack and FIFO Queue operations</p></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        {/* STACK */}
        <div className="card">
          <div className="section-title">Stack (LIFO – Last In First Out)</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
            <input className="inp" style={{ flex: 1, minWidth: 100 }} placeholder="Value to push…"
              value={stackVal} onChange={e => setStackVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && stackPush()} />
            <button className="btn btn-primary" onClick={stackPush}>Push</button>
            <button className="btn btn-ghost" onClick={stackPop}>Pop</button>
            <button className="btn btn-ghost" onClick={stackPeek}>Peek</button>
            <button className="btn btn-ghost" onClick={stackClear}>Clear</button>
          </div>

          {/* Stack Visualization (bottom to top) */}
          <div style={{ minHeight: 140, display: 'flex', flexDirection: 'column-reverse', gap: 4, marginBottom: 8 }}>
            {stack.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 12, paddingTop: 40 }}>Stack is empty</div>
            )}
            {stack.map((v, i) => (
              <div key={i} style={{ ...nodeStyle(i), textAlign: 'center', position: 'relative' }}>
                {v}
                {i === stack.length - 1 && (
                  <span style={{ position: 'absolute', right: 10, fontSize: 10, opacity: .8, fontFamily: 'var(--font-body)' }}>← TOP</span>
                )}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '3px solid var(--accent)', paddingTop: 4, textAlign: 'center', fontSize: 10, color: 'var(--muted)', fontWeight: 700, letterSpacing: 1 }}>
            BOTTOM
          </div>

          {/* Log */}
          <div style={{ background: '#1e1432', color: '#c4b5fd', fontFamily: "'Courier New', monospace", fontSize: 11, borderRadius: 8, padding: 10, marginTop: 10, whiteSpace: 'pre-wrap', minHeight: 50 }}>
            {stackLog}
          </div>
        </div>

        {/* QUEUE */}
        <div className="card">
          <div className="section-title">Queue (FIFO – First In First Out)</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
            <input className="inp" style={{ flex: 1, minWidth: 100 }} placeholder="Value to enqueue…"
              value={queueVal} onChange={e => setQueueVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && enqueue()} />
            <button className="btn btn-primary" onClick={enqueue}>Enqueue</button>
            <button className="btn btn-ghost" onClick={dequeue}>Dequeue</button>
            <button className="btn btn-ghost" onClick={queueFront}>Front</button>
            <button className="btn btn-ghost" onClick={queueClear}>Clear</button>
          </div>

          {/* Queue Visualization (left = front, right = rear) */}
          <div style={{ minHeight: 80, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
            {queue.length === 0 && (
              <div style={{ color: 'var(--muted)', fontSize: 12 }}>Queue is empty</div>
            )}
            {queue.map((v, i) => (
              <div key={i} style={{ ...nodeStyle(i), position: 'relative' }}>
                {v}
                {i === 0 && <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: 'var(--green)', fontWeight: 700 }}>FRONT</div>}
                {i === queue.length - 1 && queue.length > 1 && <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: 'var(--accent)', fontWeight: 700 }}>REAR</div>}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>
            <span>← DEQUEUE (Front)</span><span>REAR (Enqueue) →</span>
          </div>

          {/* Log */}
          <div style={{ background: '#1e1432', color: '#c4b5fd', fontFamily: "'Courier New', monospace", fontSize: 11, borderRadius: 8, padding: 10, marginTop: 10, whiteSpace: 'pre-wrap', minHeight: 50 }}>
            {queueLog}
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="card">
        <div className="section-title">Real-World Use Cases in Welspun AWD</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', marginBottom: 8 }}>Stack Applications</p>
            {['Undo/Redo in order editing','Browser navigation history','Expression evaluation in reports','Function call stack for API calls','Rollback transactions in stock management'].map(s => (
              <div key={s} style={{ fontSize: 12, color: 'var(--text2)', padding: '4px 0', borderBottom: '1px solid var(--border)', display: 'flex', gap: 6 }}>
                <span style={{ color: 'var(--accent)' }}>▸</span>{s}
              </div>
            ))}
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue)', marginBottom: 8 }}>Queue Applications</p>
            {['Order processing pipeline (FIFO)','Dispatch queue for delivery trucks','Print/export job queue for reports','Customer support ticket handling','Batch stock update requests'].map(s => (
              <div key={s} style={{ fontSize: 12, color: 'var(--text2)', padding: '4px 0', borderBottom: '1px solid var(--border)', display: 'flex', gap: 6 }}>
                <span style={{ color: 'var(--blue)' }}>▸</span>{s}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
