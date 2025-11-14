import React, { useRef } from "react";

export default function Dropzone({ onFile }) {
  const ref = useRef();

  function handleDrop(e){
    e.preventDefault();
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if(f) onFile(f);
  }
  function handleFile(e){
    const f = e.target.files && e.target.files[0];
    if(f) onFile(f);
    ref.current.value = null;
  }

  return (
    <div
      className="dropzone"
      onDragOver={(e)=>e.preventDefault()}
      onDrop={handleDrop}
      onClick={()=>ref.current.click()}
    >
      <input ref={ref} type="file" accept="image/*,application/pdf" onChange={handleFile} style={{display:"none"}} />
      <div style={{pointerEvents:"none"}}>
        <h3>Drag &amp; drop PDF or Image here</h3>
        <p>or click to browse</p>
      </div>
    </div>
  );
}
